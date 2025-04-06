// src/app/(protected)/dashboard/components/PostStatusChart.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { PostsSummary } from "@/types/business";
import { STATUS_COLORS_CHART } from "@/components/styles";
import {
  ChartData,
  ChartEvent,
  ActiveElement,
  ChartOptions,
  TooltipItem,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PostStatusChartProps {
  data: PostsSummary;
}

export const PostStatusChart = ({ data }: PostStatusChartProps) => {
  const router = useRouter();
  const [chartData, setChartData] = useState<ChartData<"doughnut"> | null>(
    null
  );

  useEffect(() => {
    if (data) {
      const labels: string[] = ["Scheduled", "Published", "Failed"];
      const counts = [data.numScheduled, data.numPublished, data.numFailed];

      const backgroundColors = labels.map(
        (status) => STATUS_COLORS_CHART[status] ?? "rgba(0, 0, 0, 0.3)"
      );

      const borderColors = labels.map(
        (status) =>
          STATUS_COLORS_CHART[status]?.replace("0.6", "1") ?? "rgba(0,0,0,1)"
      );

      const chart: ChartData<"doughnut"> = {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      };

      setChartData(chart);
    }
  }, [data]);

  const handleStatusClick = (event: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0 && chartData?.labels) {
      const { index } = elements[0];
      const label = chartData.labels[index];

      if (typeof label === "string") {
        const status = label.toLowerCase();
        router.push(`/posts?status=${status}`);
      }
    }
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value} posts`;
          },
        },
      },
    },
    onClick: handleStatusClick,
  };

  if (!chartData) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <p className="text-gray-500">Loading Post Data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Post Status Overview</h3>
      <div className="h-64 flex items-center justify-center">
        <Doughnut data={chartData!} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {chartData?.labels?.map((status, index) => (
          <div
            key={status as string}
            className="text-center cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() =>
              router.push(`/posts?status=${(status as string).toLowerCase()}`)
            }
          >
            <div className="flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{
                  backgroundColor:
                    (chartData.datasets[0].backgroundColor as string[])[
                      index
                    ] ?? "#ccc",
                }}
              ></div>
              <span className="text-sm font-medium">{status as string}</span>
            </div>
            <div className="text-lg font-bold">
              {chartData?.datasets?.[0]?.data?.[index] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
