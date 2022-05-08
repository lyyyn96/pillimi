import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

function Cameratest(props) {
  const cam = useRef();
  const [picimg, setImage] = useState();
  const [pic, setPicture] = useState(false);
  const takepic = () => {
    setPicture(true);
  };
  const retry = () => {
    setPicture(false);
  };
  useEffect(() => {
    props.getnavbar(false);
    props.getheader("사진 찍기");
  });

  return (
    <>
      <div style={{ height: "40px" }}></div>
      {pic ? (
        <div style={{ width: "80%", margin: "auto" }}>
          <img
            src={picimg}
            alt="다시찍기를 눌러주세요"
          />
          <br />
          <Button className="activebtn" size="lg" onClick={retry}>
            전송하기
          </Button>
          <Button className="unactivebtn" size="lg" onClick={retry}>
            다시찍기
          </Button>
        </div>
      ) : (
        <div style={{ width: "80%", margin: "auto" }}>
          <Camera ref={cam} aspectRatio={2 / 3} facingMode={"environment"}/>
          <Button
            className="activebtn"
            size="lg"
            onClick={() => {
              setImage(cam.current.takePhoto());
              takepic();
            }}
          >
            사진찍기
          </Button>
        </div>
      )}
      <Link to="/family/reply">
        <Button>
          <p>Click Me!</p>
        </Button>
      </Link>
    </>
  );
}

export default Cameratest;
