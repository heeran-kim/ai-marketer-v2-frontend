import { DashboardData } from "@/types/business";
import { BusinessProfileCard } from "./BusinessProfileCard";
import { PlatformAccountsCard } from "./PlatformAccountsCard";
import { PostStatusChart } from "./PostStatusChart";
import { PlatformStatusChart } from "./PlatformStatusChart";
import { PostActivityCalendar } from "./PostActivityCalendar";

interface DashboardCardProps {
  data: DashboardData;
}

export const DashboardContent = ({ data }: DashboardCardProps) => {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <BusinessProfileCard business={data.business} />
        <PlatformAccountsCard platforms={data.linkedPlatforms} />
        <PostStatusChart data={data.postsSummary} />
        <PlatformStatusChart data={data.linkedPlatforms} />
      </div>
      <div className="mt-6">
        <PostActivityCalendar postActivity={data.postActivity} />
      </div>
    </>
  );
};
