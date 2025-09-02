'use client';

import React from 'react';
import { TCartItem } from '../_store/cartStore';
import BulkCompanyUnlockCreditCartItem from './BulkCompanyUnlockCreditCartItem';
import SingleCompanyUnlockCartItem from './SingleCompanyUnlockCartItem';
import VpdUnlockCartItem from './VpdUnlockCartItem';

interface UnlockCompanyCartItemProps {
  item: TCartItem;
  index: number;
  // eslint-disable-next-line no-unused-vars
  addItem: (item: TCartItem) => void;
  // eslint-disable-next-line no-unused-vars
  removeItem: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  updateItem: (index: number, updatedItem: TCartItem) => void;
}

const UnlockCompanyCartItem: React.FC<UnlockCompanyCartItemProps> = ({
  item,
  index,
  addItem,
  removeItem,
  updateItem,
}) => {
  const isSingleUnlock =
    item.customAttributes?.companyId &&
    item.customAttributes?.companyName &&
    item.selectedPricing.credits === 1;

  if (isSingleUnlock) {
    if (item.serviceType === 'companyUnlock') {
      return (
        <SingleCompanyUnlockCartItem
          item={item}
          index={index}
          removeItem={removeItem}
        />
      );
    } else if (item.serviceType === 'vpdUnlock') {
      return (
        <VpdUnlockCartItem
          index={index}
          item={item}
          addItem={addItem}
          removeItem={removeItem}
        />
      );
    }
    // TODO: else show empty cart of update cart
    return null;
  } else {
    return (
      <BulkCompanyUnlockCreditCartItem
        item={item}
        index={index}
        removeItem={removeItem}
        updateItem={updateItem}
      />
    );
  }
};

export default UnlockCompanyCartItem;
