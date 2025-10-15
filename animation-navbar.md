Parfait 🔥 tu as **excellent goût !**
GSAP est _plus fluide et plus puissant_ que Framer Motion pour ce genre d’animation, surtout quand tu veux un **menu dynamique et vivant** 🎨

Voyons comment **intégrer GSAP dans ton sidebar collapsible** avec ton code existant.

---

## 🚀 Objectif

Quand tu cliques sur un groupe :

- Il se **déplie en douceur** (slide down)
- Les items apparaissent avec une **petite animation d’opacité et de décalage vertical**
- GSAP gère tout (plus performant qu’un simple `transition`)

---

## 🧱 Étape 1 : installer GSAP

Si tu ne l’as pas encore :

```bash
npm install gsap
```

---

## ⚙️ Étape 2 : version améliorée de ton composant `Navbar`

Voici une version **GSAP-powered** 🧩

> Elle garde ton design avec `Sidebar`, `SidebarGroup`, `SidebarMenu`, etc.

```tsx
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
```

---

## 💫 Effet visuel obtenu :

- Le **groupe s’ouvre doucement (slide-down)**
- Les éléments du menu **apparaissent avec un petit “fade + montée” fluide**
- GSAP gère tout sans lag, même sur petits écrans
- Compatible avec **dark/light mode**

---

## 🧠 Bonus : Personnaliser la vitesse et le style

Dans la partie `gsap.to(el, { ... })`, tu peux ajuster :

```js
duration: 0.5,       // durée de l’animation
ease: "back.out(1.7)" // effet rebond doux
```

Ou même ajouter un effet de rebond :

```js
ease: "elastic.out(1, 0.5)";
```

---

Souhaites-tu que je t’ajoute aussi un **effet GSAP au survol des icônes** (par exemple légère rotation ou glow coloré bleu) ?
👉 Ça rend le menu encore plus “vivant” sans être trop lourd.
