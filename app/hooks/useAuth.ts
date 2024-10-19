import { useState } from "react";
import axiosInstance from "../utils/axios";
import { toast } from "react-hot-toast";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/register", {
        username,
        email,
        password,
      });

      setData(response?.data);
      toast.success("Registration successful!");
    } catch (err: any) {
      const errorMessage = err.response
        ? err.response.data.message
        : "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/login", { email, password });
      setData(response?.data);
      toast.success("Login successful!");
    } catch (err: any) {
      const errorMessage = err.response
        ? err.response.data.message
        : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { register, login, loading, error, data };
};

export default useAuth;
