'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toCamelCase } from '@/lib/formatters';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Building, CheckCircle, Coins, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function DashboardSuccessPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  const unlockDirectorCredits = searchParams.get('unlockDirectorCredits');
  const unlockCompanyCredits = searchParams.get('unlockCompanyCredits');
  const companyId = searchParams.get('companyId');
  const companyName = searchParams.get('companyName');

  const handleClose = () => {
    setIsOpen(false);
    router.push('/dashboard', { scroll: false });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className='sm:max-w-[500px]'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className='flex items-center gap-3 text-3xl font-bold text-green-600'>
                  <CheckCircle className='h-8 w-8 text-green-500' />
                  Purchase Successful!
                </DialogTitle>
              </DialogHeader>
              <div className='mt-6 space-y-6'>
                {unlockCompanyCredits && !companyId && !companyName && (
                  <CompanyCreditsSection credits={unlockCompanyCredits} />
                )}
                {unlockCompanyCredits && companyId && companyName && (
                  <CompanyUnlockSection
                    credits={unlockCompanyCredits}
                    companyId={companyId}
                    companyName={companyName}
                  />
                )}
                {unlockDirectorCredits && (
                  <DirectorUnlockSection credits={unlockDirectorCredits} />
                )}
              </div>
              <div className='mt-8 flex justify-end'>
                <Button
                  onClick={handleClose}
                  className='bg-green-600 hover:bg-green-700'
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

function DirectorUnlockSection({ credits }: { credits: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className='rounded-lg border bg-gradient-to-br from-blue-100 to-blue-200 p-6 shadow-lg'
    >
      <h3 className='flex items-center gap-3 text-xl font-semibold text-blue-800'>
        <Users className='h-6 w-6 text-blue-600' />
        Director Unlock Credits
      </h3>
      <p className='mt-3 text-base text-blue-700'>
        You have successfully purchased{' '}
        <span className='font-bold text-blue-900'>{credits} credit(s)</span> for
        unlocking director contacts.
      </p>
      <Button asChild className='mt-4 bg-blue-600 hover:bg-blue-700' size='lg'>
        <Link href='/dashboard/director-contacts' className='flex items-center'>
          Unlock Director Contacts
          <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    </motion.div>
  );
}

function CompanyCreditsSection({ credits }: { credits: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className='rounded-lg border bg-gradient-to-br from-purple-100 to-purple-200 p-6 shadow-lg'
    >
      <h3 className='flex items-center gap-3 text-xl font-semibold text-purple-800'>
        <Coins className='h-6 w-6 text-purple-600' />
        Company Unlock Credits
      </h3>
      <p className='mt-3 text-base text-purple-700'>
        You have successfully purchased{' '}
        <span className='font-bold text-purple-900'>{credits} credit(s)</span>{' '}
        for unlocking company data.
      </p>
      <Button
        asChild
        className='mt-4 bg-purple-600 hover:bg-purple-700'
        size='lg'
      >
        <Link
          href='/dashboard/unlock-companies'
          prefetch={false}
          className='flex items-center'
        >
          View Available Companies
          <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    </motion.div>
  );
}

function CompanyUnlockSection({
  //   credits,
  companyId,
  companyName,
}: {
  credits: string;
  companyId: string;
  companyName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className='rounded-lg border bg-gradient-to-br from-green-100 to-green-200 p-6 shadow-lg'
    >
      <h3 className='flex items-center gap-3 text-xl font-semibold text-green-800'>
        <Building className='h-6 w-6 text-green-600' />
        Company Unlocked
      </h3>
      <p className='mt-3 text-base text-green-700'>
        You have successfully unlocked data for{' '}
        <span className='font-bold text-green-900'>
          {companyName && companyName.length > 0
            ? toCamelCase(decodeURIComponent(companyName).split('-').join(' '))
            : '-'}
        </span>
      </p>
      <Button
        asChild
        className='mt-4 bg-green-600 hover:bg-green-700'
        size='lg'
      >
        <Link
          href={`/dashboard/unlock-companies/company-details/${companyName}/${companyId}`}
          className='flex items-center'
        >
          View Company Data
          <ArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    </motion.div>
  );
}
