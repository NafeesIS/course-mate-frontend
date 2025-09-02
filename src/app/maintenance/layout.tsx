import type React from 'react';

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a special layout just for the maintenance page
  // It doesn't include the regular header and footer
  return <>{children}</>;
}
