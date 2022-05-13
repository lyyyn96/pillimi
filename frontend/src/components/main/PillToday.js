/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import PillTodayCSS from "./css/PillToday.module.css";
import { Button } from "reactstrap";
import style from "../Member/css/MemberPillCheck.module.css";

import { getMyFamily } from "../../api/family.js";
import { getPillToday, getMyPillToday } from "../../api/pill.js";
import Navbar from "layout/Navbar.js";

function PillToday() {
  const [familyList, setFamilyList] = useState([]);
  const [pillList, setPillList] = useState([]);
  const [pillListKey, setPillListKey] = useState([]);

  const myName = useSelector((state) => state.memberInfo.memberInfo.nickName);
  const isProtector = useSelector(
    (state) => state.memberInfo.memberInfo.protector
  );

  let firstFamilySeq = "";
  const history = useHistory();

  useEffect(() => {
    if (isProtector === true) {
      getFamilyList();
    } else {
      getMyPillTodayList();
    }
  }, []);

  const getFamilyList = () => {
    getMyFamily(
      (response) => {
        setFamilyList(response.data.data);
        if (familyList !== "") {
          firstFamilySeq = response.data.data[0].memberSeq;
          getPillToday(
            firstFamilySeq,
            (response) => {
              setPillListKey(Object.getOwnPropertyNames(response.data.data));
              setPillList(response.data.data);
            },
            (error) => {
              console.log(error);
            }
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const getMyPillTodayList = () => {
    getMyPillToday(
      (response) => {
        setPillListKey(Object.getOwnPropertyNames(response.data.data));
        setPillList(response.data.data);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const otherFamily = (memberSeq) => {
    setPillListKey([]);
    setPillList([]);
    getPillToday(
      memberSeq,
      (response) => {
        setPillListKey(Object.getOwnPropertyNames(response.data.data));
        setPillList(response.data.data);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const gotoPillTakePicture = (alarmSeq) => {
    history.push({
      pathname: `/member-pill-page/pill-take-picture/${alarmSeq}`,
    });
  };

  const ShowPillList = () => {
    let result = [];
    let itemLength = 0;
    let medicineName = "";
    let imageURL = "";
    let memberMedicineName = "";
    let taken = "";
    let hour = "";
    let min = "";
    let resultTime = "";

    pillListKey.forEach((element, index) => {
      if (pillListKey.length !== 0) {
        hour = "";
        min = "";
        resultTime = "";

        hour = element.split(" ")[0].split(":")[0];
        min = element.split(" ")[0].split(":")[1];

        if (hour < 12) {
          resultTime += "오전 ";
          if (hour < 10) {
            resultTime += hour.substring(1, 2);
          } else {
            resultTime += hour;
          }
          resultTime += "시 ";
        } else {
          resultTime += "오후 ";
          if (hour === "12") {
            resultTime += hour;
          } else {
            resultTime += hour - 12;
          }
          resultTime += "시 ";
        }

        if (min !== "00") {
          resultTime += min + "분";
        }

        result.push(
          <>
            <div className={PillTodayCSS.WhiteBox}>
              <br></br>
              <h3 className={PillTodayCSS.TimeText}>{resultTime}</h3>
              <br></br>
            </div>
          </>
        );
        if (pillList.length !== 0) {
          itemLength = pillList[element].length;

          for (var i = 0; i < itemLength; i++) {
            medicineName = pillList[element][i].medicineName;
            imageURL = pillList[element][i].imageURL;
            memberMedicineName = pillList[element][i].memberMedicineName;
            result.push(
              <>
                <div
                  className={`d-flex align-items-center flex-row pl-3 pr-2 ${PillTodayCSS.WhiteBox} ${PillTodayCSS.ItemAlign}`}
                >
                  <div className={`${style.imgsize2} ml-2`}>
                    <img
                      src={imageURL}
                      className={`${style.size}`}
                      alt="pillImg"
                    ></img>
                  </div>
                  <div className="flex-fill">
                    <span>{medicineName}</span>
                    <br></br>
                    <span>({memberMedicineName})</span>
                    <br></br>
                  </div>
                </div>
              </>
            );

            if (i === itemLength - 1) {
              taken = pillList[element][0].taken;
              if (taken === true) {
                result.push(
                  <>
                    <br></br>
                    <br></br>
                    <Button className={PillTodayCSS.DoneBtn}>복용 완료</Button>
                    <br></br>
                  </>
                );
              } else if (taken === false) {
                if (isProtector === false) {
                  result.push(
                    <>
                      <div className={PillTodayCSS.WhiteBox}>
                        <br></br>
                        <br></br>
                        <Button
                          onClick={() =>
                            gotoPillTakePicture(element.split(" ")[1])
                          }
                          className={PillTodayCSS.PictureBtn}
                        >
                          사진 찍기
                        </Button>
                        <br></br>
                      </div>
                    </>
                  );
                } else {
                  result.push(
                    <>
                      <div className={PillTodayCSS.WhiteBox}>
                        <br></br>
                      </div>
                    </>
                  );
                }
              }
            }
          }
        }
      }

      result.push(
        <>
          <div className={PillTodayCSS.Background}>&nbsp;</div>
        </>
      );
    });

    return result;
  };

  const FamilyName = () => {
    let result = [];
    if (familyList !== "") {
      familyList.forEach((element) => {
        result.push(
          <>
            <div
              style={{ cursor: "pointer", display: "inline" }}
              onClick={() => otherFamily(element.memberSeq)}
            >
              <div>
                <img
                  style={{ display: "block" }}
                  src={element.memberImage}
                  alt="memberImg"
                  className={PillTodayCSS.img}
                ></img>
              </div>
              <div>{element.memberName}</div>
            </div>
          </>
        );
      });
    }
    return result;
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#eaf0f8",
          width: "100vw",
          minHeight: "100vh",
          margin: "0 auto",
        }}
      >
        <div className={PillTodayCSS.Header}>
          <span className={PillTodayCSS.MemberName}>{myName}</span>
        </div>
        <div className={PillTodayCSS.Family}>
          <FamilyName></FamilyName>
        </div>
        <br></br>
        <br></br>
        <h3 className={PillTodayCSS.MainText}>시간에 맞춰 복약하세요!</h3>
        <br></br>
        <ShowPillList></ShowPillList>
      </div>
      <Navbar/>
    </>
  );
}

export default PillToday;
