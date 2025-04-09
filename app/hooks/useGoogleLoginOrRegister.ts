import { useState } from "react";
import axiosInstance from "../utils/axios";
import { toast } from "react-hot-toast";

const useGoogleLoginOrRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const googleLogin = async (googleToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/google-loginOrRegister", {
        token: googleToken,
      });

      setData(response?.data);
      toast.success("Google login successful!");
    } catch (err: any) {
      const errorMessage = err.response
        ? err.response.data.message
        : "Google login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { googleLogin, loading, error, data };
};

export default useGoogleLoginOrRegister;
