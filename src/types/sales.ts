// src/types/sales.ts

export interface SalesDailyRevenue {
  squareConnected: boolean;
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }
  ];
}
