/*eslint-disable*/
import { getAlarmPillList } from "api/alarm";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";
// reactstrap components
import style from "../css/MemberPillCheck.module.css";

// core components

function PillTakePicture(props) {
  const history = useHistory();
  const alarmSeq = props.match.params.alarmSeq;

  const [pillList, setPillList] = useState([]);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    getAlarmPillList(
      alarmSeq,
      (success) => {
        setPillList(success.data.data.pillList);
        setMemberName(success.data.data.nickName);
      },
      (fail) => {
        console.log(fail);
      }
    );
  }, []);

  const gotoCamera = () => {
    props.history.push(`/family/camera/${alarmSeq}`);
    // window.location.href = `/family/camera/${alarmSeq}`
  };

  const PillImageList = (props) => {
    let result = [];
    pillList.forEach((element) => {
      result.push(
        <div style={{ width: `100%` }} key={element}>
          {element.imageURL !== null ? (
            <img src={element.imageURL} alt="약 사진" className={`pt-4 mr-4`} style={{ width: `80%` }}></img>
          ) : (
            <img src="../../../img/basic.png" alt="basic.png" style={{ width: `60%`, borderRadius: `10px` }}></img>
          )}
          <div>
            <span>
              <h5>{element.medicineName}</h5>
            </span>
            <span>
              <h5>{element.count} 개</h5>
            </span>
          </div>
        </div>
      );
    });
    return result;
  };

  return (
    <>
      <div
        className={`${style.center}`}
        style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#eaf0f8", margin: "0 auto" }}
      >
        <div className="pl-4 pt-3">
          <PillImageList></PillImageList>
        </div>
        <div className={`${style.bottom}`}>
          <br></br>
          <Button color="success" className={`${style.bigbnt}`} onClick={gotoCamera}>
            사진 찍기
          </Button>
        </div>
      </div>
    </>
  );
}

export default PillTakePicture;
