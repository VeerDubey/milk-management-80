
export interface DeliverySheetItem {
  customerName: string;
  area?: string;
  GGH: number;
  GGH450: number;
  GTSF: number;
  GSD1KG: number;
  GPC: number;
  FL: number;
  totalQty: number;
  amount: number;
}

export interface DeliverySheetTotals {
  GGH: number;
  GGH450: number;
  GTSF: number;
  GSD1KG: number;
  GPC: number;
  FL: number;
  QTY: number;
  AMOUNT: number;
}

export interface DeliverySheetData {
  date: string;
  area: string;
  items: DeliverySheetItem[];
  totals: DeliverySheetTotals;
}
