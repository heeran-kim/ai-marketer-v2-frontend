import { DashboardData } from "@/types/business";
import DashboardCard from "./DashboardCard";
import { PostStatusChart } from "./PostStatusChart";

interface DashboardCardProps {
  data: DashboardData;
}

export const DashboardContent = ({ data }: DashboardCardProps) => {
  return (
    <>
      <DashboardCard data={data} />
      <div className="mt-6">
        <PostStatusChart data={data.postsSummary} />
      </div>
    </>
  );
};
