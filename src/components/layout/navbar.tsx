import {
  NavbarRoot,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/navbar-layout";
import { navItems } from "@/constants/navbar";
import { useState } from "react";
import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { NavbarSearch } from "./navbar-search";
import { ThemeToggle } from "../ui/theme-toggle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-key";
import { hasLogin, logout } from "@/services/auth.service";
import { toast } from "sonner";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data } = useQuery({
    queryKey: QUERY_KEY.AUTH.LOGIN,
    queryFn: hasLogin,
    select: (res) => res.data.data,
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("로그아웃되었습니다.");
      window.location.reload();
      window.localStorage.removeItem("authData");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "로그아웃에 실패하였습니다.");
    },
  });

  return (
    <div className="relative w-full">
      <NavbarRoot>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {data && data.isLoggedIn ? (
              <NavbarButton
                onClick={() => logoutMutation()}
                as="div"
                variant="secondary"
              >
                <Link to="#">로그아웃</Link>
              </NavbarButton>
            ) : (
              <NavbarButton as="div" variant="secondary">
                <Link to="/sign-in">로그인</Link>
              </NavbarButton>
            )}
            <div className="z-[999] flex items-center gap-2">
              <ThemeToggle />
              <NavbarSearch />
            </div>
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => {
              if (!item.link) {
                return (
                  <Accordion
                    type="single"
                    collapsible
                    className="relative w-full text-neutral-600 dark:text-neutral-300"
                  >
                    <AccordionItem value="item-1">
                      {item.link && (
                        <AccordionTrigger>
                          <Link to={item.link}>{item.name}</Link>
                        </AccordionTrigger>
                      )}
                      <AccordionContent>좋아요</AccordionContent>
                      <AccordionContent>팔로우</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              }

              return (
                <Link
                  key={`mobile-link-${idx}`}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </Link>
              );
            })}
            <div className="flex w-full flex-col gap-4">
              {data?.isLoggedIn ? (
                <NavbarButton
                  onClick={() => logoutMutation()}
                  variant="primary"
                  className="w-full"
                >
                  <Link to="#">로그아웃</Link>
                </NavbarButton>
              ) : (
                <NavbarButton variant="primary" className="w-full">
                  <Link to="/sign-in">로그인</Link>
                </NavbarButton>
              )}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <NavbarSearch onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarRoot>
    </div>
  );
};
