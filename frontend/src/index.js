/*

=========================================================
* Now UI Kit React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-kit-react
* Copyright 2021 Creative Tim (http://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-kit-react/blob/main/LICENSE.md)

* Designed by www.invisionapp.com Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// store 사용 설정
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import rootReducer from "./reducers/index";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { composeWithDevTools } from "redux-devtools-extension";

// styles for this kit
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss?v=1.5.0";
import "assets/demo/demo.css?v=1.5.0";
import "assets/demo/nucleo-icons-page-styles.css?v=1.5.0";
// pages for this kit
import Index from "views/Index.js";
import NucleoIcons from "views/NucleoIcons.js";
import LoginPage from "views/examples/LoginPage.js";
import LandingPage from "views/examples/LandingPage.js";
import ProfilePage from "views/examples/ProfilePage.js";
import Family from "components/family/FamilyPage.js";
import FamilyRegisterRequest from "components/family/familyRegister/FamilyRegisterRequest.js";
import MainPage from "views/MainPage.js";
import ElderMain from "components/main/ElderMain.js";
import PillToday from "components/main/PillToday.js";
import PillDetail from "components/pill/PillDetail.js";
import PillSearch from "components/pill/PillSearch.js";
import PillTake from "components/pill/PillTake.js";
import PillPicture from "components/pill/PillPicture.js";
import Callback from "components/main/Callback.js";
import MemberInfo from "components/Member/MemberInfo.js";
import MemberPillPage from "components/Member/MemberPillPage";

const store = createStore(rootReducer, composeWithDevTools());
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <Switch>
          <Switch>
            <Route path="/test" render={(props) => <FamilyRegisterRequest {...props} />} />
            <Route path="/family" render={(props) => <Family {...props} />} />
            <Route exact path="/" render={(props) => <MainPage {...props} />} />
            <Route exact path="/index" render={(props) => <Index {...props} />} />
            <Route exact path="/nucleo-icons" render={(props) => <NucleoIcons {...props} />} />
            <Route exact path="/landing-page" render={(props) => <LandingPage {...props} />} />
            <Route exact path="/profile-page" render={(props) => <ProfilePage {...props} />} />
            <Route exact path="/login-page" render={(props) => <LoginPage {...props} />} />
            <Route exact path="/main" render={(props) => <ElderMain {...props} />} />
            <Route exact path="/pill-today" render={(props) => <PillToday {...props} />} />
            <Route exact path="/pill-detail/:pillSeq" render={(props) => <PillDetail {...props} />} />
            <Route exact path="/pill-search" render={(props) => <PillSearch {...props} />} />
            <Route path="/pill-take" render={(props) => <PillTake {...props} />} />
            <Route path="/pill-picture" render={(props) => <PillPicture {...props} />} />
            <Route path="/member-info" render={(props) => <MemberInfo {...props} />} />
            <Route path="/member-pill-page" render={(props) => <MemberPillPage {...props} />} />
            <Route exact path="/callback" render={(props) => <Callback {...props} />} />
            <Redirect to="/index" />
            {/* <Redirect from="/" to="/index" /> */}
          </Switch>
        </Switch>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
