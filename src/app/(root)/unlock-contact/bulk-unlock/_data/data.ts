import { CreditCard, Users, Zap } from 'lucide-react';

export const unlockDirectorContactPlans = {
  singleUnlock: {
    title: 'Single Unlock',
    description: "Ideal for one-time access to a director's contact details",
    price: 399,
    credits: 1,
    features: [
      "1 Credit = 1 Director's Contact Details",
      "Includes Director's Mobile Number and Email Address",
      'Search Directors by DIN, Name, etc.',
    ],
    icon: CreditCard,
  },
  bulkUnlock: {
    title: 'Bulk Unlock',
    description: 'Choose from our pre-set bulk options',
    options: [
      { credits: 10, price: 350 },
      { credits: 20, price: 250 },
      { credits: 30, price: 200 },
      { credits: 50, price: 150 },
      { credits: 100, price: 100 },
    ],
    features: [
      'Flexible credit options',
      'Lower price per contact with higher volume',
      'Access to all standard features',
    ],
    icon: Users,
  },
  enterprise: {
    title: 'Enterprise',
    description: 'Tailored solutions for large-scale needs',
    price: null,
    credits: null,
    features: [
      'Custom credit packages',
      'Dedicated account manager',
      'API access for seamless integration',
      'Priority support',
    ],
    icon: Zap,
  },
};
