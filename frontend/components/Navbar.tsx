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
} from "./ui/sidebar";

const Navbar = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 👉 Animation GSAP à l’ouverture / fermeture
  useEffect(() => {
    Object.entries(contentRefs.current).forEach(([title, el]) => {
      if (!el) return;

      if (openGroup === title) {
        // Animation d'ouverture
        gsap.to(el, {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.fromTo(
          el.children,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            delay: 0.1,
            duration: 0.3,
          }
        );
      } else {
        // Animation de fermeture
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    });
  }, [openGroup]);

  return (
    <div className="!bg-transparent">
      <Sidebar className="!bg-transparent">
        {/* --- Header --- */}
        <SidebarHeader>
          <div className="text-lg font-semibold text-center text-blue-600">
            Logo Fatt
          </div>
        </SidebarHeader>

        {/* --- Content --- */}
        <SidebarContent>
          <SidebarGroup>
            {menuItems.map((group) => (
              <div key={group.title} className="mb-2">
                {/* --- Bouton du groupe --- */}
                <button
                  onClick={() =>
                    setOpenGroup(openGroup === group.title ? null : group.title)
                  }
                  className={`flex items-center justify-between w-full text-sm font-semibold px-3 py-2 transition rounded-md ${
                    openGroup === group.title
                      ? "text-blue-600 bg-blue-50 dark:bg-gray-800"
                      : "text-gray-800 dark:text-gray-200 hover:text-blue-600"
                  }`}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openGroup === group.title ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* --- Contenu animé GSAP --- */}
                <div
                  ref={(el) => (contentRefs.current[group.title] = el)}
                  style={{ overflow: "hidden", height: 0, opacity: 0 }}
                  className="ml-3 mt-1 space-y-1">
                  {group.items.map((item) => (
                    <SidebarGroupContent key={item.label}>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-md transition">
                              <item.icon className="w-4 h-4" />
                              <span className="text-sm">{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  ))}
                </div>
              </div>
            ))}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default Navbar;
