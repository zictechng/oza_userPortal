import { configureStore } from "@reduxjs/toolkit";
// import authSlice from "storeMtg/authSlice";
// import pendingBonusSlice from "storeMtg/pendingBonusSlice";
// import dashRecentRecord from "storeMtg/dashRecentRecordSlice";
// import historyDataSlice from "storeMtg/dashHistorySlice";
// import supportRequest from "storeMtg/supportSlice";
// import emailSettingRequest from "storeMtg/emailSettingSlice";
// import faSetting from "storeMtg/f2ASettingSlice";
// import inAppNotice from "storeMtg/inAppSettingSlice";
// import updatePassword from "storeMtg/passwordUpdateSlice";
// import accountPinUpdate from "storeMtg/pinUpdateSlice"
// import accountDeactivation  from "storeMtg/deactivateAccountSlice";
// import userBankDetails from "storeMtg/userBankDetailsSlice";
// import referralDetails from "storeMtg/getReferralSlice"

// use here for state persistence
import { persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

// this includes for persistence setup configuration
const persistConfig ={
    key:'root',
    version: 1,
    storage
};

const reducer = combineReducers({
   // all slices component will come here
  //  authUser: authSlice,
  //  pendingBonus: pendingBonusSlice,
  //  recentTransaction: dashRecentRecord,
  //  history: historyDataSlice,
  //  support: supportRequest,
  //  emailSetting: emailSettingRequest,
  //  f2aSetting: faSetting,
  //  inAppNotification: inAppNotice,
  //  passwordUpdate: updatePassword,
  //  accountPin: accountPinUpdate,
  //  deactivateAccount: accountDeactivation,
  //  bankDetails: userBankDetails,
  //  referral: referralDetails,


});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})


// method without using persist storage format with redux toolkit

// const store = configureStore({
//     reducer: {
//         cart: cartSlice,
//         products: productAPISlice,
//         users: userSlice,
//         favorite: favoriteSlice
//     }
// })

export default store;