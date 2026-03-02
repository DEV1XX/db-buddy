import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";

export const useApi = () => {
  const { getToken } = useAuth();

  const authApi = async () => {
    const token = await getToken();
    
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    return api;
  };

  return authApi;
};