/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import chatAppReducer from './ChatAppReducer';
import emailAppReducer from './EmailAppReducer';
import sidebarReducer from './SidebarReducer';
import todoAppReducer from './TodoAppReducer';
import authUserReducer from './AuthUserReducer';
import feedbacksReducer from './FeedbacksReducer';
import ecommerceReducer from './EcommerceReducer';
import CrmReducer from './CrmReducer';
import headcountReducer from "../Actions/headcountActions";
import nhtReducer from "../Actions/nhtActions";
import termsReducer from "../Actions/termsActions";
import historyReducer from "./historyReducer";
import companyReducer from "../Actions/companyActions";
import userReducer from "../Actions/userActions"

const Reducers = combineReducers({
   settings,
   chatAppReducer,
   emailApp: emailAppReducer,
   sidebar: sidebarReducer,
   todoApp: todoAppReducer,
   authUser: authUserReducer,
   feedback: feedbacksReducer,
   ecommerce: ecommerceReducer,
   CrmReducer: CrmReducer,
   headcount: headcountReducer,
   nht: nhtReducer,
   terms: termsReducer,
   history: historyReducer,
   company : companyReducer,
   user : userReducer
});

export default Reducers;
