import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, ListGroupItem, Modal } from "reactstrap";
import "../familycss.css";
import { getMyFamily } from "api/family"


function FamilyProtector() {
  const [modalbool, setmodalbool] = useState(false)
  const [modalnum, setModalNum] = useState(-1);
  const toggle = (num) => {
    console.log(num);
    setModalNum(num)
    setmodalbool(!modalbool)
  }
  // const [FamilyData, setFamilyData] = useState([])
  const getFamilyData = () => {
    getMyFamily((success)=> {
      console.log(success)
    },)
  }

  useEffect(()=>{
    getFamilyData();
  })

  
  
  useEffect(() => {
    console.log("마운트")
    getFamilyList();
  },[])

  
  const [ familyList, setFamilyList ] = useState([]);

  const getFamilyList = () => {
    getMyFamily(( success ) => {
      setFamilyList(success.data.data);
      console.log(success)
      console.log(success.data.data);
    }, ( fail ) => {
      console.log(fail);
    })
  }

  const Family = () => {
    let result = []
    if(familyList.length===0){
      result.push(
        <div>등록된 가족이 없습니다</div>
      )
    }else{
      familyList.forEach( element => {
        result.push(
          <ListGroupItem onClick={(e)=>{toggle(element.memberSeq, e)}} key={element.memberSeq}>
            <Row xs="4">
              <Col>
                <img className="listimg" alt="" src={element.memberImage} />
              </Col>
              <Col xs={{ offset: 1, size: 8 }} className="listitemtext">
                <h3 className="familyh3">{element.memberName}</h3>
              </Col>
            </Row>
          </ListGroupItem>
        )
      })
    }
    return result;
  }

  const ProtegeModal = () => {
    console.log(modalnum)
    return(
      <Modal isOpen={modalbool} toggle={(e) => toggle(-1, e)} centered>
        <Row style={{ padding:"20px",borderBottom:"1px solid black"}} onClick={gotoMemberInfoDetail}><h3 className="familyh3">회원 정보</h3></Row>
        <Row style={{ padding:"20px" }}><h3 className="familyh3" onClick={gotoMedicineList}>약 관리</h3></Row>
      </Modal>
    )
  }

  const gotoMemberInfoDetail = () => {
    window.location.href = `/member-info/member-info-detail/` + modalnum;
  }

  const gotoMedicineList = () => {
    window.location.href = `/member-pill-page/member-pill-list/` + modalnum;
  }
  return (
    <div
      style={{
        backgroundColor: "#EAF0F8",
        padding: "0px",
        height: "100vh",
        margin: "0px",
      }}
    >
      <ListGroup
        style={{
          backgroundColor: "#EAF0F8",
          width: "100%",
          paddingBottom: "30px",
          paddingTop: "50px",
        }}
      >
      <Family></Family>
      </ListGroup>
      <ProtegeModal></ProtegeModal>
    </div>
  );
}

export default FamilyProtector;
