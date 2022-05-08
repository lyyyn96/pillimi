import React from "react";
import { Row, Col } from "reactstrap";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { CgUserList } from "react-icons/cg";
import "../components/family/familycss.css";

function Navbar() {
  return (
    <>
      <div
        style={{ backgroundColor: "#F1F1F1", margin: "0px", padding: "0px", position:"fixed", bottom:"0", width:"100%" }}
      >
        <Row xs="4">
          <Col className="navcol">
          <AiFillHome className="fa-3x"/><h6>홈</h6>
          </Col>
          <Col className="navcol">
          <AiOutlineSearch className="fa-3x"/><h6>약 검색</h6>
          </Col>
          <Col className="navcol">
          <HiOutlineUserGroup className="fa-3x"/><h6>가족관리</h6>
          </Col>
          <Col className="navcol">
            <CgUserList className="fa-3x"/><h6>내정보</h6>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Navbar;
