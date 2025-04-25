// src/app/(protected)/settings/sales/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { Card } from "@/components/common";
import DragAndDropUploader from "@/components/common/DragAndDropUploader";
import { SETTINGS_API } from "@/constants/api";
import {
  SalesDailyRevenue,
  ChartData,
  SalesDataResponse,
  ProductPerformance,
} from "@/types/sales";
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

// Tab type definition
type ChartTab = "overall" | "top" | "bottom";

export default function SalesDataUpload() {
  const [isMobile, setIsMobile] = useState(false);
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ChartTab>("overall");
  const { showNotification } = useNotification();
  const { data, isLoading, mutate } = useFetchData<SalesDataResponse>(
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
    if (data?.overallSales?.squareConnected) {
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

  const formatChartData = (chartData: SalesDailyRevenue | ChartData | null) => {
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
      return {
        datasets: [],
      };
    }

    const slicedLabels = isMobile
      ? chartData.labels.slice(-7)
      : chartData.labels;

    const slicedDatasets = chartData.datasets.map((dataset) => {
      const slicedData = isMobile ? dataset.data.slice(-7) : dataset.data;
      return {
        ...dataset,
        data: slicedData,
      };
    });

    return {
      labels: slicedLabels,
      datasets: slicedDatasets,
    };
  };

  const chartOptions = useMemo(() => {
    let chartTitle = "Sales Overview";
    if (activeTab === "top") {
      chartTitle = "Top 3 Best-Selling Products";
    } else if (activeTab === "bottom") {
      chartTitle = "Bottom 3 Least-Selling Products";
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            font: {
              size: isMobile ? 10 : 12,
            },
          },
          title: {
            display: true,
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
          title: {
            display: true,
            text: "Revenue ($)",
          },
        },
      },
      plugins: {
        legend: {
          position: "top" as const,
          display: !isMobile && activeTab !== "overall",
        },
        title: {
          display: true,
          text: chartTitle,
        },
      },
    };
  }, [activeTab, isMobile]);

  const getActiveChartData = () => {
    if (!data) return null;

    switch (activeTab) {
      case "top":
        return data.topProducts?.chart;
      case "bottom":
        return data.bottomProducts?.chart;
      case "overall":
      default:
        return data.overallSales;
    }
  };

  const renderProductList = (products: ProductPerformance[] | undefined) => {
    if (!products || products.length === 0) return null;

    return (
      <div className="mt-6 mb-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium mb-3 text-gray-700">
          {activeTab === "top"
            ? "Top 3 Best-Selling Products (Last 30 days)"
            : "Bottom 3 Least-Selling Products (Last 30 days)"}
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                    {product.productName || "Unknown"}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap text-gray-700">
                    ${Number(product.totalRevenue).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap text-gray-700">
                    {product.totalUnits}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap text-gray-700">
                    ${Number(product.averagePrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

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
    setError("");
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
        title="Sales Data Analysis"
        description={`View your sales performance and ${
          activeTab === "overall"
            ? "overall revenue trends"
            : activeTab === "top"
            ? "top 3 best-selling products"
            : "3 lowest-performing products"
        }`}
        showButton={false}
        actionSlot={
          data?.overallSales?.squareConnected && (
            <button
              onClick={handleRefresh}
              disabled={isProcessing}
              className="relative"
              title="Refresh data from Square"
            >
              {isProcessing ? spinner : actionIcons.refresh}
            </button>
          )
        }
      >
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "overall"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("overall")}
          >
            Overall
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "top"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("top")}
          >
            Top Products
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "bottom"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("bottom")}
          >
            Bottom Products
          </button>
        </div>

        <div className="w-full text-sm">
          <div className="h-64">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading chart data...</p>
              </div>
            ) : data ? (
              <Line
                options={chartOptions}
                data={formatChartData(getActiveChartData())}
              />
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

          {data && !isLoading && (
            <>
              {activeTab === "top" &&
                renderProductList(data.topProducts?.summary)}
              {activeTab === "bottom" &&
                renderProductList(data.bottomProducts?.summary)}
            </>
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
