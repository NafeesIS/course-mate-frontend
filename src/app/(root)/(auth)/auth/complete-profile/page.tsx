/* eslint-disable camelcase */
'use client';

import OTPVerificationDialog from '@/app/(root)/new-company-alert/_components/Hero/OTPVerificationDialog';
import LoadingWithSpinner from '@/components/Loaders/LoadingWithSpinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BASE_URL_BACKEND } from '@/constants';
import { cn } from '@/lib/utils';
import { useUserSignInDetails } from '@/store/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'sonner';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import * as z from 'zod';
import { getAccountDomainAndNameFromEmail } from '../../_utils/utils';

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  mobileNumber: z
    .string()
    .min(10, 'Invalid phone number')
    .max(15, 'Phone number too long'),
});

export default function CompleteProfile() {
  const router = useRouter();
  const [isOTPModalOpen, setOTPModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOTPScriptLoaded, setIsOTPScriptLoaded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
    },
  });

  const {
    userSignInDetails,
    userSignInDetailsLoading,
    refetchUserSignInDetails,
  } = useUserSignInDetails();

  const resetFormWithUserData = useCallback(() => {
    if (userSignInDetails?.data.meta_data) {
      form.reset({
        firstName: userSignInDetails.data.meta_data.firstName || '',
        lastName: userSignInDetails.data.meta_data.lastName || '',
        mobileNumber: userSignInDetails.data.meta_data.mobileNumber || '',
      });
    }
  }, [userSignInDetails, form]);

  useEffect(() => {
    resetFormWithUserData();
  }, [resetFormWithUserData]);

  const initOTP = useCallback(() => {
    const configuration = {
      widgetId: '346a6e6e4135353530313431',
      tokenAuth: '430158TblL20YbEq66e17a4eP1',
      identifier: '',
      exposeMethods: 'true',
      captchaRenderId: '',
      success: (data: any) => {
        // eslint-disable-next-line no-console
        console.log('Success response:', data);
      },
      failure: (error: any) => {
        console.error('Failure reason:', error);
        toast.error('OTP service initialization failed');
      },
      var1: '<var1>',
      VAR1: '<VAR1>',
    };

    if (
      typeof window !== 'undefined' &&
      typeof window.initSendOTP !== 'undefined'
    ) {
      try {
        window.initSendOTP(configuration);
        setIsOTPScriptLoaded(true);
        // eslint-disable-next-line no-console
        console.log('MSG91 OTP script loaded successfully');
      } catch (error) {
        console.error('Error initializing OTP:', error);
        toast.error('Failed to initialize OTP service');
      }
    } else {
      console.error('MSG91 OTP provider script is not ready yet.');
    }
  }, []);

  const handleSendOTP = useCallback(() => {
    const isValid = form.trigger();
    if (!isValid) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    const mobileNumber = form.getValues('mobileNumber');
    if (!mobileNumber) {
      form.setError('mobileNumber', {
        type: 'manual',
        message: 'Mobile number is required.',
      });
      return;
    }

    if (!isOTPScriptLoaded) {
      toast.error(
        'OTP service is not ready yet. Please try again in a moment.'
      );
      return;
    }

    if (typeof window !== 'undefined' && window.sendOtp) {
      setIsSubmitting(true);
      window.sendOtp(
        mobileNumber,
        () => {
          toast.success('OTP sent successfully.');
          setOTPModalOpen(true);
          setIsSubmitting(false);
        },
        () => {
          toast.error('Error occurred while sending OTP. Please try again.');
          setIsSubmitting(false);
        }
      );
    } else {
      toast.error('OTP service is not available. Please try again later.');
    }
  }, [form, isOTPScriptLoaded]);

  const handleProfileSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      try {
        const response = await fetch(
          `${BASE_URL_BACKEND}/api/v1/users/update-user-info`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              first_name: values.firstName,
              last_name: values.lastName,
              mobile_number: values.mobileNumber,
            }),
            credentials: 'include',
          }
        );

        if (response.ok) {
          toast.success('Profile updated successfully');
          await refetchUserSignInDetails?.();

          await handleAnalyticsTracking(values);

          setTimeout(() => {
            router.push(localStorage.getItem('urlHistory') || '/dashboard');
          }, 300);
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating user info:', error);
        toast.error('An error occurred while updating your profile');
      } finally {
        setIsSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userSignInDetails, refetchUserSignInDetails, router]
  );

  const handleAnalyticsTracking = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.thriveStack &&
        userSignInDetails
      ) {
        const userId = userSignInDetails.data._id;
        const userName = `${values.firstName} ${values.lastName}`;
        const email = userSignInDetails.data.emails[0];
        const { account_domain, account_name } =
          getAccountDomainAndNameFromEmail(email || '');
        const timestamp = new Date().toISOString();

        const analyticsPromises = [
          // User identification
          window.thriveStack.identify([
            {
              user_id: userId,
              traits: {
                user_email: email,
                user_name: userName,
              },
              timestamp,
            },
          ]),
          // Account creation tracking
          window.thriveStack.track([
            {
              event_name: 'account_created',
              properties: {
                account_domain,
                account_id: userId,
                account_name,
              },
              user_id: userId,
              timestamp,
              context: {
                group_id: userId,
              },
            },
          ]),
          // Group creation
          window.thriveStack.group([
            {
              user_id: userId,
              group_id: userId,
              traits: {
                group_type: 'Account',
                account_domain,
                account_name,
                plan_id: '',
                plan_name: '',
              },
              context: {
                group_id: userId,
                group_type: 'Account',
              },
              timestamp,
            },
          ]),
          // User-company association
          window.thriveStack.track([
            {
              event_name: 'account_added_user',
              properties: {
                account_name,
                user_email: email,
              },
              user_id: userId,
              timestamp,
              context: {
                group_id: userId,
              },
            },
          ]),
          // Update group in identify
          window.thriveStack.identify([
            {
              user_id: userId,
              traits: {
                user_email: email,
                user_name: userName,
              },
              timestamp,
              context: {
                group_id: userId,
              },
            },
          ]),
        ];

        await Promise.allSettled(analyticsPromises);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  if (typeof window === 'undefined' || userSignInDetailsLoading) {
    return <LoadingWithSpinner className='h-[90vh]' />;
  }

  return (
    <SessionAuth>
      <Script
        src='https://verify.msg91.com/otp-provider.js'
        strategy='afterInteractive'
        onLoad={initOTP}
        onError={() => {
          console.error('Failed to load MSG91 OTP script');
          toast.error('Failed to load OTP service');
        }}
      />

      <div className='flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-blue-100 to-white p-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className='w-[350px] sm:w-[400px]'>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Please provide your details to complete your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='John'
                            {...field}
                            className='rounded-full'
                            disabled={isSubmitting}
                            aria-describedby='firstName-error'
                          />
                        </FormControl>

                        <FormMessage id='firstName-error' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Doe'
                            {...field}
                            className='rounded-full'
                            disabled={isSubmitting}
                            aria-describedby='lastName-error'
                          />
                        </FormControl>

                        <FormMessage id='lastName-error' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='mobileNumber'
                    render={() => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Controller
                            name='mobileNumber'
                            control={form.control}
                            render={({ field }) => (
                              <PhoneInput
                                country='in'
                                {...field}
                                disabled={isSubmitting}
                                containerClass={cn('w-full')}
                                inputStyle={{
                                  width: '100%',
                                  height: '48px',
                                  borderRadius: '9999px',
                                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                  borderColor: 'hsl(214.3, 31.8%, 91.4%)',
                                  backgroundColor: 'var(--background)',
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
                            )}
                          />
                        </FormControl>

                        <FormDescription>
                          Please include your country code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type='button'
                    onClick={handleSendOTP}
                    className='w-full rounded-full'
                    disabled={isSubmitting || !isOTPScriptLoaded}
                  >
                    {isSubmitting
                      ? 'Sending OTP...'
                      : 'Send OTP & Complete Profile'}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <OTPVerificationDialog
        isOpen={isOTPModalOpen}
        onClose={() => setOTPModalOpen(false)}
        handleFormSubmit={() => handleProfileSubmit(form.getValues())}
        contactNo={form.getValues('mobileNumber')}
      />
    </SessionAuth>
  );
}
