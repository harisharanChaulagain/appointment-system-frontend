"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import useGoogleLoginOrRegister from "../hooks/useGoogleLoginOrRegister";
import { toast } from "react-hot-toast";

interface GoogleLoginResponse {
  credential: string;
}

export default function Page() {
  const { login, loading, data } = useAuth();
  const {
    googleLogin,
    loading: googleLoading,
    data: googleData,
  } = useGoogleLoginOrRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const hasToastShown = useRef(false);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        // client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_id: "310963895793-c890f9q1fuftas3doo5ds50nm275g68m.apps.googleusercontent.com",
        callback: handleGoogleLoginSuccess,
      });

      window.google?.accounts.id.renderButton(
        document.getElementById("google-login-button")!,
        { theme: "outline", size: "large" }
      );
    };
    document.head.appendChild(script);
  }, []);

  const handleGoogleLoginSuccess = async (response: GoogleLoginResponse) => {
    const googleToken = response.credential;
    console.log("Google Login Token:", googleToken); // Debugging Google Token
    await googleLogin(googleToken);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Local Storage Token:", token); // Debugging token in localStorage
    if (token) {
      if (!hasToastShown.current) {
        hasToastShown.current = true;
        toast.success("You are already logged in.");
      }
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with Email:", email, "Password:", password); // Debugging email and password
    await login(email, password);
  };

  useEffect(() => {
    if (data && data?.token) {
      console.log("Login successful, Token:", data.token); // Debugging token after login
      localStorage.setItem("token", data.token);
      router.push("/");
    }
  }, [data?.token, router]);

  useEffect(() => {
    if (googleData?.token) {
      console.log("Google Login successful, Token:", googleData.token); // Debugging google login token
      localStorage.setItem("token", googleData.token);
      router.push("/");
    }
  }, [googleData?.token, router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] w-full max-w-lg p-8 rounded-2xl">
        <h1 className="text-xl font-semibold">Welcome Back! Please Log In </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <label className="input input-bordered flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Login..." : "Login"}
          </button>
        </form>
        <div className="py-1 text-sm">----------- OR ----------</div>
        <div
          id="google-login-button"
          className="w-full flex items-center justify-center bg-gray-100 text-sm p-4 rounded-md cursor-pointer"
        >
          Login With Google
        </div>

        <Link
          href="/register"
          className="text-sm hover:underline hover:text-blue-500 transition-colors duration-300"
        >
          Don&apos;t have an account? Sign up now!
        </Link>
      </div>
    </div>
  );
}
