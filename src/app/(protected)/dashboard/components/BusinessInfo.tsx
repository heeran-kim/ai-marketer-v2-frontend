// app/(protected)/dashboard/components/BusinessInfo.tsx
import LinkedPlatformIcons from "./LinkedPlatformIcons";
import BusinessStatus from "./BusinessStatus";
import LastPostInfo from "./LastPostInfo";
import { DashboardData } from "@/app/types/business";

interface BusinessInfoProps {
    dashboardData: DashboardData;
}

export default function BusinessInfo({ dashboardData }: BusinessInfoProps) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-2">
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-200">
                    {dashboardData.business.name}
                </h3> 
                <LinkedPlatformIcons linkedPlatforms={dashboardData.linkedPlatforms} />
            </div>

            <LastPostInfo postsSummary={dashboardData.postsSummary} />

            <BusinessStatus postsSummary={dashboardData.postsSummary} />
        </div>
    )
}