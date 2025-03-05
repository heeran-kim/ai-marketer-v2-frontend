// src/constants/navItems.ts
import { NavItem } from "@/app/types/nav";

export const NAV_ITEMS: NavItem[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        header: {
            title: "Dashboard",
            description: "Welcome to your dashboard. Get an overview of your business, including posts and key metrics. More tools and insights will be available soon!",
        }
    },
    {
        name: "Posts",
        href: "/posts",
        header: {
            title: "Posts",
            description: `
            Manage, schedule, and monitor your social media posts across multiple platforms in one place.
            - 📊 **Cross-platform Overview:** View all your posts across different social media platforms in a single list, including reactions and comment counts.
            - ❌ **Delete Unwanted Posts:** No need to delete posts manually on each platform—remove them directly from here with a single click.
            - ⏳ **Edit Scheduled Posts:** Modify scheduled posts, including their post time and content.
            - ⚠️ **Resolve Failed Posts:** If a post fails due to account issues, get notified and retry after fixing the problem.
            - ✨ **Create New Posts with AI Captions**: Want to generate a new post using AI-generated captions? Simply click the “⋯” (More Options) button on the right and select “Create Post”.
            `,
            createAction: (router) => ({
                onClick: () => router.push("/posts?create=true", { scroll: false }),
            }),
            moreActions: (router) => [
                {
                    label: "Learn about Social Media Management",
                    onClick: () => router.push("/features/social-media-management")
                },
                {
                    label: "Learn about AI Captions",
                    onClick: () => router.push("/features/ai-captions")
                },
            ],
        },
        subPages: [
            {
                href: "/posts/create",
                header: {
                    title: "Create Post",
                    description: "Start by uploading an image. Then, adjust the post settings to generate the perfect caption!",
                }
            }
        ],
    },
    {
        name: "Promotions",
        href: "/promotions",
        header: {
            title: "Promotions",
            description: `
                Manage and track your event discounts, special deals, and creative promotions all in one place.
                - 💸 **Event Discounts & Flash Sales:** Easily set up limited-time offers to draw in new customers.
                - 🍔 **Menu & Combo Deals:** Get AI-driven suggestions for menu upgrades, combo deals, or seasonal offerings.
                - 🤖 **Machine Learning Insights:** Leverage advanced recommendations to craft high-impact promotions that drive sales.
                - 🔎 **Performance Tracking:** Stay on top of each promotion’s results, from redeemed discounts to boosted traffic.
                
                Want to create a brand-new promotion?
                Just click the “⋯” (More Options) button on the top right and select “Create Promotion”.
                `,
                moreActions: (router) => [
                    { label: "Create Promotion", onClick: () => router.push("/promotions/new") },
                    { label: "Learn More", onClick: () => router.push("/features/promotion-suggestions") },
                ],
        },
        subPages: [
            {
                href: "/promotions/new",
                header: {
                    title: "Create Promotion",
                    description: "Leverage machine learning to generate high-impact promotions.",
                }
            }
        ],
    },
    {
        name: "Analytics",
        href: "/analytics",
        header: {
            title: "Analytics",
            description: "Analyze your performance with detailed insights and reports.",
        }
    },
    {
        name: "Settings",
        href: "/settings",
        header: {
            title: "General Information",
            description: "Manage your general business information.",
        },
        subPages: [
            { 
                href: "/settings/sales",
                header: {
                    title: "Upload Sales Data", description: "Upload and track your sales performance."
                },
            },
            { 
                href: "/settings/billing",
                header: {
                    title: "Billing & Payments", description: "Manage your billing details and payment methods."
                },
            },
            { 
                href: "/settings/social",
                header: {
                    title: "Social Media", description: "Connect and manage your social media accounts."
                },
            },
            { 
                href: "/settings/account",
                header: {
                    title: "Account Settings", description: "Update your login credentials and personal details."
                },
            }
        ],
    },
];