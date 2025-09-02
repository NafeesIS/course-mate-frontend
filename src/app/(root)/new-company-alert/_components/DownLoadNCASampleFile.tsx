/* eslint-disable no-console */
'use client';

import { Button } from '@/components/ui/button';
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
import axios from 'axios';
import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiDownload2Line, RiMailLine, RiUser3Line } from 'react-icons/ri';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'sonner';
import { z } from 'zod';
import OTPVerificationDialog from './Hero/OTPVerificationDialog';

interface NewCompanyAlertLead {
  name: string;
  email: string;
  contactNo: string;
  serviceType: string[];
  sources: string[];
  pathname: string;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  contactNo: z.string().min(10, {
    message: 'Contact number must be at least 10 digits.',
  }),
});

interface DownLoadNCASampleFileProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const DownloadNCASampleFile = ({
  setIsModalOpen,
  className,
}: DownLoadNCASampleFileProps) => {
  const [isOTPModalOpen, setOTPModalOpen] = useState(false); // State to control OTP Modal
  // const [isScriptLoaded, setScriptLoaded] = useState(false); // State to track if the OTP script is loaded

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      contactNo: '',
    },
    mode: 'onChange',
  });

  const saveNewCompanyAlertLead = async (
    newCompanyAlertLeadData: NewCompanyAlertLead
  ): Promise<any> => {
    const response = await axios.post(
      `${BASE_URL_BACKEND}/api/v1/leads/addLead`,
      newCompanyAlertLeadData
    );
    return response.data;
  };

  const handleFormSubmit = () => {
    form.handleSubmit((values) => {
      const newCompanyAlertLeadData: NewCompanyAlertLead = {
        name: values.username,
        email: values.email,
        contactNo: values.contactNo,
        serviceType: ['New company alert'],
        sources: ['new company alert landing page'],
        pathname: window.location.href,
      };

      saveNewCompanyAlertLead(newCompanyAlertLeadData)
        .then(() => {
          toast.success('Submitted Successfully and started downloading');
          window.open(
            'https://company-alerts-reports-new.s3.ap-south-1.amazonaws.com/sample_newly_registered_companies.csv',
            '_blank'
          );
          form.reset(); // Reset the form fields after successful submission
          // window.hcaptcha.reset(); // Reset the hCaptcha widget
        })
        .catch((error) => {
          toast.error('Submission failed. Please try again.');
          console.error('Error submitting data:', error);
        });
    })();
  };

  const initOTP = () => {
    // const contactNo = form.getValues('contactNo');
    const configuration = {
      widgetId: '34696b6a3279363439323535',
      tokenAuth: '430158TblL20YbEq66e17a4eP1', // MSG91 auth token
      // identifier: contactNo,
      identifier: '',
      exposeMethods: 'true',
      // captchaRenderId: 'msg91-custom-recaptcha-container',
      captchaRenderId: '',
      success: (data: any) => {
        console.log('Success response:', data);
      },
      failure: (error: any) => {
        console.log('Failure reason:', error);
      },
      var1: '<var1>',
      VAR1: '<VAR1>',
    };

    if (typeof window.initSendOTP !== 'undefined') {
      window.initSendOTP(configuration);
      // setScriptLoaded(true);
      console.log('MSG91 OTP script loaded');
    } else {
      console.error('MSG91 OTP provider script is not ready yet.');
    }
  };

  const handleDownload = () => {
    const contactNo = form.getValues('contactNo');
    if (!contactNo) {
      form.setError('contactNo', {
        type: 'manual',
        message: 'Mobile number is required.',
      });
      return;
    }

    // if (isScriptLoaded && typeof window !== 'undefined') {
    // const isCaptchaVerified = window.isCaptchaVerified();
    // console.log('isCaptchaVerified:', isCaptchaVerified);
    // if (!isCaptchaVerified) {
    //   toast.error('Please verify the captcha.');
    //   return;
    // }

    if (typeof window !== 'undefined') {
      window.sendOtp(
        contactNo,
        () => {
          toast.success('OTP sent successfully.');
          setOTPModalOpen(true);
        },
        () => toast.error('Error occurred while sending OTP. Please try again.')
      );
    } else {
      toast.error('OTP service is not ready yet. Please try again later.');
    }
  };

  return (
    <div id='download-sample-file-container' className='w-full'>
      <Script
        src='https://verify.msg91.com/otp-provider.js'
        strategy='afterInteractive'
        onLoad={() => {
          initOTP();
        }}
      />
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission
            handleDownload(); // Call your download logic
          }}
          className={cn(
            'z-10 mx-auto w-full rounded-lg p-4 text-center md:bg-transparent md:p-0 lg:mx-0',
            className
          )}
        >
          {/* Name */}
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <RiUser3Line className='absolute left-5 top-1/2 -translate-y-1/2 transform text-gray-400' />
                    <Input
                      id='username'
                      required
                      placeholder='Enter name'
                      {...field}
                      className='h-12 rounded-full bg-background pl-12'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='contactNo'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative mt-2'>
                    <PhoneInput
                      country='in'
                      {...field}
                      containerClass={cn('w-full')}
                      inputStyle={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '9999px',
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        borderColor: 'hsl(214.3, 31.8%, 91.4%)',
                        backgroundColor: 'bg-background',
                      }}
                      buttonStyle={{
                        borderTopLeftRadius: '9999px',
                        borderBottomLeftRadius: '9999px',
                        borderTopRightRadius: '0.375rem',
                        borderBottomRightRadius: '0.375rem',
                        borderColor: 'hsl(214.3, 31.8%, 91.4%)',
                      }}
                      dropdownStyle={{
                        borderRadius: '0.375rem',
                        width: '300px',
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative mt-2'>
                    <RiMailLine className='absolute left-5 top-1/2 -translate-y-1/2 transform text-gray-400' />
                    <Input
                      required
                      placeholder='Enter email'
                      {...field}
                      className='h-12 rounded-full bg-background pl-12'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mt-2 flex items-start space-x-2 text-left md:mt-2.5'>
            <input
              type='checkbox'
              id='agreeToTerms'
              required
              className='mt-0.5 h-4 w-4 rounded border-2 text-primary focus:ring-primary'
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

          <Button
            type='submit'
            className={`mt-3 h-10 w-full gap-2 rounded-full bg-nca-primary-blue px-8 text-sm shadow disabled:bg-primary md:h-12 md:text-base ${
              form.formState.isValid ? '' : ''
            }`}
            // onClick={() => setIsModalOpen(false)}
          >
            Download Sample File{' '}
            <RiDownload2Line className='text-base md:text-lg' />
          </Button>
          {/* <PolicyDisclaimerText /> */}
        </form>
      </Form>

      <OTPVerificationDialog
        isOpen={isOTPModalOpen}
        onClose={() => {
          setOTPModalOpen(false);
          setIsModalOpen(false);
          // window.hcaptcha.reset(); // Reset the hCaptcha widget
        }}
        handleFormSubmit={handleFormSubmit}
        contactNo={form.getValues('contactNo')}
      />
    </div>
  );
};

export default DownloadNCASampleFile;
