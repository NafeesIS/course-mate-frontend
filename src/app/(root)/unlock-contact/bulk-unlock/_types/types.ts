export type TUnlockOption = {
  credits: number;
  price: number;
  currency: string;
};

export type TUnlockOptions = {
  singleUnlock: TUnlockOption;
  bulkUnlock: TUnlockOption[];
};
