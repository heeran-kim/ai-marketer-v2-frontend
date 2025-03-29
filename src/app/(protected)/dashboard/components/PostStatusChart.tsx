// src/app/(protected)/dashboard/components/PostStatusChart.tsx
"use client";

import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/dataHooks";
import { POSTS_API } from "@/constants/api";
import { PostDto } from "@/types/dto";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PostStatusChart() {
  const router = useRouter();
  const { data } = useFetchData<{ posts: PostDto[] }>(POSTS_API.LIST);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data?.posts) {
      const statusCounts = data.posts.reduce((acc, post) => {
        const status = post.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statuses = Object.keys(statusCounts);
      const counts = Object.values(statusCounts);

      setChartData({
        labels: statuses,
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
      });
    }
  }, [data]);

  const handleStatusClick = (event: any, elements: any) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const status = chartData.labels[index];
      router.push(`/posts?status=${status}`);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
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
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {chartData.labels.map((status: string, index: number) => (
          <div
            key={status}
            className="text-center cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => router.push(`/posts?status=${status}`)}
          >
            <div className="flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{
                  backgroundColor: chartData.datasets[0].backgroundColor[index],
                }}
              ></div>
              <span className="text-sm font-medium">{status}</span>
            </div>
            <div className="text-lg font-bold">
              {chartData.datasets[0].data[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
