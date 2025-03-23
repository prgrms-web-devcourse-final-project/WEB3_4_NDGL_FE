import { LINKS } from "@/constants/links";
import Link from "next/link";
import { LogoIcon } from "../ui/icons";
import { navbarItems } from "@/constants/navbar";
import { Search } from "../common/search";

export const Navbar = () => {
  return (
    <nav className="w-full px-10 py-6 flex items-center justify-between">
      <Link href={LINKS.HOME} className="flex items-center gap-2.5">
        <LogoIcon className="size-6" pathClassName="fill-foreground" />
        <h1 className="text-sm font-extrabold">어디 갔대?</h1>
      </Link>
      <div className="flex items-center gap-6">
        <ul className="flex items-center gap-4 text-sm font-medium text-gray-800">
          {navbarItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <Search />
      </div>
    </nav>
  );
};
