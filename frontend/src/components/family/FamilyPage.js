import React, { useState } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import FamilyRegisterRequest from "components/family/familyRegister/FamilyRegisterRequest.js";
import FamilyRegisterReply from "components/family/familyRegister/FamilyRegisterReply.js";
import MyFamily from "components/family/familyPage/MyFamily.js";
import FamilyProtector from "components/family/familyPage/FamilyProtector.js";
import Cameratest from "components/family/familyPage/Cameratest.js";
import Cameratest2 from "components/family/familyPage/Cameratest2.js";
import Navbar from "layout/Navbar.js";
import { Row, Col } from "reactstrap";
import "../family/familycss.css";
function Family(props) {
  const [header, setheader] = useState("가족");
  const [navbar, setnavbar] = useState(true);
  const getheader = (str) => {
    setheader(str);
  };
  const getnavbar = (bool) => {
    setnavbar(bool);
  };
  var basicurl = props.match.path;
  return (
    <BrowserRouter>
      <div id="outsidecon">
        <Row style={{paddingTop:"30px", paddingBottom:"5px"}}>
          <Col xs="2" className="familypagecol1">
            <i
              className="fa fa-solid fa-arrow-left"
              style={{ fontSize: "xx-large", margin:"auto", float:"left" }}
            ></i>
          </Col>
          <Col xs="8" className="familypagecol2">
            <h2 style={{margin:"0px"}}>{header}</h2>
          </Col>
          <Col xs="2" className="familypagecol2"></Col>
        </Row>
        <hr style={{margin:"0px"}}></hr>
        <Switch>
          <Route
            path={`${basicurl}/reply`}
            render={(props) => (
              <FamilyRegisterReply
                getheader={getheader}
                getnavbar={getnavbar}
                {...props}
              />
            )}
          />
          <Route
            path={`${basicurl}/request`}
            render={(props) => (
              <FamilyRegisterRequest
                getheader={getheader}
                getnavbar={getnavbar}
                {...props}
              />
            )}
          />
          <Route
            path={`${basicurl}/myfamily`}
            render={(props) => <MyFamily getheader={getheader} {...props} />}
          />
          <Route
            path={`${basicurl}/Protector`}
            render={(props) => (
              <FamilyProtector getheader={getheader} {...props} />
            )}
          />
          <Route
            path={`${basicurl}/camera`}
            render={(props) => (
              <Cameratest getheader={getheader} getnavbar={getnavbar} {...props} />
            )}
          />
          <Route
            path={`${basicurl}/camera2`}
            render={(props) => (
              <Cameratest2 {...props} />
            )}
          />
        </Switch>
        {navbar ? <Navbar /> : null}
      </div>
    </BrowserRouter>
  );
}

export default Family;
