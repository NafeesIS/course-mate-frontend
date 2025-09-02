/* eslint-disable indent */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TCartItem } from '../_store/cartStore';
import BulkUnlockCartItem from './BulkUnlockCartItem';
import UnlockCompanyCartItem from './UnlockCompanyCartItem';

interface CartItemsDetailsProps {
  cartItems: TCartItem[];
  // eslint-disable-next-line no-unused-vars
  addItem: (item: TCartItem) => void;
  // eslint-disable-next-line no-unused-vars
  removeItem: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateItem: (index: number, updatedItem: TCartItem) => void;
}

const CartItemsDetails: React.FC<CartItemsDetailsProps> = ({
  cartItems,
  addItem,
  removeItem,
  updateItem,
}) => {
  return (
    <Card className='bg-white shadow-sm'>
      <CardContent className='p-4 sm:p-6'>
        {cartItems.length === 0 ? (
          <p className='py-8 text-center text-gray-500'>Your cart is empty.</p>
        ) : (
          <div className='space-y-6'>
            {cartItems.map((item, index) => (
              <div key={index}>
                {item.serviceName &&
                  item.serviceName.includes('Bulk Unlock') && (
                    <BulkUnlockCartItem
                      index={index}
                      item={item}
                      removeItem={removeItem}
                      updateItem={updateItem}
                    />
                  )}

                {item.serviceType &&
                  (item.serviceType === 'companyUnlock' ||
                    item.serviceType === 'vpdUnlock') && (
                    <UnlockCompanyCartItem
                      index={index}
                      item={item}
                      addItem={addItem}
                      removeItem={removeItem}
                      updateItem={updateItem}
                    />
                  )}

                {index < cartItems.length - 1 && <Separator className='mt-6' />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartItemsDetails;
