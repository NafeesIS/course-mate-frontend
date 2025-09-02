import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toCamelCase } from '@/lib/formatters';
import { IBillingDetails } from '@/store/userStoreTypes';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import React from 'react';
import { useBillingStore } from '../_store/billingStore';

interface BillingInfoListProps {
  billingInfoList: IBillingDetails[];
  // eslint-disable-next-line no-unused-vars
  onSelect: (info: IBillingDetails) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void;
}

const BillingInfoList: React.FC<BillingInfoListProps> = ({
  billingInfoList,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const { billingInfo } = useBillingStore();
  return (
    <AnimatePresence>
      {billingInfoList.length === 0 ? (
        <p className='text-sm text-gray-600'>
          No billing information available. Please add your billing details.
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='space-y-6'
        >
          {billingInfoList.map((info: IBillingDetails, index: number) => (
            <motion.div
              key={info._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelect(info)}
              className={`group relative cursor-pointer rounded-lg border p-4 pl-12 shadow-sm transition-all duration-300 hover:shadow-md md:pl-16 ${
                billingInfo._id === info._id
                  ? 'border-primary bg-sky-100'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className='absolute left-4 top-4 md:left-6 md:top-6'>
                <Checkbox
                  checked={billingInfo._id === info._id}
                  onCheckedChange={() => onSelect(info)}
                />
              </div>
              <div className='flex justify-between'>
                <div className='-mt-2 flex items-center gap-2 md:mt-0'>
                  <p className='inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-primary-foreground'>
                    {info.billingType.length > 0
                      ? toCamelCase(info.billingType)
                      : '-'}
                  </p>
                  {info.isDefault && (
                    <span className='inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'>
                      Default
                    </span>
                  )}
                </div>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEdit(index)}
                    className='h-8 w-8 p-0 hover:shadow-xl'
                    aria-label='Edit'
                  >
                    <Edit3 size={16} />
                  </Button>

                  {billingInfoList.length > 1 && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onDelete(info._id ?? '')}
                      className='z-10 h-8 w-8 p-0 hover:shadow-xl'
                      aria-label='Delete'
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
              <div className='mt-2 grid gap-2 text-xs text-gray-600 md:text-sm'>
                <p className='text-base font-medium text-gray-900 md:text-lg'>
                  {info.firstName} {info.lastName}
                </p>
                <p>{info.email}</p>
                <p>+{info.mobileNumber}</p>
                <p>
                  {[
                    info.address,
                    info.city,
                    info.state,
                    info.zipCode,
                    info.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BillingInfoList;
