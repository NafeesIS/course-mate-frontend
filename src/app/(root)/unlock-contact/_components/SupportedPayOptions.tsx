import { cn } from '@/lib/utils';
import Image from 'next/image';
import AirtelMoneyImg from '../../../../../public/assets/payment-methods/airtelmoney.png';
import AmazonPayImg from '../../../../../public/assets/payment-methods/amazonpay.png';
import AmexImg from '../../../../../public/assets/payment-methods/amex.svg';
import EarlySalaryImg from '../../../../../public/assets/payment-methods/earlysalary.png';
import FreechargeImg from '../../../../../public/assets/payment-methods/freecharge.png';
import InstacredImg from '../../../../../public/assets/payment-methods/instacred.png';
import NetBankingImg from '../../../../../public/assets/payment-methods/internet-banking.png';
import JioMoneyImg from '../../../../../public/assets/payment-methods/jiomoney.png';
import MasterCardImg from '../../../../../public/assets/payment-methods/masterCard.png';
import MobiKwikImg from '../../../../../public/assets/payment-methods/mobikwik.png';
import OlamoneyImg from '../../../../../public/assets/payment-methods/olamoney.png';
import PaypalImg from '../../../../../public/assets/payment-methods/paypal.svg';
import RupayImg from '../../../../../public/assets/payment-methods/rupay.png';
import UpiImg from '../../../../../public/assets/payment-methods/upi.png';
import VisaImg from '../../../../../public/assets/payment-methods/visa.png';

const paymentOptions = [
  { img: UpiImg, name: 'UPI' },
  { img: VisaImg, name: 'Visa' },
  { img: MasterCardImg, name: 'MasterCard' },
  { img: AmexImg, name: 'Amex' },
  { img: RupayImg, name: 'Rupay' },
  { img: NetBankingImg, name: 'Net Banking', span: 2 },
  { img: AmazonPayImg, name: 'Amazon Pay' },
  { img: AirtelMoneyImg, name: 'Airtel Money' },
  { img: JioMoneyImg, name: 'Jio Money' },
  { img: MobiKwikImg, name: 'MobiKwik' },
  { img: OlamoneyImg, name: 'Ola Money' },
  { img: PaypalImg, name: 'PayPal' },
  { img: EarlySalaryImg, name: 'Early Salary' },
  { img: FreechargeImg, name: 'Freecharge' },
  { img: InstacredImg, name: 'Instacred' },
];

const SupportedPayOptions = ({ className }: { className?: string }) => {
  return (
    <div className='relative mt-8 rounded-lg border bg-background px-4 py-2 md:px-8 md:py-4'>
      <h2 className='absolute -top-2 left-1/2  translate-x-[-50%] whitespace-nowrap bg-background px-3 text-center text-[10px] font-semibold text-muted-foreground md:text-xs'>
        Accepting All Payment Options
      </h2>
      <div
        className={cn(
          'mt-4 grid grid-cols-8 justify-items-center gap-4 md:grid-cols-8 xl:grid-cols-16',
          className
        )}
      >
        {paymentOptions.map((option, index) => (
          <div key={index} className={cn(option.span ? `col-span-2` : '')}>
            <Image
              src={option.img}
              alt={option.name}
              title={option.name}
              width={160}
              height={80}
              className='h-8 w-auto object-contain'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportedPayOptions;
