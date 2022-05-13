import React, { useState } from "react";
import { Input, Badge, Button, FormGroup, Row, Col } from "reactstrap";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Swal from "sweetalert2";
// import moment from "moment";

import PillTakeRegisterCSS from "../css/PillTakeRegister.module.css";
import Header from "components/Headers/Header";
import { regmedicine } from "../../../api/member";
import { useSelector } from "react-redux";
import 'moment/locale/ko';

function PillTakeRegister(props) {
  const [pillRegister, setPillRegister] = useState({
    nick: "",
    startDate: "",
    endDate: "",
    period: "",
    time: [],
    volume: "",
    caution: "",
  });
  const [timeinput, settimeinput] = useState("");

  const [smallend, setsmallend] = useState(false);
  const [bigstart, setbigstart] = useState(false);
  const [checkday, setday] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [timecheck, settimecheck] = useState(false);

  const regimedicine = () => {
    var saveintakeDay = [];
    for (var i = 0; i < 7; i++) {
      if (checkday[i] === true) {
        saveintakeDay.push(i + 1);
      }
    }
    var saveintakeTime = [];
    for (var j = 0; j < pillRegister.time.length; j++) {
      if (pillRegister.time[j].slice(6, 8) === "오후") {
        saveintakeTime.push(
          String(parseInt(pillRegister.time[j].slice(0, 2)) + 12) +
            pillRegister.time[j].slice(2, 5)
        );
      } else saveintakeTime.push(pillRegister.time[j].slice(0, 5));
    }
    console.log(saveintakeTime);
    for (var k = 0; k < saveintakeTime.length; k++) {
      if (parseInt(saveintakeTime[k].slice(0, 2)) > 23) {
        saveintakeTime[k] = "00" + saveintakeTime[k].slice(2, 5);
      }
    }
    console.log(saveintakeTime);
    console.log({
      endDay: pillRegister.endDate,
      intakeCount: parseInt(pillRegister.volume),
      intakeDay: saveintakeDay,
      intakeTime: saveintakeTime,
      medicineSeq: parseInt(props.location.state.medicineSeq),
      memberMedicineName: pillRegister.nick,
      memberSeq: parseInt(props.location.state.memberSeq),
      remarkContent: pillRegister.caution,
      startDay: pillRegister.startDate,
    });
    if (!pillRegister.nick) {
      Swal.fire({
        icon: "error",
        title: "별칭을 입력해주세요.",
        confirmButtonColor: `#ff3636`,
      });
    } else if (!pillRegister.startDate) {
      Swal.fire({
        icon: "error",
        title: "시작 일자를 입력해주세요.",
        confirmButtonColor: `#ff3636`,
      });
    } else if (!pillRegister.endDate) {
      Swal.fire({
        icon: "error",
        title: "종료 일자를 입력해주세요.",
        confirmButtonColor: `#ff3636`,
      });
    } else if (saveintakeDay.length === 0) {
      Swal.fire({
        icon: "error",
        title: "복용 요일을 입력해주세요.",
        confirmButtonColor: `#ff3636`,
      });
    } else if (saveintakeTime.length === 0) {
      Swal.fire({
        icon: "error",
        title: "복용 시간을 입력해주세요.",
        confirmButtonColor: `#ff3636`,
      });
    } else if (!pillRegister.volume) {
      Swal.fire({
        icon: "error",
        title: "복용 개수을 입력해주세요.",
        confirmButtonColor: `#ff3636`,
      });
    } else {
      regmedicine(
        {
          endDay: pillRegister.endDate,
          intakeCount: parseInt(pillRegister.volume),
          intakeDay: saveintakeDay,
          intakeTime: saveintakeTime,
          medicineSeq: parseInt(props.location.state.medicineSeq),
          memberMedicineName: pillRegister.nick,
          memberSeq: parseInt(props.location.state.memberSeq),
          remarkContent: pillRegister.caution,
          startDay: pillRegister.startDate,
        },
        (success) => {
          console.log(success);
          Swal.fire({
            icon: "success",
            title: `${props.location.state.medicineName}을(를) 등록했습니다.`,
            confirmButtonColor: `#0369a1`,
          }).then(gotoMedicineList());
        },
        (fail) => {
          console.log(fail);
        }
      );
    }
  };

  const changeday = (index) => {
    setday([
      ...checkday.slice(0, index),
      !checkday[index],
      ...checkday.slice(index + 1),
    ]);
    console.log(checkday);
  };

  const onChangetimeinput = (e) => {
    settimeinput(e.format("hh:mm A"));
    settimecheck(false);
    console.log(timeinput);
  };

  const pushtime = () => {
    if (!pillRegister.time.includes(timeinput)) {
      setPillRegister({
        ...pillRegister,
        time: [...pillRegister.time, timeinput],
      });
      settimeinput("")
    } else {
      settimecheck(true);
    }
    console.log(pillRegister.time);
  };

  const deletetime = (index) => {
    setPillRegister({
      ...pillRegister,
      time: [
        ...pillRegister.time.slice(0, index),
        ...pillRegister.time.slice(index + 1),
      ],
    });
  };

  const onChangePillRegister = (e) => {
    // if (moment.isMoment(e)) {
    //   if (e.name === "time") {
    //     setPillRegister({
    //       ...pillRegister,
    //       [e.name]: e.format("hh:mm A"),
    //     });
    //     settimecheck(false);
    //     console.log(pillRegister.time);
    //   } else {
    //     setPillRegister({
    //       ...pillRegister,
    //       [e.name]: e.format("YYYY-MM-DD"),
    //     });
    //     console.log(pillRegister.startDate);
    //   }
    // } else {
    //   setPillRegister({
    //     ...pillRegister,
    //     [e.target.name]: e.target.value,
    //   });
    // }
    if (e.name === "startDate") {
      if (
        pillRegister.endDate &&
        e.format("YYYY-MM-DD") > pillRegister.endDate
      ) {
        setsmallend(true);
        setbigstart(false);
        setPillRegister({
          ...pillRegister,
          [e.name]: "",
        });
      } else {
        setPillRegister({
          ...pillRegister,
          [e.name]: e.format("YYYY-MM-DD"),
        });
        setbigstart(false);
        setsmallend(false);
      }
    } else if (e.name === "endDate") {
      if (
        pillRegister.startDate &&
        e.format("YYYY-MM-DD") < pillRegister.startDate
      ) {
        setsmallend(false);
        setbigstart(true);
        setPillRegister({
          ...pillRegister,
          [e.name]: "",
        });
      } else {
        setPillRegister({
          ...pillRegister,
          [e.name]: e.format("YYYY-MM-DD"),
        });
        setbigstart(false);
        setsmallend(false);
      }
    } else {
      setPillRegister({
        ...pillRegister,
        [e.target.name]: e.target.value,
      });
    }
  };

  const gotoMedicineList = () => {
    window.location.href = `/member-pill-page/member-pill-list/` + props.location.state.memberSeq;
  }
  let isProtector = useSelector((state) => state.memberInfo.memberInfo.protector);
  if(!isProtector){
    Swal.fire({
      icon: "warning",
      title: "권한이 없는 페이지입니다.",
      confirmButtonColor: `#ff0000`,
    }).then(function () {
      props.history.push(`/`)
    });
    return(
      <div></div>
    )
  }
  return (
    <>
      <Header header="복용 약 추가"  canBack={true}></Header>
      <br></br>
      <h3 className={PillTakeRegisterCSS.PillName}>
        {props.location.state.medicineName}
      </h3>
      <div className={PillTakeRegisterCSS.Whole}>
        {/* <Label content={"약 별칭"}></Label>
        <DateLabel content={"복용 시작 일자"}></DateLabel>
        <DateLabel content={"복용 종료 일자"}></DateLabel>
        <NumberLabel content={"복용 주기"}></NumberLabel>
        <TimeLabel content={"복용 시간"}></TimeLabel>
        <NumberLabel content={"복용 용량"}></NumberLabel>
        <Label content={"섭취 후 특이사항"}></Label> */}
        <br></br>
        <h3 className={PillTakeRegisterCSS.Label}>약 별칭</h3>
        <FormGroup>
          <Input
            onChange={onChangePillRegister}
            name="nick"
            className={PillTakeRegisterCSS.Input}
            type="text"
          ></Input>
        </FormGroup>
        <br></br>
        <h3 className={PillTakeRegisterCSS.Label}>복용 시작 일자</h3>
        {smallend ? (
          <h5
            style={{
              width: "100%",
              color: "red",
            }}
            color="danger"
          >
            종료 일자보다 작은 날짜를 입력하세요
          </h5>
        ) : null}
        <FormGroup>
          <Datetime
            onChange={(e) => {
              e.name = "startDate";
              onChangePillRegister(e);
            }}
            value={pillRegister.startDate}
            name="startDate"
            className={PillTakeRegisterCSS.Input}
            timeFormat={false}
            closeOnSelect
            dateFormat="yyyy-MM-DD"
            locale="ko"
            strictParsing={false}
            renderInput={(props) => {
              return (
                <input readOnly style={{backgroundColor:"white"}}
                  {...props}
                  value={smallend ? "" : pillRegister.startDate}
                />
              );
            }}
          />
        </FormGroup>
        <br></br>
        <h3 className={PillTakeRegisterCSS.Label}>복용 종료 일자</h3>
        {bigstart ? (
          <h5
            style={{
              width: "100%",
              color: "red",
            }}
            color="danger"
          >
            시작 일자보다 큰 날짜를 입력하세요
          </h5>
        ) : null}
        <FormGroup>
          <Datetime
            onChange={(e) => {
              e.name = "endDate";
              onChangePillRegister(e);
            }}
            name="endDate"
            value={pillRegister.endDate}
            className={PillTakeRegisterCSS.Input}
            timeFormat={false}
            dateFormat="yyyy-MM-DD"
            locale="ko"
            closeOnSelect
            strictParsing={false}
            renderInput={(props) => {
              return (
                <input readOnly style={{backgroundColor:"white"}}
                  {...props}
                  value={bigstart ? "" : pillRegister.endDate}
                />
              );
            }}
          />
        </FormGroup>
        <br></br>
        <h3 className={PillTakeRegisterCSS.Label}>복용 요일</h3>
        <FormGroup className={PillTakeRegisterCSS.DayGroup}>
          {/* <Badge className={sunday ?"PillTakeRegisterCSS.selDay" :"PillTakeRegisterCSS.Day"} color="default" onClick={setsun(prevsunday => !prevsunday)}>
            월
          </Badge>
          <Badge className={monday ?"PillTakeRegisterCSS.selDay" :"PillTakeRegisterCSS.Day"} color="default" onClick={setmon(prevmonday => !prevmonday)}>
            화
          </Badge>
          <Badge className={tueday ?"PillTakeRegisterCSS.selDay" :"PillTakeRegisterCSS.Day"} color="default" onClick={settue(prevtueday => !prevtueday)}>
            수
          </Badge>
          <Badge className={wedday ?"PillTakeRegisterCSS.selDay" :"PillTakeRegisterCSS.Day"} color="default" onClick={setwed(prevwedday => !prevwedday)}>
            목
          </Badge>
          <Badge className={thuday ?"PillTakeRegisterCSS.selDay" :"PillTakeRegisterCSS.Day"} color="default" onClick={setthu(prevthuday => !prevthuday)}>
            금
          </Badge>
          <Badge className={friday ?"PillTakeRegisterCSS.selDay" :"PillTakeRegisterCSS.Day"} color="default" onClick={setfri(prevfriday => !prevfriday)}>
            토
          </Badge>
          <Badge className={satday ?"PillTakeRegisterCSS.selDay" :"PillTakeRegisterCSS.Day"} color="default" onClick={setsat(prevsatday => !prevsatday)}>
            일
          </Badge> */}
          <Badge
            className={
              checkday[0] ? PillTakeRegisterCSS.selDay : PillTakeRegisterCSS.Day
            }
            color="default"
            onClick={() => {
              changeday(0);
            }}
          >
            월
          </Badge>
          <Badge
            className={
              checkday[1] ? PillTakeRegisterCSS.selDay : PillTakeRegisterCSS.Day
            }
            color="default"
            onClick={() => {
              changeday(1);
            }}
          >
            화
          </Badge>
          <Badge
            className={
              checkday[2] ? PillTakeRegisterCSS.selDay : PillTakeRegisterCSS.Day
            }
            color="default"
            onClick={() => {
              changeday(2);
            }}
          >
            수
          </Badge>
          <Badge
            className={
              checkday[3] ? PillTakeRegisterCSS.selDay : PillTakeRegisterCSS.Day
            }
            color="default"
            onClick={() => {
              changeday(3);
            }}
          >
            목
          </Badge>
          <Badge
            className={
              checkday[4] ? PillTakeRegisterCSS.selDay : PillTakeRegisterCSS.Day
            }
            color="default"
            onClick={() => {
              changeday(4);
            }}
          >
            금
          </Badge>
          <Badge
            className={
              checkday[5] ? PillTakeRegisterCSS.selDay : PillTakeRegisterCSS.Day
            }
            color="default"
            onClick={() => {
              changeday(5);
            }}
          >
            토
          </Badge>
          <Badge
            className={
              checkday[6] ? PillTakeRegisterCSS.selDay : PillTakeRegisterCSS.Day
            }
            color="default"
            onClick={() => {
              changeday(6);
            }}
          >
            일
          </Badge>
        </FormGroup>
        <br></br>
        <div className="d-flex align-items-center">
          <h3
            className={`${PillTakeRegisterCSS.Label} flex-fill
            `}
          >
            복용 시간
          </h3>

          <i
            onClick={() => {
              if (timeinput !== "") {
                pushtime();
              }
            }}
            className={`${PillTakeRegisterCSS.TimePlus} now-ui-icons ui-1_simple-add`}
          ></i>
        </div>
        {timecheck ? (
          <h5
            style={{
              width: "100%",
              color: "red",
            }}
            color="danger"
          >
            이미 등록된 시간입니다.
          </h5>
        ) : null}
        <FormGroup>
          <Datetime
            onChange={(e) => {
              e.name = "time";
              onChangetimeinput(e);
            }}
            name="time"
            className={PillTakeRegisterCSS.Input}
            dateFormat={false}
            timeConstraints={{
              minutes: { step: 10 },
            }}
            strictParsing={false}
            renderInput={(props) => {
              return (
                <input readOnly style={{backgroundColor:"white"}}
                  {...props}
                  value={timeinput}
                />
              );
            }}
          />
        </FormGroup>
        <Row xs="3" sm="4" md="6" style={{ justifyContent: "start" }}>
          {pillRegister.time.map((value, index) => (
            <Col
              key={index}
              xs="4"
              sm="3"
              md="2"
              style={{ padding: "0px", textAlign: "center" }}
            >
              <Badge
                className={PillTakeRegisterCSS.Badge}
                color="info"
                id="timeList"
              >
                {value}&nbsp;&nbsp;
                <Badge
                  className={PillTakeRegisterCSS.Badge}
                  color="danger"
                  id="timeList"
                  onClick={() => {
                    deletetime(index);
                  }}
                >
                  X
                </Badge>
              </Badge>
            </Col>
          ))}
        </Row>

        <br></br>
        <h3 className={PillTakeRegisterCSS.Label}>복용 개수</h3>
        <FormGroup>
          <Input
            onChange={onChangePillRegister}
            name="volume"
            className={PillTakeRegisterCSS.Input}
            type="number"
          ></Input>
        </FormGroup>
        <br></br>
        <h3 className={PillTakeRegisterCSS.Label}>섭취 후 특이사항</h3>
        <FormGroup>
          <Input
            onChange={onChangePillRegister}
            name="caution"
            className={PillTakeRegisterCSS.Input}
            type="text"
          ></Input>
        </FormGroup>
      </div>
      <br></br>
      <br></br>
      <Button
        className={PillTakeRegisterCSS.DoneBtn}
        onClick={() => {
          regimedicine();
        }}
      >
        완료
      </Button>
      <br></br>
      <br></br>
    </>
  );
}

// function Label(params) {
//   return (
//     <>
//       <br></br>
//       <h3 className={PillTakeRegisterCSS.Label}>{params.content}</h3>
//       {/* {(function () {
//         if (`${params.content}` === "약 별칭")
//           return (
//             <Input
//               onChange={PillTakeRegister.onChangePillRegister}
//               id="nick"
//               name="nick"
//               className={PillTakeRegisterCSS.Input}
//               type="text"
//             ></Input>
//           );
//         else
//           return (
//             <Input
//               onChange={PillTakeRegister.onChangePillRegister}
//               id="caution"
//               name="caution"
//               className={PillTakeRegisterCSS.Input}
//               type="text"
//             ></Input>
//           );
//       })()} */}
//       <h3 className={PillTakeRegisterCSS.Label}>{params.content}</h3>
//       <Input className={PillTakeRegisterCSS.Input} type="text"></Input>
//       <Input className={PillTakeRegisterCSS.Input} type="text"></Input>
//     </>
//   );
// }

// function DateLabel(params) {
//   return (
//     <>
//       <br></br>
//       <h3 className={PillTakeRegisterCSS.Label}>{params.content}</h3>
//       <Datetime className={PillTakeRegisterCSS.Input} timeFormat={false} />
//     </>
//   );
// }

// function TimeLabel(params) {
//   return (
//     <>
//       <br></br>
//       <div className="d-flex align-items-center">
//         <h3
//           className={`${PillTakeRegisterCSS.Label} flex-fill
//         `}
//         >
//           {params.content}
//         </h3>
//         <i className={`${PillTakeRegisterCSS.TimePlus} now-ui-icons ui-1_simple-add`}></i>
//       </div>
//       <Datetime className={PillTakeRegisterCSS.Input} dateFormat={false} />{" "}
//     </>
//   );
// }

// function NumberLabel(params) {
//   const [number, setNumber] = useState("");

//   const onChange = (e) => {
//     setNumber(e.target.value);
//   };

//   return (
//     <>
//       <br></br>
//       <h3 className={PillTakeRegisterCSS.Label}>{params.content}</h3>
//       <Input onChange={onChange} value={number} className={PillTakeRegisterCSS.Input} type="number"></Input>
//     </>
//   );
// }

export default PillTakeRegister;
