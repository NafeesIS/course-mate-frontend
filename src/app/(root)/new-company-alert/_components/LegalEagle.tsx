import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export const LegalEagle = () => (
  <div className='mt-8'>
    <Card className='border-t-4 border-t-yellow-500'>
      <CardHeader className='flex flex-row items-center space-y-0 bg-yellow-50'>
        <Calculator className='mr-2 h-5 w-5 text-yellow-500' />
        <CardTitle className='text-sm font-semibold text-yellow-700 md:text-base'>
          ROI Calculator Disclaimer: Numbers Don&apos;t Lie, But They Do
          Daydream
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4 text-xs text-gray-600 md:text-sm'>
        <p>
          This ROI Calculator is designed to provide estimates based on the
          information you input and some assumptions we&apos;ve made. While
          we&apos;ve done our best to make it accurate, please remember:
        </p>
        <ul className='mt-2 list-disc space-y-1 pl-5'>
          <li>
            The future is unpredictable. Market conditions, competition, and
            other factors can impact actual results.
          </li>
          <li>
            This tool uses hypothetical scenarios that may not reflect
            real-world complexity.
          </li>
          <li>
            Your actual ROI may vary significantly from these projections.
          </li>
          <li>
            This calculator is for informational purposes only and should not be
            considered as financial advice.
          </li>
        </ul>
        <p className='mt-2'>
          We recommend using this as a starting point for discussions with
          qualified professionals before making any significant business
          decisions. Remember, in business, as in life, your mileage may vary!
        </p>
      </CardContent>
    </Card>
  </div>
);
