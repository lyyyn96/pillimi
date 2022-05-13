/*eslint-disable*/
import React from "react";
import { useState, useEffect } from "react";

// reactstrap components
import { Button, Container, FormGroup, Form, Input } from "reactstrap";
import style from "../css/MemberInfo.module.css";
import Datetime from 'react-datetime';
import { getMemberInfoDetail, modifyMemberInfo } from '../../../api/member'
import moment from "moment";
import 'moment/locale/ko'
import Navbar from "layout/Navbar.js";
import Swal from "sweetalert2";

// core components


function MemberInfoModify(props) {

  const memberSeq = props.match.params.memberSeq;

  const [profile, setProfile] = useState({
    member_nickname: "",
    member_img: "",
    member_birthDate: "",
    member_phone: "",
    member_isprotector: 0
  });

  const [isProtector, setIsProtector] = useState(false);

  const onChangeProfile = (e) => {
    if (moment.isMoment(e)){
        setProfile({...profile, [e.name]:e._d});
        console.log(profile.member_birthDate)
    }
    else{
        console.log(e.target.value);
        setProfile({...profile, [e.target.name]:e.target.value});
    }
  }

  const [numberok, setnumberok] = useState(false);

  const checknumber = (event) => {
    var str = event.currentTarget.value.replace(/[^0-9]/g, "");
    var tmp = {
      target:{
        name: 'member_phone',
        value: str
      }
    };
    if (str.substring(0, 2) == "02") {
      if (str.length > 8) {
        setnumberok(true);
      } else {
        setnumberok(false);
      }
      // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
      if (str.length < 3) {
        onChangeProfile(tmp);
      } else if (str.length < 6) {
        tmp.target.value = str.substr(0, 2);
        tmp.target.value += "-";
        tmp.target.value += str.substr(2);
        onChangeProfile(tmp);
      } else if (str.length < 10) {
        tmp.target.value = str.substr(0, 2);
        tmp.target.value += "-";
        tmp.target.value += str.substr(2, 3);
        tmp.target.value += "-";
        tmp.target.value += str.substr(5);
        onChangeProfile(tmp);
      } else {
        tmp.target.value = str.substr(0, 2);
        tmp.target.value += "-";
        tmp.target.value += str.substr(2, 4);
        tmp.target.value += "-";
        tmp.target.value += str.substr(6, 4);
        onChangeProfile(tmp);
      }
    } else {
      if (str.length > 9) {
        setnumberok(true);
      } else {
        setnumberok(false);
      }
      // 핸드폰 및 다른 지역 전화번호 일 경우
      if (str.length < 4) {
        onChangeProfile(tmp);
      } else if (str.length < 7) {
        tmp.target.value = str.substr(0, 3);
        tmp.target.value += "-";
        tmp.target.value += str.substr(3);
        onChangeProfile(tmp);
      } else if (str.length < 11) {
        tmp.target.value = str.substr(0, 3);
        tmp.target.value += "-";
        tmp.target.value += str.substr(3, 3);
        tmp.target.value += "-";
        tmp.target.value += str.substr(6);
        onChangeProfile(tmp);
      } else {
        tmp.target.value = str.substr(0, 3);
        tmp.target.value += "-";
        tmp.target.value += str.substr(3, 4);
        tmp.target.value += "-";
        tmp.target.value += str.substr(7);
        onChangeProfile(tmp);
      }
    }
  };
  
  useEffect(() => {
    console.log("마운트")
    console.log(props.match.params.memberSeq);
    getMemberDetail(memberSeq);
  },[])

  const getMemberDetail = (memberSeq) => {
    getMemberInfoDetail(memberSeq,
      (success) => {
        console.log(success);
        setProfile({
          member_nickname: success.data.data.nickName,
          member_img: success.data.data.memberImage,
          member_birthDate: success.data.data.birthDate==null? null : new Date(success.data.data.birthDate),
          member_phone: success.data.data.phone,
        })
        console.log(success.data.data.nickName);
        props.getheader(String(success.data.data.nickName));
        if(success.data.data.birthDate==null){
          setIsProtector(true);
        }
      }, (fail) => {
        console.log(fail);
      })
  }

  
  function dateformat(bDay){
    if(moment.isMoment(bDay)) return "2022-02-13";
    else{
      var month = bDay.getMonth() + 1;
      if (month < 10) month = "0" + month;
      var day = bDay.getDate();
      if (day < 10) day = "0" + day;
      var tmp = bDay.getFullYear() + "-" + month + "-" + day;
      return tmp;
    }
  }

  const modifyInfo = () => {
    let birthDate = dateformat(new Date(profile.member_birthDate));
    let memberInfo = {
      birthDate: isProtector ? null : birthDate,
      memberSeq: memberSeq,
      nickName: profile.member_nickname,
      phone: profile.member_phone
    }
    modifyMemberInfo(memberInfo,
      ( success ) => {
        console.log(success)
        Swal.fire({
          icon: "success",
          title: "수정되었습니다.",
          confirmButtonColor: `#0369a1`,
        }).then(function () {
          props.history.push(`/member-info/member-info-detail/` + memberSeq);
        });
      }, ( fail ) => {
        console.log(fail)
      })
  }

  const gotoMemberInfoDetail = () =>{
    window.location.href = "/member-info/member-info-detail/"+memberSeq;
  }

  if(!isProtector){
    return (
      <>
        <div id="pillimi" className={`${style.center}`}>
          <img src={profile.member_img} className={`${style.imgsize} mt-5`} alt="프로필 사진"></img>
          <br></br>
          <div>
          <Form>
            <FormGroup>
              <Label value={"닉네임"} ></Label>
              <Input
                id="nickname"
                name="member_nickname"
                type="text"
                value={profile.member_nickname}
                onChange={onChangeProfile}
                className={`${style.datepicker}`}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label value={"생년월일"}></Label>
              <Datetime 
                className={`${style.datepicker}`}
                value={new Date(profile.member_birthDate)}
                dateFormat='yyyy-MM-DD'
                locale="ko"
                onChange={(e) => {
                  e.name = "member_birthDate"
                  onChangeProfile(e)
                }}
                // inputProps={inputprops}
                timeFormat={false}></Datetime>
            </FormGroup>
            <FormGroup>
            <Label value={"전화번호"}></Label>
              <span><Input 
              className={`${style.datepicker}`} 
              placeholder="전화번호"
              type="text"
              onChange={checknumber}
              value={profile.member_phone}
              pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
              maxLength="13"></Input></span>
              <br></br>
            </FormGroup>
          </Form>
        </div>
          <br></br>
          <Button color="sky" className={`${style.bigbnt}`} onClick={modifyInfo}>완료</Button>
          <Button color="danger" className={`${style.bigbnt}`} onClick={gotoMemberInfoDetail}>취소</Button>
        </div>
        <Navbar/>
      </>
    );
  } else {
    return (
      <>
        <div id="pillimi" className={`${style.center}`}>
          <img src={profile.member_img} className={`${style.imgsize} mt-5`} alt="프로필 사진"></img>
          <br></br>
          <div>
          <Form>
          <FormGroup>
            <Label value={"닉네임"} ></Label>
            <Input
              id="nickname"
              name="member_nickname"
              type="text"
              value={profile.member_nickname}
              onChange={onChangeProfile}
              className={`${style.datepicker}`}
            ></Input>
          </FormGroup>
          <FormGroup>
          <Label value={"전화번호"}></Label>
            <span><Input 
            className={`${style.datepicker}`} 
            placeholder="전화번호"
            type="text"
            onChange={checknumber}
            value={profile.member_phone}
            pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
            maxLength="13"></Input></span>
            <br></br>
          </FormGroup>
        </Form>
        </div>
          <br></br>
          <Button color="sky" className={`${style.bigbnt}`} onClick={modifyInfo}>완료</Button>
          <Button color="danger" className={`${style.bigbnt}`} onClick={gotoMemberInfoDetail}>취소</Button>
        </div>
        <Navbar/>
      </>
    );
  }
}





function Label(params) {
  return (
    <>
      <label className={`mt-3 ${style.infolabel}`}>
        {params.value}
      </label>
      <br></br>
      
      
    </>
  )  
}


export default MemberInfoModify;
