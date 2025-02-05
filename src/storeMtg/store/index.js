import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

// Import all slices
import authSlice from "storeMtg/authSlice";
import pendingBonusSlice from "storeMtg/pendingBonusSlice";
import dashRecentRecord from "storeMtg/dashRecentRecordSlice";
import historyDataSlice from "storeMtg/dashHistorySlice";
import supportRequest from "storeMtg/supportSlice";
import emailSettingRequest from "storeMtg/emailSettingSlice";
import faSetting from "storeMtg/f2ASettingSlice";
import inAppNotice from "storeMtg/inAppSettingSlice";
import updatePassword from "storeMtg/passwordUpdateSlice";
import accountPinUpdate from "storeMtg/pinUpdateSlice";
import accountDeactivation from "storeMtg/deactivateAccountSlice";
import userBankDetails from "storeMtg/userBankDetailsSlice";
import referralDetails from "storeMtg/getReferralSlice";
import documentUploaded from "storeMtg/getDocumentUploadSlice";
import completeProfileSignup from "storeMtg/completeProfileSignupSlice";
import fundSending from "storeMtg/sendFundSlice";
import companyExchangeRate from "storeMtg/exchangeRateSlice";
import accountPaystack from "storeMtg/fundAccountPaysackSlice";
import paymentGateway from "storeMtg/checkPaymentGatewayStatusSlice";
import companyBank from "storeMtg/getCompanyBankInfoSlice";
import userFundPurchase from "storeMtg/fundBuySlice";
import userWithdrawFund from "storeMtg/withdrawalSlice";
import appInfoSlice from "storeMtg/getAppDetailsSlice";
import userFundLimit from "storeMtg/getFundingLimitSlice";
import fundSales from "storeMtg/fundSaleSlice";
import paypalCheckout from "storeMtg/paypalCheckoutSlice";
import userNotifications from "storeMtg/notificationSlice"

// Redux-persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Combine all reducers into one
const appReducer = combineReducers({
  // Add all slice reducers here
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
  uploadedDocuments: documentUploaded,
  completeSignup: completeProfileSignup,
  sendFund: fundSending,
  exchangeRate: companyExchangeRate,
  paystackFunding: accountPaystack,
  paymentGatewayStatus: paymentGateway,
  companyBankInfo: companyBank,
  buyFunds: userFundPurchase,
  withdrawFunds: userWithdrawFund,
  appInfo: appInfoSlice,
  fundingLimit: userFundLimit,
  sellFunds: fundSales,
  paypalPayment: paypalCheckout,
  notifications: userNotifications
});

// Root reducer with reset logic
const rootReducer = (state, action) => {
  if (action.type === "user/logout/fulfilled") {
    // Reset the entire state on logout
    state = undefined;
  }
  return appReducer(state, action);
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
