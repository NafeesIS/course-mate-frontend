import { BASE_URL_FRONTEND } from '@/constants';
import Link from 'next/link';

const PolicyDisclaimerText = () => {
  return (
    <p className='mt-2 text-left text-[10px] sm:text-xs'>
      By Submitting the form, I agree to the{' '}
      <Link
        className='text-primary duration-75 hover:underline'
        href={`${BASE_URL_FRONTEND}/privacy-policy`}
        target='_blank'
      >
        Privacy Policy
      </Link>{' '}
      and{' '}
      <Link
        className='text-primary duration-75 hover:underline'
        href={`${BASE_URL_FRONTEND}/terms-and-conditions`}
        target='_blank'
      >
        Terms & Conditions
      </Link>
    </p>
  );
};

export default PolicyDisclaimerText;
