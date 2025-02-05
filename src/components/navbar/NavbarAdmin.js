// Chakra Imports
import { Box, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";


export default function AdminNavbar(props) {
	const [ scrolled, setScrolled ] = useState(false);
	const location = useLocation();  // Get the current route
	const routeName = location.pathname;
	let pageName = '';

	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
		
	});

	if(routeName === '/user/')
		{
			pageName = 'Dashboard';
		}
		else if(routeName === '/user/payment-proof')
		{
			pageName = 'Payment Proof';
		}
		else if(routeName === '/user')
		{
			pageName = 'Dashboard';
		}
		else if(routeName === '/user/data-tables')
		{
			pageName = 'Transactions';
		}
		else if(routeName === '/user/history')
		{
			pageName = 'History';
		}
		else if(routeName === '/user/profile')
		{
			pageName = 'Profile';
		}
		else if(routeName === '/user/support')
		{
			pageName = 'Support'
		}
		else if(routeName === '/user/settings')
		{
			pageName='Settings'
		}
		else if(routeName === '/user/fund-account')
		{
			pageName='Fund Account'
		}
		else if(routeName === '/user/send-fund')
		{
			pageName='Send Fund'
		}
		else if(routeName === '/user/exchange-rate')
		{
			pageName='Exchange Rate'
		}
		else if(routeName === '/user/manual-payment')
		{
			pageName='Payment'
		}
		else if(routeName === '/user/checkout-paystack')
		{
			pageName='Paystack Checkout'
		}
		else if(routeName === '/user/success')
		{
			pageName='Successful'
		}
		else if(routeName === '/user/withdraw')
		{
			pageName='Withdraw Funds'
		}
		else if(routeName === '/user/withdraw')
		{
			pageName='Withdraw Funds'
		}
		else if(routeName === '/user/buy')
		{
			pageName='Buy'
		}
		else if(routeName === '/user/sales')
		{
			pageName='Sell'
		}
		else if(routeName === '/user/checkout-paypal')
		{
			pageName='Paypal Checkout'
		}
		else if(routeName === '/user/notifications')
		{
			pageName='Notifications'
		}
		else{
			pageName='Oza App'
		}

	const { secondary, message, brandText } = props;

	// Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
	let mainText = useColorModeValue('navy.700', 'white');
	let navbarPosition = 'fixed';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '30px';
	let gap = '0px';
	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

	return (
		<Box
			position={navbarPosition}
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			backgroundPosition='center'
			backgroundSize='cover'
			borderRadius='16px'
			borderWidth='1.5px'
			borderStyle='solid'
			transitionDelay='0s, 0s, 0s, 0s'
			transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
			transition-property='box-shadow, background-color, filter, border'
			transitionTimingFunction='linear, linear, linear, linear'
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH='75px'
			justifyContent={{ xl: 'center' }}
			lineHeight='25.6px'
			mx='auto'
			mt={secondaryMargin}
			pb='8px'
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			
			px={{
				sm: paddingX,
				md: '10px'
			}}
			ps={{
				xl: '12px'
			}}
			pt='8px'
			top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)'
			}}
			height="40px">
			<Flex
				w='100%'
				flexDirection={{
					sm: 'row',
					md: 'row'
				}}
				alignItems={{ xl: 'center' }}
				
				mb={gap}>
				<Box mb={{ sm: '8px', md: '8px' }}>
					
					{/* Here we create navbar brand, based on route name */}
					<Link
						color={mainText}
						href='#'
						bg='inherit'
						borderRadius='inherit'
						fontWeight='bold'
						fontSize='23px'
						_hover={{ color: { mainText } }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent'
						}}
						_focus={{
							boxShadow: 'none'
						}}>
						{pageName}
					</Link>
				</Box>
				<Box ms='auto' w={{ sm: 'unset', md: 'unset' }}
				left={{ base: '250px', md: '30px', lg: '30px', xl: '30px' }}
      
				position={{ sm: 'fixed', md: 'relative' }} 
				bottom={{ sm: '0', md: 'unset' }} 
				p={4}>
					<AdminNavbarLinks
						onOpen={props.onOpen}
						logoText={props.logoText}
						secondary={props.secondary}
						fixed={props.fixed}
						scrolled={scrolled}
					/>
				</Box>
			</Flex>
			{secondary ? <Text color='white'>{message}</Text> : null}
		</Box>
	);
}

AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	onOpen: PropTypes.func
};
