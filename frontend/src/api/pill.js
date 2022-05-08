import { apiInstance } from "./index.js";

function getPillInfo(pillSeq, sucess, fail) {
  apiInstance().get(`/medicine/${pillSeq}`).then(sucess).catch(fail);
}

function getPillSearch(searchKeyword, sucess, fail) {
  apiInstance().get(`/search?keyword=${searchKeyword}`).then(sucess).catch(fail);
}

export { getPillInfo, getPillSearch };
