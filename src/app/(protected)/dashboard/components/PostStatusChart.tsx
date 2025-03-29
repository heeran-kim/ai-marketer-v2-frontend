// src/app/(protected)/dashboard/components/PostStatusChart.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { PostsSummary } from "@/types/business";
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
      const counts = [
        data.numScheduledPosts,
        data.numPublishedPosts,
        data.numFailedPosts,
      ];

      const chart: ChartData<"doughnut"> = {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
            ],
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
      <div className="h-64">
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
