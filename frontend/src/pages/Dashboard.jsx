import React, { useEffect } from 'react'
import api from '../api/axios'
import API_ENDPOINTS from '../api/apiEndPoints'

const Dashboard = () => {

  const healthCheck = async () => {
  const res = await api.get("/health");
  console.log(res);
};

  useEffect(() => {
    healthCheck();
  }, []);

  return (
    <div>
      Dashboard
    </div>
  );
};

export default Dashboard;
