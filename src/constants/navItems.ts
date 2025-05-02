// src/constants/navItems.ts
import { NavItem } from "@/types/nav";

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    header: {
      title: "Dashboard",
    },
  },
  {
    name: "Posts",
    href: "/posts",
    header: {
      title: "Posts",
    },
  },
  {
    name: "Promotions",
    href: "/promotions",
    header: {
      title: "Promotions",
    },
  },
  {
    name: "Settings",
    href: "/settings",
    header: {
      title: "Settings",
    },
    subPages: [
      {
        name: "General",
        href: "/settings/general",
      },
      {
        name: "Link Social Accounts",
        href: "/settings/social",
      },
      {
        name: "Account Settings",
        href: "/settings/account",
      },
      {
        name: "Link Square Account",
        href: "/settings/square",
      },
      {
        name: "Manage Sales Data",
        href: "/settings/sales",
      },
      {
        name: "Manage Menu Items",
        href: "/settings/items",
      },
    ],
  },
];
