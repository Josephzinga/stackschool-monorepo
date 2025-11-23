"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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

export default function Navbar() {
  // état: clé = titre du groupe, valeur = boolean (ouvert / fermé)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  // refs vers les containers (div) de chaque groupe
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // timelines par groupe (pour kill si besoin)
  const timelines = useRef<Record<string, gsap.core.Timeline | null>>({});

  // cleanup au démontage
  useEffect(() => {
    return () => {
      Object.values(timelines.current).forEach((tl) => tl?.kill());
    };
  }, []);

  // toggle + animation GSAP
  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => {
      const willOpen = !prev[title];
      const el = contentRefs.current[title];

      // update state immédiatement (UI CSS rotate etc.)
      const next = { ...prev, [title]: willOpen };

      if (!el) {
        // pas d'élément DOM (sécurité)
        return next;
      }

      // tuer timeline existante
      timelines.current[title]?.kill();

      if (willOpen) {
        // --- OUVERTURE ---
        // s'assurer qu'on part de height: 0
        gsap.set(el, { height: 0, opacity: 0, clearProps: "transform" });

        // mesurer la hauteur complète
        const fullHeight = el.scrollHeight;

        const tl = gsap.timeline();
        // animer le container (slide down + fade)
        tl.to(el, {
          height: fullHeight,
          opacity: 1,
          duration: 0.36,
          ease: "power2.out",
        });
        // stagger des enfants (petit translateY + fade)
        tl.fromTo(
          Array.from(el.children),
          { y: 8, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.26 },
          "<0.06"
        );
        // après l'animation, mettre height à auto pour responsive
        tl.call(() => gsap.set(el, { height: "auto" }));

        timelines.current[title] = tl;
      } else {
        // --- FERMETURE ---
        // mesurer hauteur courante (au cas où c'est 'auto')
        const currentHeight = el.scrollHeight;

        const tl = gsap.timeline();
        // d'abord cacher les enfants
        tl.to(Array.from(el.children), {
          y: 8,
          opacity: 0,
          stagger: 0.05,
          duration: 0.12,
        });
        // puis fermer le conteneur (slide up)
        tl.to(
          el,
          {
            height: 0,
            opacity: 0,
            duration: 0.28,
            ease: "power2.inOut",
          },
          "<0.02"
        );

        timelines.current[title] = tl;
      }

      return next;
    });
  };

  return (
    <div className="">
      <Sidebar className="">
        <SidebarHeader>
          <div className="text-lg font-semibold text-center text-blue-600">
            Logo Fatt
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {menuItems.map((group) => (
              <div key={group.title} className="mb-2">
                {/* trigger */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`flex items-center justify-between w-full text-sm font-semibold px-3 py-2 transition rounded-md hover:bg-white cursor-pointer duration-200 ${
                    openGroups[group.title]
                      ? "text-blue-600 bg-blue-50 dark:bg-gray-800"
                      : "text-gray-800 dark:text-gray-200 hover:text-blue-600"
                  }`}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  {/* rotation simple via classe (tu peux animer la rotation via GSAP si tu veux) */}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openGroups[group.title] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* container animé */}
                <div
                  ref={(el) => (contentRefs.current[group.title] = el)}
                  // style initial: fermé (height:0, opacity:0). Quand on ouvre, GSAP animera et ensuite on met height:auto.
                  style={{
                    overflow: "hidden",
                    height: openGroups[group.title] ? "auto" : 0,
                    opacity: openGroups[group.title] ? 1 : 0,
                  }}
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
}
