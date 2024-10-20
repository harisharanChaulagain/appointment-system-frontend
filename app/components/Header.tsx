import React from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 border-b sticky top-0 z-[999]">
      <span className="text-blue-500 text-xl">Hello, Schedule Your Appointment</span>
      <button
        onClick={handleLogout}
        className="flex items-center bg-red-500 text-white px-3 py-1 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="mr-1">
          <path fill="white" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default Header;
