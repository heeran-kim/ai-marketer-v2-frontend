"use client";
import { ReactNode } from "react";
import { FaServer, FaRobot, FaLightbulb, FaPen, FaChartLine } from "react-icons/fa";

interface FeatureItem {
    id: string;
    href: string;
    icon: ReactNode;
    name: string;
    shortDescription: string;
    longTitle: string;
    longDescription: string;
}

export const features: FeatureItem[] = [
    {
        id: "ai-captions",
        href: "/features/ai-captions",
        icon: <FaRobot className="text-xl" />,
        name: "AI Captions",
        shortDescription: "Auto-generate social media captions",
        longTitle: "AI-Powered Caption Generation",
        longDescription: `
            Generate compelling and engaging captions for your social media posts using AI. 
            Our AI system crafts captions based on your images, business type, and promotional goals, 
            ensuring your posts capture attention and drive engagement.
        `,
    },
    {
        id: "promotion-suggestions",
        href: "/features/promotion-suggestions",
        icon: <FaLightbulb className="text-xl" />,
        name: "Promotion Insights",
        shortDescription: "Smart suggestions for promotions",
        longTitle: "ML-Based Promotion Suggestions",
        longDescription: `
            Utilize machine learning to optimize your promotions based on sales patterns and industry trends.
            Our system analyzes past sales, competitor strategies, and customer behavior to recommend 
            the best promotions tailored to your restaurant.
        `,
    },
    {
        id: "social-media-management",
        href: "/features/social-media-management",
        icon: <FaPen className="text-xl" />,
        name: "Social Management",
        shortDescription: "Post & manage across platforms",
        longTitle: "Cross-Platform Social Media Management",
        longDescription: `
            Post across multiple platforms simultaneously and manage all your campaigns in one place.
            Schedule posts, track engagement, and maintain a consistent brand voice effortlessly.
        `,
    },
    {
        id: "marketing-analytics",
        href: "/features/marketing-analytics",
        icon: <FaChartLine className="text-xl" />,
        name: "Marketing Analytics",
        shortDescription: "Analyze performance & engagement",
        longTitle: "Marketing & Social Media Analytics",
        longDescription: `
            Track your marketing performance and social media impact with data-driven insights.
            Understand what works, measure ROI, and make informed decisions to optimize your campaigns.
        `,
    },
    {
        id: "tech-stack",
        href: "/features/tech-stack",
        icon: <FaServer className="text-xl" />,
        name: "Tech Stack",
        shortDescription: "Our core technologies & infrastructure",
        longTitle: "Technology Stack & System Architecture",
        longDescription: `
        `,
    }
];