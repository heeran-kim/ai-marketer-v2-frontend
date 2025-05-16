// src/types/sales.ts

export interface SalesDailyRevenue {
  squareConnected: boolean;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalRevenue: number;
  totalUnits: number;
  averagePrice: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill?: boolean;
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

export interface ProductAnalysis {
  chart: ChartData;
  summary: ProductPerformance[];
}

export interface SalesDataResponse {
  overallSales: SalesDailyRevenue;
  topProducts: ProductAnalysis;
  bottomProducts: ProductAnalysis;
}
