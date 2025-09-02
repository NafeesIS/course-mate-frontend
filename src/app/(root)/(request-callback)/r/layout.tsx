import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance Alert: Form INC-20A Filing Overdue | FileSure',
  description:
    "Urgent compliance alert for Form INC-20A filing. Check your company's status and schedule a call with our experts to ensure timely submission and avoid penalties.",
  robots: {
    index: false,
    follow: false,
  },
  // other global metadata properties
};

export default function RequestCallBackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
