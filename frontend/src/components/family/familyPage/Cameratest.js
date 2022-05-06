import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { Button } from "reactstrap";

function Cameratest() {
  const cam = useRef();
  const [picimg, setImage] = useState();
  const [pic, setPicture] = useState(false);
  const takepic = () => {
    setPicture(true);
  };
  const retry = () => {
    setPicture(false);
  };
  return (
    <>
      <h2>test1</h2>
      {pic ? (
        <div style={{ width: "80%", margin: "auto" }}>
          <img src={picimg} style={{transform: "scaleX(-1)"}} alt="다시찍기를 눌러주세요" />
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
          <Camera ref={cam} aspectRatio={2 / 3} />
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
    </>
  );
}

export default Cameratest;