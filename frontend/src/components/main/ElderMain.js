import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ElderMainCSS from "./css/ElderMain.module.css";

function ElderMain() {
  const memberSeq = useSelector((state) => state.memberInfo.memberInfo.memberSeq);
  React.useEffect(() => {}, []);
  return (
    <>
      <div className={ElderMainCSS.Whole}>
        <div className={ElderMainCSS.Header}></div>
        <div className={ElderMainCSS.MainTitle}>
          <div className={ElderMainCSS.WhiteBox} onClick={gotoPillToday}>
            <div className={ElderMainCSS.WhiteBoxHeight}></div>
            <br></br>
            <h3 className={ElderMainCSS.MainText}>오늘 먹을 약</h3>
            <div className={ElderMainCSS.WhiteBoxHeight}></div>
          </div>
          <Link to={`/member-pill-page/member-pill-list/${memberSeq}`} style={{ textDecoration: 'none' }}>
            <Menu content={"내 약"}></Menu>
          </Link>
          <Link to={`/family/myfamily`} style={{ textDecoration: 'none' }}>
            <Menu content={"가족"}></Menu>
          </Link>
          <Link to={`/member-info/member-info-detail/${memberSeq}`} style={{ textDecoration: 'none' }}>
            <Menu content={"내 정보"}></Menu>
          </Link>
        </div>
      </div>
    </>
  );
}

function Menu(params) {
  return (
    <>
      <br></br>
      <br></br>
      <div className={ElderMainCSS.WhiteBox}>
        <div className={ElderMainCSS.WhiteBoxHeight}></div>
        <br></br>
        <h3 className={ElderMainCSS.MainText}>{params.content}</h3>
        <div className={ElderMainCSS.WhiteBoxHeight}></div>
      </div>
    </>
  );
}

function gotoPillToday() {
  window.location.href = "/pill-today";
}

export default ElderMain;
