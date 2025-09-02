'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface PromoCodeProps {
  // eslint-disable-next-line no-unused-vars
  onApply: (code: string) => Promise<{
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  }>;
}

export default function PromoInputField({ onApply }: PromoCodeProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promoInfo, setPromoInfo] = useState<{
    type: 'percentage' | 'flat';
    value: number;
    discount: number;
  } | null>(null);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await onApply(code);
      setPromoInfo(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid promo code');
      setPromoInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setPromoInfo(null);
    setError('');
  };

  if (promoInfo) {
    return (
      <div className='flex w-full max-w-md items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Check className='h-5 w-5 text-emerald-600' />
          <div>
            <p className='font-medium text-emerald-900'>{code}</p>
            <p className='text-sm text-emerald-600'>
              {promoInfo.type === 'percentage'
                ? `${promoInfo.value}% discount`
                : `₹${promoInfo.value} off`}
              {` (-₹${promoInfo.discount})`}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className='text-emerald-700 hover:text-emerald-900'
        >
          <X className='h-5 w-5' />
          <span className='sr-only'>Remove promo code</span>
        </button>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md space-y-2'>
      <div className='flex gap-2'>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder='Enter promo code'
          className='rounded-lg border-2 text-lg font-medium tracking-wide placeholder:text-gray-400'
        />
        <Button
          onClick={handleApply}
          disabled={!code || isLoading}
          className='bg-blue-600 text-primary-foreground hover:bg-blue-700'
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
