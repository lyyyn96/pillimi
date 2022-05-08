/*eslint-disable*/
import React, { useState } from "react";
import { Input, Button, Card } from "reactstrap";

import PillSearchCSS from "./css/PillSearch.module.css";
import Header from "components/Headers/Header";
import { getPillSearch } from "../../api/pill.js";

function PillSearch() {
  const [keyword, setKeyword] = useState("");
  const [pillList, setPillList] = useState([]);

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const onEnterKeyword = (e) => {
    if (e.key === "Enter") {
      goPillSearch();
    }
  };

  const goPillSearch = () => {
    getPillSearch(
      keyword,
      async (response) => {
        setPillList(response.data.data);
        setKeyword("");
        ShowPillList();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const ShowPillList = () => {
    let result = [];
    pillList.forEach((element) => {
      if (pillList.length !== 0) {
        result.push(
          <Card id="pillListDiv" className={PillSearchCSS.PillList} onClick={() => gotoPillDetail(element.medicineSeq)}>
            <div className="d-flex align-items-center">
              <img className={`${PillSearchCSS.Img}`} alt="pillImg" src={element.medicineImage}></img>
              <span className={`${PillSearchCSS.PillName} flex-fill`}>{element.medicineName}</span>
              <i className={`now-ui-icons arrows-1_minimal-right`}></i>
            </div>
          </Card>
        );
      }
    });

    return result;
  };

  React.useEffect(() => {
    ShowPillList();
  }, []);

  return (
    <>
      <Header header="검색"></Header>
      <div className={PillSearchCSS.Whole}>
        <br></br>
        <Input
          className={PillSearchCSS.SearchInput}
          onChange={onChangeKeyword}
          onKeyPress={onEnterKeyword}
          placeholder="검색어를 입력해주세요"
          value={keyword}
          type="text"
        ></Input>
        <Button className={PillSearchCSS.SearchBtn} onClick={() => goPillSearch()}>
          {" "}
          검색
        </Button>
        <br></br>
        <ShowPillList></ShowPillList>
      </div>
    </>
  );
}

function gotoPillDetail(pillSeq) {
  window.location.href = `/pill-detail/${pillSeq}`;
}

export default PillSearch;
