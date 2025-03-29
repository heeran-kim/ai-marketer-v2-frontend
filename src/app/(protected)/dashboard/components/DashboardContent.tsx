import { DashboardData } from "@/types/business";
import DashboardCard from "./DashboardCard";
import { PostStatusChart } from "./PostStatusChart";
import { PlatformStatusChart } from "./PlatformStatusChart";

interface DashboardCardProps {
  data: DashboardData;
}

export const DashboardContent = ({ data }: DashboardCardProps) => {
  return (
    <>
      <DashboardCard data={data} />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PostStatusChart data={data.postsSummary} />
        <PlatformStatusChart data={data.linkedPlatforms} />
      </div>
    </>
  );
};
