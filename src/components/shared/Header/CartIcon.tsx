/* eslint-disable no-unused-vars */

'use client';

import { useCartStore } from '@/app/(root)/cart/_store/cartStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';

// Memoized cart item component for Bulk Unlock
const BulkUnlockCartItem = memo(
  ({ item, onRemove }: { item: any; onRemove: () => void }) => {
    const credits = item.selectedPricing.credits;
    const pricePerCredit = item.selectedPricing.price;
    const totalPrice = credits * pricePerCredit;

    return (
      <div className='group flex items-center justify-between rounded-lg border border-black/10 bg-black/5 p-3 transition-all duration-300 hover:bg-black/10'>
        <div className='space-y-1'>
          <p className='text-xs font-medium text-black'>{item.serviceName}</p>
          <div className='space-y-0.5'>
            <p className='text-xs text-black/60'>
              {credits} credits ×{' '}
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: item.currency || 'INR',
              }).format(pricePerCredit)}
            </p>
            {credits > 1 && (
              <p className='text-[10px] text-black/60'>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: item.currency || 'INR',
                }).format(pricePerCredit)}{' '}
                per credit
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium text-black'>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: item.currency || 'INR',
            }).format(totalPrice)}
          </p>
          <Button
            variant='ghost'
            size='icon'
            className='size-6 rounded-full bg-gray-300 text-gray-900 hover:bg-red-500/10 hover:text-red-500'
            onClick={onRemove}
          >
            <Trash2 className='size-3' />
          </Button>
        </div>
      </div>
    );
  }
);

BulkUnlockCartItem.displayName = 'BulkUnlockCartItem';

// Memoized cart item component for Company Unlock
const CompanyUnlockCartItem = memo(
  ({ item, onRemove }: { item: any; onRemove: () => void }) => {
    const credits = item.selectedPricing.credits;
    const pricePerCredit = item.selectedPricing.price;
    const totalPrice = credits * pricePerCredit;

    return (
      <div className='group flex items-center justify-between rounded-lg border border-black/10 bg-black/5 p-3 transition-all duration-300 hover:bg-black/10'>
        <div className='space-y-1'>
          <p className='text-xs font-medium text-black'>
            {item.serviceName.includes('Company Data')
              ? 'Complete Company Report for'
              : item.serviceName}
          </p>
          <div className='space-y-0.5'>
            <p className='text-xs text-black/60'>
              {item.customAttributes?.companyName || ''}
            </p>
            {credits > 1 && (
              <>
                <p className='text-xs text-black/60'>
                  {credits} credits ×{' '}
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: item.currency || 'INR',
                  }).format(pricePerCredit)}
                </p>
                <p className='text-[10px] text-black/60'>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: item.currency || 'INR',
                  }).format(pricePerCredit)}{' '}
                  per credit
                </p>
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium text-black'>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: item.currency || 'INR',
            }).format(totalPrice)}
          </p>
          <Button
            variant='ghost'
            size='icon'
            className='size-6 rounded-full bg-gray-300 text-gray-900 hover:bg-red-500/10 hover:text-red-500'
            onClick={onRemove}
          >
            <Trash2 className='size-3' />
          </Button>
        </div>
      </div>
    );
  }
);

CompanyUnlockCartItem.displayName = 'CompanyUnlockCartItem';

// Memoized cart content component
const CartContent = memo(
  ({
    items,
    totalPrice,
    onRemove,
    onClose,
  }: {
    items: any[];
    totalPrice: number;
    onRemove: (index: number) => void;
    onClose: () => void;
  }) => {
    const router = useRouter();

    const handleViewCart = () => {
      onClose(); // Close the dropdown
      router.push('/cart'); // Navigate to cart page
    };

    return (
      <>
        <div className='max-h-60 space-y-2 overflow-y-auto p-4'>
          {items.map((item, index) => {
            if (item.serviceType === 'directorUnlock') {
              return (
                <BulkUnlockCartItem
                  key={`${item.serviceId}-${index}`}
                  item={item}
                  onRemove={() => onRemove(index)}
                />
              );
            } else if (
              item.serviceType === 'companyUnlock' ||
              item.serviceType === 'vpdUnlock'
            ) {
              return (
                <CompanyUnlockCartItem
                  key={`${item.serviceId}-${item.customAttributes?.companyId}`}
                  item={item}
                  onRemove={() => onRemove(index)}
                />
              );
            }
            return null;
          })}
        </div>
        <div className='border-t border-black/10 p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <span className='text-sm font-medium text-black/80'>Total</span>
            <span className='text-lg font-semibold text-black'>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: items[0]?.currency || 'INR',
              }).format(totalPrice)}
            </span>
          </div>
          <Button
            size='sm'
            variant='gooeyLeft'
            className='w-full border bg-green-600 text-gray-50'
            onClick={handleViewCart}
          >
            View Cart
          </Button>
        </div>
      </>
    );
  }
);

CartContent.displayName = 'CartContent';

const CartIcon = memo(() => {
  const { items, removeItem } = useCartStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousItemsCount, setPreviousItemsCount] = useState(items.length);
  const [open, setOpen] = useState(false);

  // Memoize the remove handler
  const handleRemove = useCallback(
    (index: number) => {
      removeItem(index);
    },
    [removeItem]
  );

  // Handle animation when items are added
  useEffect(() => {
    if (items.length > previousItemsCount || items.length > 0) {
      setIsAnimating(true);
      setPreviousItemsCount(items.length);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [items.length, previousItemsCount]);

  const totalItems = items.length;
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + item.selectedPricing.price * (item.selectedPricing.credits || 1),
    0
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label='Shopping Cart'
          className={cn(
            'group relative rounded-full p-2 text-white transition-all duration-300 ease-in-out hover:bg-white/10'
          )}
        >
          <ShoppingCart className='size-5 transition-transform duration-300 group-hover:scale-110' />
          {totalItems > 0 && (
            <span
              className={cn(
                'absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110',
                isAnimating && 'animate-cart-bounce'
              )}
            >
              {totalItems}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-[100vw] rounded-lg border bg-white/95 p-0 text-black drop-shadow-2xl backdrop-blur-sm sm:w-96'
        sideOffset={8}
      >
        {totalItems === 0 ? (
          <DropdownMenuItem className='flex flex-col items-center gap-3 py-6'>
            <div className='rounded-full bg-white/5 p-3'>
              <ShoppingCart className='h-8 w-8 text-black/60' />
            </div>
            <p className='text-sm font-medium text-black/60'>
              Your cart is empty
            </p>
          </DropdownMenuItem>
        ) : (
          <CartContent
            items={items}
            totalPrice={totalPrice}
            onRemove={handleRemove}
            onClose={() => setOpen(false)}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

CartIcon.displayName = 'CartIcon';

export default CartIcon;
