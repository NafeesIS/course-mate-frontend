import { format } from 'date-fns';
import { Clock, Info, Mail } from 'lucide-react';
import { memo, useMemo } from 'react';

interface InfoTooltipProps {
  latestEmailDates: { llp: string | null; company: string | null };
}

// Memoized static footer content
const FooterNotes = memo(() => (
  <div className='space-y-1 border-t border-gray-100 pt-2'>
    <p className='text-[10px] text-gray-600'>
      * Today&apos;s emails contain data from the previous day
    </p>
    <p className='text-[10px] text-gray-600'>
      * All times are in Indian Standard Time (IST)
    </p>
  </div>
));
FooterNotes.displayName = 'FooterNotes';

// Memoized static delivery schedule content
const DeliverySchedule = memo(() => (
  <div className='space-y-3'>
    <div className='flex items-center gap-2'>
      <div className='flex size-5 items-center justify-center rounded-lg bg-blue-100'>
        <Clock className='size-3 text-blue-600' />
      </div>
      <h4 className='font-semibold text-gray-900'>Email Delivery Schedule</h4>
    </div>
    <div className='ml-7 space-y-2'>
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0'>-</div>
        <p className='text-gray-700'>
          <span className='font-medium'>LLP emails</span> are sent every morning
          by <span className='font-semibold text-gray-900'>7:00 AM</span>
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0'>-</div>
        <p className='text-gray-700'>
          <span className='font-medium'>Company emails</span> are sent every
          morning by{' '}
          <span className='font-semibold text-gray-900'>11:00 AM</span>
        </p>
      </div>
    </div>
  </div>
));
DeliverySchedule.displayName = 'DeliverySchedule';

// Memoized InfoTooltip component
const InfoTooltip = memo(({ latestEmailDates }: InfoTooltipProps) => {
  // Memoize the formatted dates
  const formattedDates = useMemo(() => {
    return {
      llp: latestEmailDates.llp
        ? format(new Date(latestEmailDates.llp), 'dd MMMM yyyy, h:mm a')
        : null,
      company: latestEmailDates.company
        ? format(new Date(latestEmailDates.company), 'dd MMMM yyyy, h:mm a')
        : null,
    };
  }, [latestEmailDates]);

  return (
    <div className='group relative'>
      <button className='flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
        <Info className='size-4' />
      </button>
      <div className='absolute -right-3 top-10 z-50 hidden w-80 group-hover:block md:w-96'>
        <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-xl ring-1 ring-black/5'>
          {/* Tooltip arrow */}
          <div className='absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-gray-200 bg-white'></div>

          <div className='space-y-3 text-xs'>
            {/* Delivery Schedule */}
            <DeliverySchedule />

            {/* Last Email Delivered */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='flex size-5 items-center justify-center rounded-lg bg-green-100'>
                  <Mail className='size-3 text-green-600' />
                </div>
                <h4 className='font-semibold text-gray-700'>
                  Last Email Delivered
                </h4>
              </div>
              <div className='ml-7 space-y-2'>
                <div className='flex items-center gap-3'>
                  <div className='flex-shrink-0'>-</div>
                  <p className='text-gray-700'>
                    <span className='font-medium'>LLP emails:</span>{' '}
                    <span className='font-normal text-gray-700'>
                      {formattedDates.llp ?? 'No recent deliveries'}
                    </span>
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex-shrink-0'>-</div>
                  <p className='text-gray-700'>
                    <span className='font-medium'>Company emails:</span>{' '}
                    <span className='font-normal text-gray-700'>
                      {formattedDates.company ?? 'No recent deliveries'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <FooterNotes />
          </div>
        </div>
      </div>
    </div>
  );
});

InfoTooltip.displayName = 'InfoTooltip';

export default InfoTooltip;
