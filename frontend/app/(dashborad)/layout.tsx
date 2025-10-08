import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        {children}
        <Image
          src="/5883.jpg"
          alt=""
          width={1000}
          height={1000}
          className="absolute inset-0 w-full h-screen mask-r-fr50% mask-r-from-80% -z-30"
        />
        <div className="w-[] ">
          <Navbar />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
