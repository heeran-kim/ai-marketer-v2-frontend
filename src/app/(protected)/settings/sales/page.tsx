// src/app/(protected)/settings/sales/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { Card } from "@/components/common";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import { SETTINGS_API } from "@/constants/api";
import { SalesDailyRevenue } from "@/types/sales";
import { useNotification } from "@/context/NotificationContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { actionIcons, spinner } from "@/utils/icon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

export default function SalesDataUpload() {
  const [isMobile, setIsMobile] = useState(false);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();
  const { data, isLoading, mutate } = useFetchData<SalesDailyRevenue>(
    SETTINGS_API.SALES
  );

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRefresh = async () => {
    if (data?.squareConnected) {
      setIsProcessing(true);
      try {
        // Fetch data from Square and update the database
        await apiClient.post(SETTINGS_API.SALES_REFRESH, {});
        await mutate();
        showNotification("success", "Sales data refreshed from Square.");
      } catch (err) {
        console.error("Error refreshing data from Square:", err);
        showNotification("error", "Failed to refresh data from Square.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const formattedChartData = useMemo(() => {
    if (!data || !data.labels || data.labels.length === 0) {
      return {
        datasets: [
          {
            label: "Sales",
            data: [],
            borderColor: "rgb(94, 53, 177)",
            backgroundColor: "rgba(94, 53, 177, 0.3)",
            fill: true,
          },
        ],
      };
    }

    const chartData = data.labels.map((label, index) => {
      const parts = label.split("-");
      const date = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );

      return {
        x: date.toISOString(),
        y: data.datasets[0].data[index],
      };
    });

    const today = new Date();

    const hasToday = chartData.some((point) => {
      const pointDate = new Date(point.x);
      return pointDate.toDateString() === today.toDateString();
    });

    if (!hasToday) {
      chartData.push({
        x: today.toISOString(),
        y: null as unknown as number,
      });
    }

    return {
      datasets: [
        {
          label: "Sales",
          data: chartData,
          borderColor: "rgb(94, 53, 177)",
          backgroundColor: "rgba(94, 53, 177, 0.3)",
          fill: true,
        },
      ],
    };
  }, [data]);

  const chartOptions = useMemo(() => {
    if (!data || !data.labels || data.labels.length == 0) return;

    const today = new Date();
    const displayDays = isMobile ? 7 : 30;

    let minDate;

    const firstLabelParts = data.labels[0].split("-");
    const firstDataDate = new Date(
      parseInt(firstLabelParts[2]),
      parseInt(firstLabelParts[1]) - 1,
      parseInt(firstLabelParts[0])
    );

    const limitDate = new Date();
    limitDate.setDate(today.getDate() - displayDays);

    minDate = firstDataDate > limitDate ? firstDataDate : limitDate;

    // Ensure that the chart will always show at least 7 days
    const minRequiredDate = new Date(today);
    minRequiredDate.setDate(today.getDate() - 7);
    if (minDate > minRequiredDate) {
      minDate = minRequiredDate;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time" as const,
          time: {
            unit: "day" as const,
            displayFormats: {
              day: isMobile ? "d" : "d MMM",
            },
            tooltipFormat: "PP",
          },
          min: minDate.toISOString(),
          max: today.toISOString(),
          title: {
            display: !isMobile,
            text: "Date",
          },
        },
        y: {
          ticks: {
            callback: function (value: string | number) {
              const numericValue =
                typeof value === "number" ? value : parseFloat(value);
              return numericValue >= 1000
                ? numericValue / 1000 + "k"
                : numericValue;
            },
            font: {
              size: 11,
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top" as const,
          display: !isMobile,
        },
        title: {
          display: true,
          text: isMobile ? "Last 7 Days" : "Last 30 Days Sales Data",
        },
      },
    };
  }, [data, isMobile]);

  const handleFileChange = (file: File | null) => {
    setSalesFile(file);
    setError("");
  };

  const handleSaveFile = async () => {
    if (!salesFile) {
      setError("Please upload a file first");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", salesFile);
    try {
      await apiClient.post(SETTINGS_API.SALES, formData, {}, true);
      await mutate();
      setSalesFile(null);
      showNotification("success", "File Uploaded successfully!");
    } catch (err) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          setError(
            parsed?.data?.error || parsed?.statusText || "Upload failed"
          );
        } catch {
          setError(err.message);
        }
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xs sm:max-w-3xl mx-auto space-y-6">
      <Card
        title="Recent Sales Data"
        description={`Displaying sales data from ${
          isMobile
            ? "the last 7 days"
            : "the earliest available data (up to 30 days)"
        }`}
        showButton={false}
        actionSlot={
          data?.squareConnected && (
            <button
              onClick={handleRefresh}
              disabled={isProcessing}
              className="relative"
            >
              {isProcessing ? spinner : actionIcons.refresh}
            </button>
          )
        }
      >
        <div className="h-64 w-full text-sm">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading chart data...</p>
            </div>
          ) : data && data.labels.length > 0 ? (
            <Line options={chartOptions} data={formattedChartData} />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p className="whitespace-pre-line text-center">
                {`No sales data available.
                Please connect Square or upload a file
                to see your sales chart.`}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Upload Sales Data"
        description="Upload CSV file with product-level sales data"
        restriction="Required columns: Date, Product Name, Price, Quantity"
        buttonText={isProcessing ? "Uploading..." : "Upload"}
        onClick={handleSaveFile}
        buttonDisabled={isProcessing || !salesFile}
      >
        <DragAndDropUploader onChange={handleFileChange} fileType="data" />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Card>
    </div>
  );
}
