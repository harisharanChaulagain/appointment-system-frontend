"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "./utils/axios";
import AppointmentSchedulers from "./components/AppointmentSchedulars";
import Header from "./components/Header";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <Header/>
        <AppointmentSchedulers/>
      </div>
    );
  }

  return null;
}
