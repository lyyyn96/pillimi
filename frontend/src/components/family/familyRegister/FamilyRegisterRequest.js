/*eslint-disable*/
import React, { useState, useEffect } from "react";
import "../familycss.css";

// reactstrap components
import {
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Card,
  Button,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";

// core components

function FamilyRegisterRequest(props) {
  useEffect(() => {
    props.getheader("가족 등록");
    props.getnavbar(false);
  });
  const [phonenumber, setphonenumber] = useState("");
  const [membername, setmembername] = useState("");
  const [nameok, setnameok] = useState(false);
  const [numberok, setnumberok] = useState(false);
  const checkname = (event) => {
    var strname = event.currentTarget.value;
    if (strname.length > 0) {
      var strname2 = strname.substr(0, strname.length - 1).replace(/[^가-힣]/g, "");
      if (strname.length > 1 && /[가-힣]/.test(strname[strname.length - 1])) {
        setnameok(true);
      } else {
        setnameok(false);
      }
      setmembername(strname2 + strname[strname.length - 1]);
    } else {
      setmembername(strname);
      setnameok(false);
    }
  };
  const checknumber = (event) => {
    var str = event.currentTarget.value.replace(/[^0-9]/g, "");
    var tmp = "";
    if (str.substring(0, 2) == "02") {
      if (str.length > 8) {
        setnumberok(true);
      } else {
        setnumberok(false);
      }
      // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
      if (str.length < 3) {
        setphonenumber(str);
      } else if (str.length < 6) {
        tmp += str.substr(0, 2);
        tmp += "-";
        tmp += str.substr(2);
        setphonenumber("tmp");
      } else if (str.length < 10) {
        tmp += str.substr(0, 2);
        tmp += "-";
        tmp += str.substr(2, 3);
        tmp += "-";
        tmp += str.substr(5);
        setphonenumber(tmp);
      } else {
        tmp += str.substr(0, 2);
        tmp += "-";
        tmp += str.substr(2, 4);
        tmp += "-";
        tmp += str.substr(6, 4);
        setphonenumber(tmp);
      }
    } else {
      if (str.length > 9) {
        setnumberok(true);
      } else {
        setnumberok(false);
      }
      // 핸드폰 및 다른 지역 전화번호 일 경우
      if (str.length < 4) {
        setphonenumber(str);
      } else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += "-";
        tmp += str.substr(3);
        setphonenumber(tmp);
      } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += "-";
        tmp += str.substr(3, 3);
        tmp += "-";
        tmp += str.substr(6);
        setphonenumber(tmp);
      } else {
        tmp += str.substr(0, 3);
        tmp += "-";
        tmp += str.substr(3, 4);
        tmp += "-";
        tmp += str.substr(7);
        setphonenumber(tmp);
      }
    }
  };

  const requestFamily = () => {
    let memberInfo = {
      memberName: membername,
      memberPhone: phonenumber
    }
    requestAddFamily(memberInfo,
      ( success ) => {
        console.log(success)
      }, ( fail ) => {
        console.log(fail)
      })
  }
  
  return (
    <>
      <Container style={{ padding: "50px" }}>
        <Row>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="now-ui-icons users_circle-08"></i>
              </InputGroupText>
            </InputGroupAddon>
            <Input placeholder="성함" type="text" onChange={checkname} value={membername} maxLength="10"></Input>
          </InputGroup>
          {nameok == false ? (
            <div
              style={{
                width: "100%",
                height: "50px",
                paddingLeft: "20px",
                color: "red",
              }}
              color="danger"
            >
              이름은 한글로 2~10글자 입력가능합니다.
            </div>
          ) : (
            <div style={{ height: "50px", width: "100%" }}></div>
          )}
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="now-ui-icons tech_mobile"></i>
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="전화번호"
              type="text"
              onChange={checknumber}
              value={phonenumber}
              pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
              maxLength="13"
            ></Input>
          </InputGroup>
          {numberok == false ? (
            <div
              style={{
                width: "100%",
                height: "50px",
                paddingLeft: "20px",
                color: "red",
              }}
              color="danger"
            >
              전화번호는 숫자로 9~11글자 입력가능합니다.
            </div>
          ) : (
            <div style={{ height: "50px", width: "100%" }}></div>
          )}
        </Row>
        <Row>
          <Card style={{ marginTop: "30px", marginBottom: "30px" }}>
            <div id="reg_caution">
              어르신을 가족회원으로 추가하는 경우, 요청 및 승인 과정이 필수입니다. 가족회원의 핸드폰에서 동의 요청을
              승낙하세요
            </div>
          </Card>
        </Row>
        <Row>
          {numberok && nameok == true ? (
            <Button className="activebtn" size="lg">
              완료
            </Button>
          ) : (
            <div className="text-center">
              <Button id="confirmbutton" className="unactivebtn" size="lg">
                완료
              </Button>
              <UncontrolledTooltip placement="bottom" target="confirmbutton" trigger="click">
                이름과 전화번호를 정확히 입력했는지 확인해주세요.
              </UncontrolledTooltip>
            </div>
          )}
        </Row>
      </Container>
    </>
  );
}

export default FamilyRegisterRequest;
