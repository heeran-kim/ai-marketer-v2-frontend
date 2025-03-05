// app/(protected)/dashboard/components/DashboardCard.tsx
import clsx from "clsx";
import { baseContainerClass } from "@/components/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navItems";
import { DashboardData } from "@/app/types/business";
import ActionDropdown from "@/components/common/ActionDropdown";
import BusinessInfo from "./BusinessInfo";

interface DashboardCardProps {
    dashboardData: DashboardData;
}

export default function DashboardCard({ dashboardData }: DashboardCardProps) {
    const router = useRouter();

    const actions = NAV_ITEMS
        .filter(({ href }) => href !== "/dashboard")
        .map(({ name, href }) => ({
            label: name,
            onClick: () => router.push(href),
        }));

    return (
        <div className={clsx(
            "relative p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col cursor-pointer",
            baseContainerClass
        )}>
            <ActionDropdown actions={actions} />

            <div className="flex items-center space-x-4">
                <Image 
                    src={dashboardData.business.logo} 
                    alt={`${dashboardData.business.name} Logo`} 
                    width={60} 
                    height={60} 
                    className="rounded-full" 
                />
                <BusinessInfo dashboardData={dashboardData} />
            </div>
        </div>
    );
}
