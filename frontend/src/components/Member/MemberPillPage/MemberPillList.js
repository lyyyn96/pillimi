/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// reactstrap components
import style from "../css/MemberPillCheck.module.css";
import { getMemberMedicineList } from "../../../api/member";
import { useSelector } from "react-redux";
import ProtectorTakeAlarm from "./ProtectorTakeAlarm";
import Navbar from "layout/Navbar.js";
import { Row, Col } from "reactstrap";
import { getProtegeSeqAlarmList } from "api/alarm";

// core components

function MemberPillList(props) {
  const memberSeq = props.match.params.memberSeq;
  const isProtector = useSelector((state) => state.memberInfo.memberInfo.protector);
  const [pills, setPills] = useState([]);
  const [rightTab, setRightTab] = useState(false);
  // const [datas, setDatas] = useState([]);
  const [tdatas, setTDatas] = useState([]); //getMediList에서 엑시오스 연결을 할 때 tdatas에는 now가 true인 데이터만 뽑아서 넣는다.
  const [ttdatas, setTtDatas] = useState([]); //PillList에서 엑시오스에서 넘어온 모든 데이터를 반복하는게 아니라 true인 데이터만 돌려서 원하는 갯수만큼만 뽑는다.
  const [fdatas, setFDatas] = useState([]); //getMediList에서 엑시오스 연결을 할 때 fdatas에는 now가 false인 데이터만 뽑아서 넣는다.
  const [ffdatas, setFfDatas] = useState([]); //PillList에서 엑시오스에서 넘어온 모든 데이터를 반복하는게 아니라 false인 데이터만 돌려서 원하는 갯수만큼만 뽑는다.
  const [tdropOptions, setTDropOptions] = useState(5);
  const [fdropOptions, setFDropOptions] = useState(5);
  const [newAlarm, setNewAlarm] = useState(false);

  useEffect(() => {
    setTtDatas(tdatas.slice(0, tdropOptions));
    setFfDatas(fdatas.slice(0, fdropOptions));
  }, [tdatas, fdatas, tdropOptions, fdropOptions]);

  const onClickHandler = (state) => {
    setRightTab(state);
  };

  useEffect(() => {
    getMediList();
    getProtegeSeqAlarmList(
      memberSeq,
      (success) => {
        if(success.data.data.length > 0) {
          setNewAlarm(true);
        }
      },
      (fail) => {
        console.log(fail);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onsubmitTbutton = () => {
    setTDropOptions(tdropOptions + 10);
  };

  const onsubmitFbutton = () => {
    setFDropOptions(fdropOptions + 10);
  };
  const getMediList = () => {
    getMemberMedicineList(
      memberSeq,
      (success) => {
        var bools = success.data.data;
        setPills(bools);
        var isTrue = [];
        var isFalse = [];
        bools.forEach((element) => {
          if (element.now === true) {
            isTrue.push(element);
          } else if (element.now === false) {
            isFalse.push(element);
          }
        });
        setTDatas(isTrue);
        setFDatas(isFalse);
      },
      (fail) => {
        console.log(fail);
      }
    );
  };

  const history = useHistory();
  const gotoMedicineDetail = (memMediSeq) => {
    history.push({
      pathname: `/pill-take/detail/${memMediSeq}`,
      state: {
        memberSeq: memberSeq,
      },
    });
  };

  const PillList = (props) => {
    let result = [];
    // if (element.now == props.isNow) {
    if (props.isNow === true) {
      if (ttdatas.length === 0) {
        result.push(<div key={`nothing`}>현재 복용 중인 약이 없습니다.</div>);
      } else {
        ttdatas.forEach((element) => {
          result.push(
            <div
              key={`ttd${element.memberMedicineSeq}`}
              className={`d-flex align-items-center flex-row pl-3 pr-2 ${style.checkAlarm2} `}
              onClick={() => gotoMedicineDetail(element.memberMedicineSeq)}
            >
              <div className={`${style.imgsize2} ml-2`}>
                {element.imageURL !== null ? (
                  <img src={element.imageURL} className={`${style.size}`} alt="이미지"></img>
                ) : (
                  <img src="../../../img/basic.png" style={{ width: `70%`, borderRadius: `10px` }}></img>
                )}
              </div>
              <div className="flex-fill">
                <span>{element.medicineName}</span>
                <br></br>
                <span>({element.memberMedicineName})</span>
                <br></br>
              </div>
            </div>
          );
        });
      }
    } else if (props.isNow === false) {
      if (ffdatas.length === 0) {
        return <div key={`nothing2`}>복용했던 약이 없습니다.</div>;
      } else {
        ffdatas.forEach((element) => {
          result.push(
            <div
              key={`ffd${element.memberMedicineSeq}`}
              className={`d-flex align-items-center flex-row pl-3 pr-2 ${style.checkAlarm2} `}
              onClick={() => gotoMedicineDetail(element.memberMedicineSeq)}
            >
              <div className={`${style.imgsize2} ml-2`}>
                {element.imageURL !== null ? (
                  <img src={element.imageURL} className={`${style.size}`} alt="이미지"></img>
                ) : (
                  <img src="../../../img/basic.png" style={{ width: `70%`, borderRadius: `10px` }}></img>
                )}
              </div>
              <div className="flex-fill">
                <span>{element.medicineName}</span>
                <br></br>
                <span>({element.memberMedicineName})</span>
                <br></br>
              </div>
            </div>
          );
        });
      }
    }
    return result;
  };

  const PillListPage = () => {
    return (
      <div>
        <div className="pt-4">
          <h5>현재 복용 중인 약</h5>
          <PillList isNow={true}></PillList>
          {tdatas.length !== 0 ? (
            tdropOptions < tdatas.length ? (
              <button onClick={onsubmitTbutton} className={style.buttoncolor}>
                더보기
              </button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
        <div className="pt-4">
          <h5>이전에 복용한 약</h5>
          <PillList isNow={false}></PillList>
          {fdatas.length !== 0 ? (
            fdropOptions < fdatas.length ? (
              <button onClick={onsubmitFbutton} className={style.buttoncolor}>
                더보기
              </button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isProtector ? (
        rightTab ? (
          <ProtectorTakeAlarm onClickHandler={onClickHandler} protegeSeq={memberSeq}></ProtectorTakeAlarm>
        ) : (
          <div
            className={`${style.center}`}
            style={{
              minHeight: "100vh",
              width: "100vw",
              backgroundColor: "#EAF0F8",
              margin: "0 auto",
            }}
          >
            <Row xs="2">
              <Col className="pt-2 pb-2 m-0 ">약</Col>
              <Col className="pt-2 pb-2 border border-top-0 border-dark bg-white" onClick={() => onClickHandler(true)}>
                복용확인
                {newAlarm ? (
                    <i
                      className="fa fa-exclamation-circle fa-2x"
                      size="lg"
                      style={{ position: "absolute", color: "red", top: "-14px", right: "7px", zIndex: "1" }}
                    ></i>
                  ) : (
                    <></>
                )}
              </Col>
            </Row>
            <PillListPage></PillListPage>
          </div>
        )
      ) : (
        <div
          className={`${style.center}`}
          style={{
            minHeight: "100vh",
            width: "100vw",
            backgroundColor: "#EAF0F8",
            margin: "0 auto",
          }}
        >
          <PillListPage></PillListPage>
        </div>
      )}
      <Navbar navarray={[false, false, true, false]}/>
    </>
  );
}

export default MemberPillList;
