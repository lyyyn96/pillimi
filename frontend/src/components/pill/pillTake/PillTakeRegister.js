import React, { useState } from "react";
import { Input, Badge, Button, FormGroup, Row, Col } from "reactstrap";
import Datetime from "react-datetime";
import moment from "moment";

import PillTakeRegisterCSS from "../css/PillTakeRegister.module.css";
import Header from "components/Headers/Header";
import { regmedicine } from '../../../api/member';

function PillTakeRegister() {
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
  // const [sunday, setsun] = useState(false);
  // const [monday, setmon] = useState(false);
  // const [tueday, settue] = useState(false);
  // const [wedday, setwed] = useState(false);
  // const [thuday, setthu] = useState(false);
  // const [friday, setfri] = useState(false);
  // const [satday, setsat] = useState(false);
  const regimedicine = () => {
    regmedicine({
      "endDay": pillRegister.endDate,
      "intakeCount": 2,
      "intakeDay": [
        1,
        3,
        4
      ],
      "intakeTime": [
        720,
        840
      ],
      "medicineSeq": 1,
      "memberMedicineName": pillRegister.nick,
      "memberSeq": 1,
      "remarkContent": pillRegister.caution,
      "startDay": pillRegister.startDate
    },
      (success) => {
        console.log(success);
      }, (fail) => {
        console.log(fail);
      })
  }

  const changeday = (index) => {
    setday([
      ...checkday.slice(0, index),
      !checkday[index],
      ...checkday.slice(index + 1),
    ]);
  };

  const onChangetimeinput = (e) => {
    settimeinput(e.format("hh:mm A"));
    console.log(timeinput);
  };

  const pushtime = () => {
    if (!pillRegister.time.includes(timeinput)) {
      setPillRegister({
        ...pillRegister,
        time: [...pillRegister.time, timeinput],
      });
    } else {
      settimecheck(true);
    }
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
    console.log(e._i);
    if (moment.isMoment(e)) {
      if (e.name === "time") {
        setPillRegister({
          ...pillRegister,
          [e.name]: e.format("hh:mm A"),
        });
        settimecheck(false);
        console.log(pillRegister.time);
      } else {
        setPillRegister({
          ...pillRegister,
          [e.name]: e.format("YYYY/MM/DD"),
        });
        console.log(pillRegister.startDate);
      }
    } else {
      setPillRegister({
        ...pillRegister,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <>
      <Header header="복용 약 추가"></Header>
      <br></br>
      <h3 className={PillTakeRegisterCSS.PillName}>에이서캡슐(아세클로페낙)</h3>
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
          />
        </FormGroup>
        <br></br>
        <h3 className={PillTakeRegisterCSS.Label}>복용 종료 일자</h3>
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
            value={timeinput}
            className={PillTakeRegisterCSS.Input}
            dateFormat={false}
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
      <Button className={PillTakeRegisterCSS.DoneBtn}>완료</Button>
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
