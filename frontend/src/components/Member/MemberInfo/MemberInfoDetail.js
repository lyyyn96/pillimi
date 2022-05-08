/*eslint-disable*/
import React, { useState, useEffect } from "react";

// reactstrap components
import { Button } from "reactstrap";
import { useRouteMatch } from 'react-router-dom'
import style from "../css/MemberInfo.module.css";
import { getMemberInfoDetail } from '../../../api/member';
import { useSelector } from 'react-redux';
import { logoutAction } from "actions/memberAction";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useHistory  } from "react-router-dom";
// core components



function MemberInfoDetail({match}) {
  const memberSeq = match.params.memberSeq;
  const dispatch = useDispatch();
  const history = useHistory();
  let loginSeq = useSelector((state) => state.memberInfo.memberInfo.memberSeq);

  const [profile, setProfile] = useState({
    member_nickname: "",
    member_img: "",
    member_birthDate: "",
    member_phone: "",
    member_isprotector: 0
  });
  
  useEffect(() => {
    console.log("마운트")
    console.log(match.params.memberSeq);
    getMemberDetail(memberSeq);
  },[])

  const array1 = ["고혈압", "당뇨"];
  const disease = () => {
    const result = [];
    for (let i = 0; i < array1.length; i++) {
      result.push(<span key={{i}}>{array1[i]}</span>);
      result.push(<br></br>)
    }
    return result;
  }

  const getMemberDetail = (memberSeq) => {
    getMemberInfoDetail(memberSeq,
      (success) => {
        console.log(success);
        setProfile({
          member_nickname: success.data.data.nickName,
          member_img: success.data.data.memberImage,
          member_birthDate: success.data.data.birthDate,
          member_phone: success.data.data.phone,
        })
      }, (fail) => {
        console.log(fail);
      })
  }

  function gotoMemberInfoModify(){
    window.location.href = "/member-info/member-info-modify/"+memberSeq;
  }

  function Content(){
    if(profile.member_birthDate!==null){
      return(
        <div>
          <Label value={"닉네임"} content={profile.member_nickname} ></Label>
          <Label value={"생년월일"} content={profile.member_birthDate}></Label>
          <Label value={"전화번호"} content={profile.member_phone}></Label>
          <label className={`mt-3 ${style.infolabel}`}>기저 질환</label><br></br>
          <div>
            {disease()}
          </div>
        </div>
      )
    }else{
      return(
        <div>
          <Label value={"닉네임"} content={profile.member_nickname} ></Label>
          <Label value={"전화번호"} content={profile.member_phone}></Label>
        </div>
      )
    }
  }

  function LogOutBtn(){
    console.log(loginSeq);
    console.log(memberSeq);
    console.log(loginSeq==memberSeq)
    if(loginSeq==memberSeq){
      return(
        <Button color="danger" className={`${style.bigbnt}`} onClick={LogOut}>로그아웃</Button>
      )
    }else{
      return(
        <></>
      )
    }
  }

  function LogOut (event) {
      event.preventDefault();
      Swal.fire({
        icon: "success",
        title: "로그아웃 되었습니다.",
        confirmButtonColor: `#0369a1`,
      }).then(function () {
        //history.push(`/`)
        window.location.href="/"
        dispatch(logoutAction());
        localStorage.removeItem('ACCESS_TOKEN');
      });
    // dispatch(logoutAction());
    // localStorage.removeItem('ACCESS_TOKEN');
    //window.location.href="/"
  }

  return (
    <>
      <div className={`${style.center}`}>
        <div className={`${style.top}`}>
          <img src={profile.member_img} alt="프로필 사진" className={`mt-5 ${style.imgsize}`}></img>
          <br></br>
          <Content></Content>
          <br></br>
        </div>
        <Button color="sky" className={`${style.bigbnt}`} onClick={gotoMemberInfoModify}>수정</Button>
        <LogOutBtn></LogOutBtn>
      </div>
    </>
  );
}

function Label(params) {
  return (
    <>
      <label className={`mt-3 ${style.infolabel}`}>
        {params.value}
      </label>
      <br></br>
      <span>{params.content}</span>
      <br></br>
      
    </>
  )  
}


export default MemberInfoDetail;
