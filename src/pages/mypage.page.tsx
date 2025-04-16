import { MyPosts } from "@/components/mypage/my-posts";
import { UserInfo } from "@/components/mypage/user-info";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { List, User2 } from "lucide-react";
import { useSearchParams } from "react-router";

const links = [
  {
    label: "내 정보",
    href: "/mypage?tab=userinfo",
    icon: <User2 className="h-5 w-5 shrink-0" />,
  },
  {
    label: "내 게시글",
    href: "/mypage?tab=post",
    icon: <List className="h-5 w-5 shrink-0" />,
  },
];

export const MyPage = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "userinfo";

  return (
    <SidebarProvider>
      <FloatingDock items={links} />
      <Sidebar className="top-20 bg-background">
        <SidebarContent className="bg-background">
          <SidebarGroup>
            <SidebarGroupLabel>마이페이지</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <a href={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="w-full max-w-4xl mx-auto">
        {tab === "userinfo" && <UserInfo />}
        {tab === "post" && <MyPosts />}
      </div>
    </SidebarProvider>
  );
};
