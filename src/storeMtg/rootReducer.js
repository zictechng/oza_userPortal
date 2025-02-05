import { combineReducers } from '@reduxjs/toolkit';
import authSlice from "storeMtg/authSlice";
import pendingBonusSlice from "storeMtg/pendingBonusSlice";
import dashRecentRecord from "storeMtg/dashRecentRecordSlice";
import historyDataSlice from "storeMtg/dashHistorySlice";
import supportRequest from "storeMtg/supportSlice";
import emailSettingRequest from "storeMtg/emailSettingSlice";
import faSetting from "storeMtg/f2ASettingSlice";
import inAppNotice from "storeMtg/inAppSettingSlice";
import updatePassword from "storeMtg/passwordUpdateSlice";
import accountPinUpdate from "storeMtg/pinUpdateSlice"
import accountDeactivation  from "storeMtg/deactivateAccountSlice";
import userBankDetails from "storeMtg/userBankDetailsSlice";
import referralDetails from "storeMtg/getReferralSlice"

const appReducer = combineReducers({
    authUser: authSlice,
    pendingBonus: pendingBonusSlice,
    recentTransaction: dashRecentRecord,
    history: historyDataSlice,
    support: supportRequest,
    emailSetting: emailSettingRequest,
    f2aSetting: faSetting,
    inAppNotification: inAppNotice,
    passwordUpdate: updatePassword,
    accountPin: accountPinUpdate,
    deactivateAccount: accountDeactivation,
    bankDetails: userBankDetails,
    referral: referralDetails,
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logout/fulfilled') {
    state = undefined; // Reset the entire state when logout is fulfilled
  }
  return appReducer(state, action);
};

export default rootReducer;
