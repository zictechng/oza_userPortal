
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import client from 'components/client';

export const useBills = () => {
  const { user, userToken } = useSelector(state => state.authUser);
  const headers = { Authorization: `Bearer ${userToken}` };
  const userId = user?.userData?._id;
  const tagId = user?.userData?.tag_id;

  const [networks, setNetworks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [networksLoading, setNetworksLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);

  const fetchNetworks = useCallback(async (serviceType) => {
    setNetworksLoading(true);
    try {
      const res = await client.get(`/api/bills/networks/${serviceType}`);
      if (res.data.msg === '200') {
        setNetworks(res.data.networks || []);
        return res.data.networks || [];
      }
      return [];
    } catch (e) {
      console.log('fetchNetworks error:', e.message);
      return [];
    } finally {
      setNetworksLoading(false);
    }
  }, []);

  const fetchDataPlans = useCallback(async (serviceId) => {
    setPlansLoading(true);
    try {
      const res = await client.get(`/api/bills/plans/data/${serviceId}`);
      if (res.data.msg === '200') {
        setPlans(res.data.plans || []);
        return res.data.plans || [];
      }
      return [];
    } catch (e) {
      console.log('fetchDataPlans error:', e.message);
      return [];
    } finally {
      setPlansLoading(false);
    }
  }, []);

  const buyAirtime = async ({ network, phone, amount }) => {
    const res = await client.post('/api/bills/buy_airtime', {
      userId, tag_id: tagId, network, phone, amount: Number(amount),
    }, { headers });
    return res.data;
  };

  const buyData = async ({ network, network_name, phone, plan_id, plan_name, amount }) => {
    const res = await client.post('/api/bills/buy_data', {
      userId, tag_id: tagId, network, network_name,
      phone, plan_id, plan_name, amount: Number(amount),
    }, { headers });
    return res.data;
  };

  const verifyMeter = async ({ meter_number, service_id, meter_type }) => {
    const res = await client.post('/api/bills/verify_meter', {
      meter_number, service_id, meter_type,
    }, { headers });
    return res.data;
  };

  const buyElectricity = async ({ network, meter_number, meter_type, amount, customer_name, service_id }) => {
    const res = await client.post('/api/bills/buy_electricity', {
      userId, tag_id: tagId, network, meter_number,
      meter_type, amount: Number(amount), customer_name, service_id,
    }, { headers });
    return res.data;
  };

  const verifyTv = async ({ smart_card_number, service_id }) => {
    const res = await client.post('/api/bills/verify_tv', {
      smart_card_number, service_id,
    }, { headers });
    return res.data;
  };

  const buyTv = async ({ network, smart_card_number, plan_id, plan_name, amount, customer_name }) => {
    const res = await client.post('/api/bills/buy_tv', {
      userId, tag_id: tagId, network, smart_card_number,
      plan_id, plan_name, amount: Number(amount), customer_name,
    }, { headers });
    return res.data;
  };

  const buyExamCards = async ({ exam_type, quantity }) => {
    const res = await client.post('/api/bills/buy_exam_cards', {
      userId, tag_id: tagId, exam_type, quantity: Number(quantity),
    }, { headers });
    return res.data;
  };

  return {
    userId, tagId, headers,
    networks, plans,
    networksLoading, plansLoading,
    fetchNetworks, fetchDataPlans,
    buyAirtime, buyData,
    verifyMeter, buyElectricity,
    verifyTv, buyTv, buyExamCards,
    userBalance: user?.userData?.amount || 0,
    userTag: tagId,
  };
};