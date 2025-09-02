export interface ITransaction {
  _id: string;
  orderId: string;
  paymentId?: string;
  serviceId: string;
  description: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface IStatCardProps {
  title: string;
  orderNumber: number;
  inrAmount: number;
  usdAmount: number;
  colorClass: string;
  status: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isSelected?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
}
