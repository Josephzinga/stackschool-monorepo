"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { menuItems } from "@/lib/data";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Image from "next/image";
import { Separator } from "./ui/separator";

const AppSidebar = () => {
  console.log("joseph");
  return (
    <div className="">
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-bg.png"
              alt="logo"
              width={60}
              height={60}
              className="rounded-full object-contain scale-3d scale-105"
            />
            <span className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-violet-500 text-transparent bg-clip-text">
              College Fatt
            </span>
          </Link>
          <Separator className="bg-border" />
        </SidebarHeader>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
