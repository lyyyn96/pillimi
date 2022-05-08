import { apiInstance } from "./index.js";

function getMyFamily(sucess, fail) {
  apiInstance().get(`/family`).then(sucess).catch(fail);
}

export { getMyFamily };
