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
      createAction: (router) => ({
        onClick: () => router.push("/posts?mode=create", { scroll: false }),
      }),
    },
    subPages: [
      {
        href: "/posts/create",
        header: {
          title: "Create Post",
          description:
            "Start by uploading an image. Then, adjust the post settings to generate the perfect caption!",
        },
      },
    ],
  },
  {
    name: "Promotions",
    href: "/promotions",
    header: {
      title: "Promotions",
    },
    subPages: [
      {
        href: "/promotions/new",
        header: {
          title: "Create Promotion",
          description:
            "Leverage machine learning to generate high-impact promotions.",
        },
      },
    ],
  },
  {
    name: "Settings",
    href: "/settings",
    header: {
      title: "Settings",
      description: "",
    },
    subPages: [
      {
        name: "General",
        href: "/settings/general",
      },
      {
        name: "Upload Sales Data",
        href: "/settings/sales",
      },
      {
        name: "Link Social Accounts",
        href: "/settings/social",
      },
      {
        name: "Account Settings",
        href: "/settings/account",
      },
    ],
  },
];
