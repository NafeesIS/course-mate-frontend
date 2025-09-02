'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronRight, Laptop, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

type DashboardSelectorProps = {
  children: ReactNode;
  onSelectUserDashboard: () => void;
};

const DashboardSelector = ({
  children,
  onSelectUserDashboard,
}: DashboardSelectorProps) => {
  const router = useRouter();
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    null
  );
  const [showUserDashboard, setShowUserDashboard] = useState(false);

  const setPreferredDashboard = (dashboard: string) => {
    setSelectedDashboard(dashboard);
    localStorage.setItem('preferredDashboard', dashboard);
    if (dashboard === '/dashboard') {
      setShowUserDashboard(true);
      onSelectUserDashboard();
    } else {
      setTimeout(() => router.push(dashboard), 500); // Delay for animation
    }
  };

  if (showUserDashboard) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 dark:from-gray-900 dark:to-gray-800'
    >
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold text-gray-800 dark:text-gray-200'>
            Select Your Dashboard
          </CardTitle>
          <CardDescription className='text-center text-gray-600 dark:text-gray-400'>
            Choose which dashboard you&apos;d like to use as your default
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button
            variant='outline'
            className={`w-full justify-between text-left hover:bg-primary/10 ${
              selectedDashboard === '/dashboard/admin' ? 'border-primary' : ''
            }`}
            onClick={() => setPreferredDashboard('/dashboard/admin')}
          >
            <div className='flex items-center space-x-3'>
              <Laptop className='h-5 w-5 text-primary' />
              <span>Admin Dashboard</span>
            </div>
            <ChevronRight
              className={`h-5 w-5 transition-transform ${
                selectedDashboard === '/dashboard/admin' ? 'rotate-90' : ''
              }`}
            />
          </Button>
          <Button
            variant='outline'
            className={`w-full justify-between text-left hover:bg-primary/10 ${
              selectedDashboard === '/dashboard' ? 'border-primary' : ''
            }`}
            onClick={() => setPreferredDashboard('/dashboard')}
          >
            <div className='flex items-center space-x-3'>
              <User className='h-5 w-5 text-primary' />
              <span>User Dashboard</span>
            </div>
            <ChevronRight
              className={`h-5 w-5 transition-transform ${
                selectedDashboard === '/dashboard' ? 'rotate-90' : ''
              }`}
            />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardSelector;
