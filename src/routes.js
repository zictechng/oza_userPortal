import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdHistory,
  MdHelpOutline,
  MdSettings,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import History from 'views/admin/history';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Support from 'views/admin/support';
import Setting from 'views/admin/settings';
import CompleteProfile from 'views/admin/completeProfile';
import SalesComponent from 'views/admin/sell'
import BuyComponent from 'views/admin/buy'
import FundAccountComponent from 'views/admin/fundAccount'
import WithdrawComponent from 'views/admin/fundWithdraw'
import SendFundComponent from 'views/admin/sendFund'
import NotificationComponent from 'views/admin/notification'
import WalletComponent from 'views/admin/wallet'
import ManualPaymentComponent from 'views/admin/manualPayment';
import CheckoutPaypal from 'views/admin/checkoutPaypal'
import CheckoutPaystack from 'views/admin/checkoutPaystack'
import PaymentProof from 'views/admin/proofPayment'
import ExchangeRate from 'views/admin/exchangeRate';
import SignupProcess from 'views/admin/completeProfileSteps';
import SuccessTransactions from 'views/admin/successPage'

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Dashboard',
    layout: '/user',
    path: '/',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    visible: true,
  },
  {
    name: 'Transactions',
    layout: '/user',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
    visible: true,
  },
  {
    name: 'History',
    layout: '/user',
    path: '/history',
    icon: (
      <Icon
        as={MdHistory}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <History />,
    secondary: true,
    visible: true,
  },
  
  {
    name: 'Profile',
    layout: '/user',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    visible: true,
  },
  {
    name: 'Support',
    layout: '/user',
    path: '/support',
    icon: <Icon as={MdHelpOutline} width="20px" height="20px" color="inherit" />,
    component: <Support />,
    visible: true,
  },

  {
    name: 'Settings',
    layout: '/user',
    path: '/settings',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: <Setting />,
    visible: true,
  },

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
    path: '/send-fund',
    component: <SendFundComponent />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/notifications',
    component: <NotificationComponent />,
    visible: false,
  },
  {
    layout: '/user',
    path: '/wallet',
    component: <WalletComponent />,
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
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
