'use client';

import { usePricingStore } from '@/store/pricingStore';
import { useUserSignInDetails } from '@/store/userStore';
import NCACartStepsWrapper from './_components/NCACartStepsWrapper';

const NCASubscriptionCartPage = () => {
  // user store
  const { userSignInDetails, userSignInDetailsLoading } =
    useUserSignInDetails();
  const { serviceCatalogFromDB, serviceCatalogFromDBPending } =
    usePricingStore();

  if (
    (userSignInDetailsLoading && !userSignInDetails) ||
    (serviceCatalogFromDBPending && !serviceCatalogFromDB)
  ) {
    return (
      <div className='wrapper mx-auto flex min-h-[90vh] flex-col items-center justify-center gap-6 pb-16 pt-8 md:pt-10'>
        <div className='loader-spinner-custom'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className='wrapper mx-auto pb-16 pt-8 md:pt-10'>
      {/* STEPS WRAPPER */}
      {userSignInDetails && (
        <NCACartStepsWrapper userSignInDetails={userSignInDetails} />
      )}
    </div>
  );
};

export default NCASubscriptionCartPage;
