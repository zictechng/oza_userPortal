import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome, MdPerson, MdHistory, MdHelpOutline,
  MdSettings, MdNotifications, MdLock,
  MdCurrencyExchange, MdOutlineAccountBalanceWallet,
  MdPayment, MdPeople, MdStars,
} from 'react-icons/md';
import {
  FiPhone, FiZap, FiTv, FiWifi, FiFileText,
  FiGift, FiStar, FiSend,
} from 'react-icons/fi';
import ReferralPage from 'views/admin/referral';
import RewardsPage from 'views/admin/rewards';

// Page imports
import MainDashboard from 'views/admin/default';
import BuyAirtime from 'views/admin/bills/airtime';
import BuyData from 'views/admin/bills/data';
import BuyElectricity from 'views/admin/bills/electricity';
import BuyTv from 'views/admin/bills/tv';
import BuyExamCards from 'views/admin/bills/examCards';
import History from 'views/admin/history';
import Profile from 'views/admin/profile';
import Support from 'views/admin/support';
import Setting from 'views/admin/settings';
import CompleteProfile from 'views/admin/completeProfile';
import SalesComponent from 'views/admin/sell';
import BuyComponent from 'views/admin/buy';
import FundAccountComponent from 'views/admin/fundAccount';
import WithdrawComponent from 'views/admin/fundWithdraw';
import SendFundComponent from 'views/admin/sendFund';
import NotificationComponent from 'views/admin/notification';
import WalletComponent from 'views/admin/wallet';
import ManualPaymentComponent from 'views/admin/manualPayment';
import CheckoutPaypal from 'views/admin/checkoutPaypal';
import CheckoutPaystack from 'views/admin/checkoutPaystack';
import PaymentProof from 'views/admin/proofPayment';
import ExchangeRate from 'views/admin/exchangeRate';
import SignupProcess from 'views/admin/completeProfileSteps';
import SuccessTransactions from 'views/admin/successPage';
import DataTables from 'views/admin/dataTables';

// Auth imports
import SignInCentered from 'views/auth/signIn';
import SignUpPage from 'views/auth/signUp';
import ForgotPasswordPage from 'views/auth/forgotPassword';

const routes = [
  // ── Main Navigation (visible in sidebar)
  {
    name: 'Dashboard',
    layout: '/user',
    path: '/',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: <MainDashboard />,
    visible: true,
  },
  {
    name: 'Transactions',
    layout: '/user',
    path: '/data-tables',
    icon: <Icon as={MdCurrencyExchange} width='20px' height='20px' color='inherit' />,
    component: <DataTables />,
    visible: true,
  },
  {
    name: 'Send Fund',
    layout: '/user',
    path: '/send-fund',
    icon: <Icon as={FiSend} width='20px' height='20px' color='inherit' />,
    component: <SendFundComponent />,
    visible: true,
  },
  {
    name: 'History',
    layout: '/user',
    path: '/history',
    icon: <Icon as={MdHistory} width='20px' height='20px' color='inherit' />,
    component: <History />,
    visible: true,
  },
  {
    name: 'Wallet',
    layout: '/user',
    path: '/wallet',
    icon: <Icon as={MdOutlineAccountBalanceWallet} width='20px' height='20px' color='inherit' />,
    component: <WalletComponent />,
    visible: true,
  },
  {
    name: 'Profile',
    layout: '/user',
    path: '/profile',
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: <Profile />,
    visible: true,
  },
  {
    name: 'Notifications',
    layout: '/user',
    path: '/notifications',
    icon: <Icon as={MdNotifications} width='20px' height='20px' color='inherit' />,
    component: <NotificationComponent />,
    visible: true,
  },
    {
    name: 'Exchange Rate',
    layout: '/user',
    path: '/exchange-rate',
    icon: <Icon as={MdCurrencyExchange} width='20px' height='20px' color='inherit' />,
    component: <ExchangeRate />,
    visible: true,
  },
  {
    name: 'Referrals',
    layout: '/user',
    path: '/referral',
    icon: <Icon as={MdPeople} width='20px' height='20px' color='inherit' />,
    component: <ReferralPage />,
    visible: true,
  },
  {
    name: 'Rewards',
    layout: '/user',
    path: '/rewards',
    icon: <Icon as={MdStars} width='20px' height='20px' color='inherit' />,
    component: <RewardsPage />,
    visible: true,
  },
  {
    name: 'Support',
    layout: '/user',
    path: '/support',
    icon: <Icon as={MdHelpOutline} width='20px' height='20px' color='inherit' />,
    component: <Support />,
    visible: true,
  },
  {
    name: 'Settings',
    layout: '/user',
    path: '/settings',
    icon: <Icon as={MdSettings} width='20px' height='20px' color='inherit' />,
    component: <Setting />,
    visible: true,
  },

  // ── Hidden routes (no sidebar item)
  {
    layout: '/user',
    path: '/complete-profile',
    component: <CompleteProfile />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/sales',
    component: <SalesComponent />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/buy',
    component: <BuyComponent />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/fund-account',
    component: <FundAccountComponent />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/withdraw',
    component: <WithdrawComponent />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/manual-payment',
    component: <ManualPaymentComponent />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/checkout-paypal',
    component: <CheckoutPaypal />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/checkout-paystack',
    component: <CheckoutPaystack />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/payment-proof',
    component: <PaymentProof />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/exchange-rate',
    component: <ExchangeRate />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/signup-process',
    component: <SignupProcess />,
    visible: false,
  },
    {
    layout: '/user',
    path: '/success',
    component: <SuccessTransactions />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/bills/airtime',
    component: <BuyAirtime />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/bills/data',
    component: <BuyData />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/bills/electricity',
    component: <BuyElectricity />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/bills/tv',
    component: <BuyTv />,
    visible: false,
  },

  {
    layout: '/user',
    path: '/bills/exam-cards',
    component: <BuyExamCards />,
    visible: false,
  },

  // ── Auth routes
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: <SignInCentered />,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    component: <SignUpPage />,
  },
  {
    name: 'Forgot Password',
    layout: '/auth',
    path: '/forgot-password',
    component: <ForgotPasswordPage />,
  },
];

export default routes;