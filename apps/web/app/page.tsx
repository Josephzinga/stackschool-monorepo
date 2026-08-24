import PillNav, {PillNavItem} from "@/components/marketing/pill-nav";

const navItem: PillNavItem[] = [
  {
    label: "Accueil",
    href: '/',
    ariaLabel: "Accueil",
  }
]

export default function Home() {
  return <div className="">
    <PillNav items={navItem} logo="Stackschool"/>
  </div>;
}
