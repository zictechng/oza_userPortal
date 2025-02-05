// Chakra imports
import { Box, Flex, Text,useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { VSeparator } from "components/separator/Separator";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getPendingBonus, resetState } from "storeMtg/pendingBonusSlice";

export default function Conversion(props) {
  const { ...rest } = props;
  const dispatch = useDispatch()
  const { user, userToken } = useSelector((state) => state.authUser);
  const { data, dataLoading } = useSelector((state) => state.pendingBonus);
  const [inFlowData, setInFlowData] = useState(0);
  const [pendingData, setPendingData] = useState(0);
  const [withdrawData, setWithdrawData] = useState(0);
  const [pendingBonus, setPendingBonus] = useState(0);

  const [inflowChart, setInFlowChart] = useState({});
  const [outflowChart, setOutFlowChart] = useState(0);
  const [pendingFlowChart, setPendingFlowChart] = useState({});

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 10px 10px rgba(112, 144, 176, 0.12)",
    "unset"
  );

   useEffect(() => {

    if (data?.countWithdraw && data?.countApproveWithdraw) {
      const outChart = (data.countWithdraw && data.countApproveWithdraw && data.countWithdraw !==0) ? Math.round((data.countApproveWithdraw / data.countWithdraw) * 100) : 0;
      setOutFlowChart(outChart);
    }
    if(data?.countPendingTrans && data?.totalTransCount)
    {
      const pendingChart = (data?.countPendingTrans && data?.totalTransCount && data?.totalTransCount !== 0) ? Math.round((data.countPendingTrans / data.totalTransCount) * 100) : 0;
      setPendingFlowChart(pendingChart);
    }
    if(data?.countBonusPending && data?.bonusCount)
      {
        const pendingBonusChart = (data?.countBonusPending && data?.bonusCount && data?.countBonusPending !==0) ? ((data?.feedbackBonus / data?.countBonusPending)) : 0;
        setPendingBonus(pendingBonusChart);
      }
    if(data?.countApproveTrans && data?.totalTransCount)
    {
      const inChart = (data.countApproveTrans && data.totalTransCount && data.totalTransCount !== 0) ? Math.round((data.countApproveTrans / data.totalTransCount) * 100) : 0;
      setInFlowChart(inChart)
    }

       if(!dataLoading && data?.totalTransCount > 0) {
        
        const inFlow = (data.countApproveTrans / data.totalTransCount) * 100;
        //console.log('inflow data ', inFlow)
        setInFlowData(inFlow.toFixed(2));
        
        const outFlow = (data.countApproveWithdraw / data.countWithdraw) * 100;
        setWithdrawData(outFlow.toFixed(2));
       
        const pendingFlow = (data.countPendingTrans / data.totalTransCount) * 100;
        setPendingData(pendingFlow.toFixed(2));
        
       }
     }, [data, dataLoading]);

     useEffect(() => {
      const requestData = {
        tag_id: user.userData?.tag_id,
        user_token: userToken,
        endpoint: "", // Optional: specify a custom endpoint
        
      };
      dispatch(getPendingBonus(requestData));
      // Cleanup function to reset state
      return () => {
        dispatch(resetState());
      };
    }, [dispatch, user.userData?.tag_id, userToken]);

     //console.log('dash Chart ', data?.bonusMoney, ' Total Count: '+ data?.countBonusPending )

  const dataChart = [inflowChart, outflowChart, pendingBonus ]
  const total = dataChart.reduce((a, b) => a + b, 0);
  const normalizedData = dataChart.map(value => (value / total) * 100);

  const chartOptions = {
    labels: ["Inflow", "OutFlow", "Pending"], // Labels for each slice
    series: normalizedData,
    chart: {
      type: "pie",
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true, // Enable data labels
          formatter: function (val, opts) {
            // Display exact value from dataChart
            const index = opts.seriesIndex;
            return `${dataChart[index].toFixed(2)}`; // Show exact value with 2 decimals
          },
        },
      },
    },
    colors: ["#5cad82", "#c7585b", "#b5aa65"], // Custom slice colors
    legend: {
      show: true, // Enable legend
    },
    tooltip: {
      enabled: true, // Enable tooltip on hover
      y: {
        formatter: function (value, opts) {
          // Show the exact value from dataChart
          const index = opts.seriesIndex;
          return `${dataChart[index].toFixed(2)}%`; // Display exact value in tooltip
        },
      },
    },
  };
  
  
  //console.log('Chart Data ', inflowChart, outflowChart, pendingFlowChart);

  return (
    <Card p='20px' align='center' direction='column' w={{ md: "580px", xl:'580px', lg:'580px', sm:'100%' }} {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} mt='4px'
        fontSize="22px"
        fontWeight="700"
        lineHeight="100%">
          Transaction Chart
        </Text>
       </Flex>

      {dataLoading? 
      <Flex justifyContent='center' alignItems='center' ><img src={require('assets/images/loading2.gif')} alt="loader_icon" width={'150px'} height={'60px'} /></Flex>
      :(
      <PieChart
        key={inflowChart}
        h='100%'
        w='100%'
        chartData={dataChart}
        chartOptions={chartOptions}
      />)}
      {/* <PieChart chartData={dataChart} chartOptions={chartOptions} /> */}
      <Card
        bg={cardColor}
        flexDirection='row' 
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'>
        <Flex direction='column' py='5px' align='center'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='green.100' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Inflow
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            {dataLoading? <img src={require('assets/images/loading2.gif')} alt="loader_icon" width={'40px'} height={'10px'} />: inFlowData+'%'}
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction='column' py='5px' me='10px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='yellow.500' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Outflow
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            {dataLoading? <img src={require('assets/images/loading2.gif')} alt="loader_icon" width={'40px'} height={'10px'} />: withdrawData+'%'}
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction='column' py='5px' me='10px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='pink' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Draft
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            {dataLoading? <img src={require('assets/images/loading2.gif')} alt="loader_icon" width={'40px'} height={'20px'} />: pendingData +'%'}
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
