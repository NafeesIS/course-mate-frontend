// Document Type
export type TFinancialDocument = {
  fileName: string;
  s3Url: string;
  isAttachment: boolean;
};

// MetaData Type and Interface
export interface IFinancialMetaData {
  fy_end: string;
  stated_on: string;
  doc_type: string;
  unit: string;
  mca_form_id: string;
  documents: TFinancialDocument[];
  standard_display_name: string;
}

// Liabilities Type and Interface
export interface IFinancialLiabilities {
  contribution_received: number;
  reserves_and_surplus: number;
  secured_loan: number;
  unsecured_loan: number;
  short_term_borrowing: number;
  trade_payables: number;
  other_liabilities: number;
  other_liabilities_specific: string;
  provisions_for_taxation: number;
  provisions_for_contingencies: number;
  provisions_for_insurance: number;
  other_provisions: number;
  liabilities_total: number;
}

// Assets Type and Interface
export interface IFinancialAssets {
  gross_fixed_assets: number;
  depreciation_and_amortization: number;
  net_fixed_assets: number;
  investments: number;
  loans_and_advances: number;
  inventories: number;
  trade_receivables: number;
  cash_and_equivalents: number;
  other_assets: number;
  other_assets_specific: string;
  assets_total: number;
}

// Income Statement Type and Interface
export interface IFinancialIncomeStatement {
  period_from: string | null;
  period_to: string | null;
  gross_turnover: number;
  excise_duty: number;
  net_turnover: number;
  dom_sale_of_goods_manufactured: number;
  dom_sale_of_goods_traded: number;
  dom_sale_of_services: number;
  export_sale_of_goods_manufactured: number;
  export_sale_of_goods_traded: number;
  export_sale_of_services: number;
  other_income: number;
  stock_adjustments: number;
  total_income: number;
  raw_material_consumed: number;
  purchases_for_resale: number;
  consumption_stores: number;
  power_and_fuel: number;
  personnel_expenses: number;
  administrative_expenses: number;
  payment_to_auditors: number;
  selling_expenses: number;
  insurance_expenses: number;
  depreciation: number;
  interest: number;
  other_expenses: number;
  total_expenditure: number;
  net_profit_before_tax: number;
  provision_for_tax: number;
  profit_after_tax: number;
  profit_transferred_to_partners: number;
  profit_transferred_to_reserves: number;
}

// Financial Data Year Type and Interface
export interface IFinancialDataYear {
  metaData: IFinancialMetaData;
  liabilities: IFinancialLiabilities;
  assets: IFinancialAssets;
  income_statement: IFinancialIncomeStatement;
}

// Financial Data Type and Interface
export type TFinancialData = Record<string, IFinancialDataYear>;

// API Response Type and Interface
export interface IFinancialDocsApiResponse {
  success: boolean;
  message: string;
  data: TFinancialData;
}
