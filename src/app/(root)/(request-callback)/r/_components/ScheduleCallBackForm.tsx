/* eslint-disable camelcase */
'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BASE_URL_BACKEND } from '@/constants';
import { cn } from '@/lib/utils';
import {
  addDays,
  format,
  isAfter,
  isSaturday,
  isSunday,
  setHours,
  setMinutes,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { CalendarIcon, Clock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'sonner';

type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
  date: Date | undefined;
  time: string | undefined;
};

interface LeadData {
  name: string;
  email: string;
  mobile: string;
  cin: string;
  company: string;
  incorpDate: string;
  filingDueDate: string;
  inc20aStatus: string;
  lateFee: string;
  filingStatus: string;
}

interface ScheduleCallBackFormProps {
  leadData: LeadData | null;
}

export default function ScheduleCallBackForm({
  leadData,
}: ScheduleCallBackFormProps) {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State for success modal
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const [isRedirecting, setIsRedirecting] = useState(false); // State to show redirection message
  const router = useRouter(); // Router instance to handle redirection

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      date: undefined,
      time: undefined,
    },
  });

  const selectedDate = watch('date');

  useEffect(() => {
    if (leadData) {
      setValue('name', leadData.name);
      setValue('email', leadData.email);
      setValue('phoneNumber', leadData.mobile);
    }
  }, [leadData, setValue]);

  useEffect(() => {
    const today = new Date();
    const dates = [];
    const isAfterSixPM = today.getHours() >= 18; // Check if the current time is after 6 PM
    const startDay = isAfterSixPM ? 1 : 0; // If it's after 6 PM, we start counting from the next day
    for (let i = startDay; i <= 5; i++) {
      const date = addDays(today, i);
      if (!isSaturday(date) && !isSunday(date)) {
        dates.push(date);
      }
      if (dates.length === 3) break; // Limit to 3 available dates
    }
    setAvailableDates(dates);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const times = [];
      const now = new Date();
      const startHour =
        selectedDate.getDate() === now.getDate()
          ? Math.max(now.getHours(), 10)
          : 10;
      for (let hour = startHour; hour < 18; hour++) {
        const time = setMinutes(setHours(selectedDate, hour), 0);
        if (isAfter(time, now)) {
          times.push(format(time, 'h:mm a'));
        }
      }
      setAvailableTimes(times);
    }
  }, [selectedDate]);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsRedirecting(true); // Show the redirection message
    setTimeout(() => {
      router.push('/'); // Redirect to the homepage after a delay
    }, 3000); // 5-second delay for the redirection
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (!data.date || !data.time) {
        throw new Error('Date and time must be selected');
      }

      const timeParts = data.time.split(' ');
      const [time, modifier] = timeParts;
      // eslint-disable-next-line prefer-const
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }
      const dateWithTime = setMinutes(setHours(data.date, hours), minutes);
      const istDateTime = toZonedTime(dateWithTime, 'Asia/Kolkata');
      const formattedDateTime = format(istDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX");

      const response = await fetch(
        `${BASE_URL_BACKEND}/api/v1/crm/schedule-call`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: data.phoneNumber,
            Call_Start_Time: formattedDateTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to schedule call back');
      }

      toast.success('Call back scheduled successfully!');

      setSubmittedData(data); // Store the submitted data for display in the modal
      setIsModalOpen(true); // Open the modal on success
      reset(); // Reset the form after successful submission
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error scheduling call back:', error);
      toast.error('Failed to schedule call back. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className='w-full shadow-lg'>
        <CardHeader>
          <CardTitle className='text-center text-lg font-bold md:text-2xl'>
            Schedule a Call Back
          </CardTitle>
          <p className='text-center text-sm text-muted-foreground md:text-base'>
            Just choose a date and time for the call, and we&apos;ll take care
            of the rest.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-xs font-medium md:text-sm'>
                Email
              </Label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <div className='relative'>
                    <Mail
                      className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400'
                      size={18}
                    />
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      placeholder='john@example.com'
                      className='pl-10'
                      disabled
                    />
                  </div>
                )}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='phoneNumber'
                className='text-xs font-medium md:text-sm'
              >
                Phone Number
              </Label>
              <Controller
                name='phoneNumber'
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country='in'
                    value={getValues('phoneNumber')}
                    inputProps={{
                      name: 'phoneNumber',
                      required: true,
                      autoFocus: true,
                    }}
                    containerClass={cn('mt-1 w-full')}
                    inputStyle={{
                      width: '100%',
                      height: '40px',
                      fontSize: '16px',
                      opacity: '0.5',
                      paddingLeft: '48px',
                      borderRadius: '0.375rem',
                      border: '1px solid rgb(209 213 219)',
                    }}
                    buttonStyle={{
                      borderRadius: '0.375rem 0 0 0.375rem',
                      border: '1px solid rgb(209 213 219)',
                    }}
                    dropdownStyle={{
                      width: '300px',
                    }}
                    disabled
                  />
                )}
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-xs font-medium md:text-sm'>
                Preferred Date
              </Label>
              <Controller
                name='date'
                control={control}
                rules={{ required: 'Please select a date' }}
                render={({ field }) => (
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value
                          ? format(field.value, 'PPP')
                          : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) =>
                          !availableDates.some(
                            (d) => d.toDateString() === date.toDateString()
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className='mt-1 text-xs text-red-500 md:text-sm'>
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='time' className='text-xs font-medium md:text-sm'>
                Preferred Time
              </Label>
              <Controller
                name='time'
                control={control}
                rules={{ required: 'Please select a time' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='w-full text-muted-foreground hover:text-foreground'>
                      <SelectValue placeholder='Select a time' />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time, index) => {
                        const nextTime = availableTimes[index + 1] || '6:00 PM';
                        return (
                          <SelectItem key={time} value={time}>
                            <div className='flex items-center'>
                              <Clock className='mr-2 h-4 w-4' />{' '}
                              {`${time} - ${nextTime}`}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.time && (
                <p className='mt-1 text-xs text-red-500 md:text-sm'>
                  {errors.time.message}
                </p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Call'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call Scheduled Successfully!</DialogTitle>
            <DialogDescription className='pt-2'>
              Thank you, {submittedData?.name}. Your call has been successfully
              scheduled.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-2 rounded-lg border bg-muted p-3'>
            <p>
              <strong>Name:</strong> {submittedData?.name}
            </p>
            <p>
              <strong>Email:</strong> {submittedData?.email}
            </p>
            <p>
              <strong>Phone:</strong> {submittedData?.phoneNumber}
            </p>
            <p>
              <strong>Scheduled Date:</strong>{' '}
              {submittedData?.date ? format(submittedData.date, 'PPP') : ''}
            </p>
            <p>
              <strong>Scheduled Time:</strong> {submittedData?.time}
            </p>
          </div>
          <Button onClick={closeModal} className='mt-4'>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Redirection Message */}
      {isRedirecting && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90'>
          <div className='text-center'>
            <h2 className='flex items-center gap-2 text-base font-semibold md:text-xl'>
              <span
                className='text-surface inline-block size-5 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white md:size-7 md:border-4'
                role='status'
              >
                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                  Loading...
                </span>
              </span>
              Redirecting you to our homepage...
            </h2>
            <p className='animate-pulse text-muted-foreground'>
              Please wait a moment
            </p>
          </div>
        </div>
      )}
    </>
  );
}
