'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BASE_URL_BACKEND, BASE_URL_FRONTEND } from '@/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { z } from 'zod';

interface LeadFormProps {
  source: string;
  className?: string;
  serviceTypes: string[];
  onSuccessfulSubmission?: () => void;
}

// Zod schema WITHOUT checkbox field
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactNo: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  sources: z.array(z.string()).min(1, 'Source is required'),
  pathname: z.string().min(1, 'Pathname is required'),
});

type FormData = z.infer<typeof formSchema>;

interface ErrorResponse {
  message: string;
  errorSources?: { path: string; message: string }[];
}

const saveLead = async (leadData: FormData): Promise<any> => {
  const response = await axios.post(
    `${BASE_URL_BACKEND}/api/v1/leads/addLead`,
    leadData
  );
  return response.data;
};

export function FinancialDataLeadForm({
  source,
  className,
  serviceTypes,
  onSuccessfulSubmission,
}: LeadFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for dummy checkbox
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactNo: '',
      email: '',
      sources: [source],
      pathname: typeof window !== 'undefined' ? window.location.href : '',
    },
    mode: 'onChange',
  });

  const mutation = useMutation<any, AxiosError<ErrorResponse>, FormData>({
    mutationFn: saveLead,
    onSuccess: () => {
      setModalMessage(
        'Thank you for your interest! Our expert will contact you shortly to discuss your financial needs.'
      );
      setIsModalOpen(true);
      setIsError(false);
      setIsSubmitting(false);
      setShowCheckboxError(false);
      setCheckboxChecked(false);
      form.reset();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred. Please try again later.';
      setModalMessage(errorMessage);
      setIsError(true);
      setIsModalOpen(true);
      setIsSubmitting(false);
    },
  });

  const handleRegistration = () => {
    return form.handleSubmit(async (data: FormData) => {
      // Manually validate checkbox here:
      if (!checkboxChecked) {
        setShowCheckboxError(true);
        return; // Prevent submission if checkbox is unchecked
      }

      setShowCheckboxError(false);
      setIsSubmitting(true);

      // Prepare data payload, excluding checkbox
      const payload = {
        name: data.name,
        email: data.email,
        contactNo: data.contactNo,
        serviceType: serviceTypes,
        sources: [source],
        pathname: window.location.href,
      };

      // Submit the form data via mutation
      mutation.mutate(payload);
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCheckboxChecked(checked);
    if (checked) setShowCheckboxError(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!isError && onSuccessfulSubmission) {
      onSuccessfulSubmission();
    }
  };

  return (
    <>
      <Card className={cn('w-full max-w-md rounded-md pt-6', className)}>
        <Form {...form}>
          <form onSubmit={handleRegistration()}>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type='email' placeholder='Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contactNo'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <PhoneInput
                        country='in'
                        value={field.value}
                        onChange={field.onChange}
                        inputProps={{
                          ref: field.ref,
                        }}
                        containerClass={cn('w-full')}
                        inputStyle={{
                          width: '100%',
                          height: '40px',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                          borderColor: 'hsl(214.3, 31.8%, 91.4%)',
                          backgroundColor: 'var(--background)',
                        }}
                        buttonStyle={{
                          borderTopLeftRadius: '0.375rem',
                          borderBottomLeftRadius: '0.375rem',
                          borderTopRightRadius: '0',
                          borderBottomRightRadius: '0',
                          borderColor: 'hsl(214.3, 31.8%, 91.4%)',
                        }}
                        dropdownStyle={{
                          borderRadius: '0.375rem',
                          width: '300px',
                        }}
                      />
                    </FormControl>
                    <FormMessage className='text-[10px] sm:text-xs'>
                      {fieldState.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Dummy Checkbox */}
              <FormItem>
                <FormControl>
                  <div className='mt-2 flex items-start space-x-2 text-left md:mt-2.5'>
                    <input
                      type='checkbox'
                      id='agreeToTerms'
                      required
                      checked={checkboxChecked}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                      className={cn(
                        'mt-0.5 h-4 w-4 rounded border-2 text-primary focus:ring-primary',
                        showCheckboxError && 'border-red-500'
                      )}
                    />
                    <label
                      htmlFor='agreeToTerms'
                      className='cursor-pointer text-[10px] sm:text-xs'
                    >
                      By submitting the form, I agree to the{' '}
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
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Get Started'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle className='flex items-center space-x-2'>
            {isError ? (
              <AiOutlineCloseCircle className='text-destructive' size={24} />
            ) : (
              <AiOutlineCheckCircle className='text-primary' size={24} />
            )}
            <span>
              {isError ? 'Submission Failed' : 'Submission Successful'}
            </span>
          </DialogTitle>
          <DialogDescription
            className={isError ? 'text-destructive' : 'text-primary'}
          >
            {modalMessage}
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleCloseModal} className='mt-4 w-full'>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
