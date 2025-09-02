'use client';
import { INewCommonLead } from '@/app/(root)/business-services/_types/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { BASE_URL_FRONTEND } from '@/constants';
import { SaveLatestLeads } from '@/lib/saveLatestLeads';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineCheck } from 'react-icons/ai';
import { RiMailLine, RiUser3Line } from 'react-icons/ri';
import { RxCross1 } from 'react-icons/rx';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { z } from 'zod';
import successOne from '../../../../public/assets/business-services/success_one.png';
import successTwo from '../../../../public/assets/business-services/success_two.png';

const formSchema = z.object({
  username: z.string().nonempty(),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  contactNo: z.string().min(10, {
    message: 'Contact number must be at least 10 digits.',
  }),
  agreeToTerms: z.boolean().optional(),
});
interface CommonLeadFormProps {
  // eslint-disable-next-line no-unused-vars
  setIsFormModalOpen?: (isOpen: boolean) => void;
  serviceType: string[];
  sources: string[];
}
const CommonLeadForm: React.FC<CommonLeadFormProps> = ({
  setIsFormModalOpen,
  serviceType,
  sources,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const handleOkayButtonClick = () => {
    setIsModalOpen(false);
    if (setIsFormModalOpen) {
      setIsFormModalOpen(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      contactNo: '',
      agreeToTerms: false,
    },
    mode: 'onChange',
  });

  const handleRegistration = () => {
    return form.handleSubmit((values) => {
      const newCompanyAlertLeadData: INewCommonLead = {
        name: values.username,
        email: values.email,
        contactNo: values.contactNo,
        serviceType: serviceType,
        sources: sources,
        pathname: window.location.href,
      };

      SaveLatestLeads(
        newCompanyAlertLeadData,
        setIsSuccess,
        setIsModalOpen,
        form.reset
      );
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleRegistration()}
        className={cn(
          'z-10 mx-auto w-full max-w-full rounded-lg bg-transparent px-0 py-3 text-center md:py-0 lg:mx-0'
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
                  <RiUser3Line className='absolute left-2.5 top-1/2 -translate-y-1/2 transform text-gray-400' />
                  <Input
                    required
                    placeholder='Enter name'
                    {...field}
                    className='h-9 rounded-md bg-background pl-12'
                  />
                </div>
              </FormControl>
              <FormMessage className='text-[10px] sm:text-xs' />
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
                <div className='relative mt-2 md:mt-2.5'>
                  <RiMailLine className='absolute left-2.5 top-1/2 -translate-y-1/2 transform text-gray-400' />
                  <Input
                    required
                    placeholder='Enter email'
                    {...field}
                    className='h-9 w-full rounded-md bg-background pl-12'
                  />
                </div>
              </FormControl>
              <FormMessage className='text-[10px] sm:text-xs' />
            </FormItem>
          )}
        />

        {/* Phone Input */}
        <Controller
          name='contactNo'
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className='relative mt-2 md:mt-2.5'>
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
                      height: '36px',
                      borderRadius: '2px',
                      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                      borderColor: 'hsl(214.3, 31.8%, 91.4%)',
                      backgroundColor: 'bg-background',
                    }}
                    buttonStyle={{
                      borderTopLeftRadius: '2px',
                      borderBottomLeftRadius: '2px',
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
              <FormMessage className='text-[10px] sm:text-xs'>
                {fieldState.error?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='agreeToTerms'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='mt-2 flex items-start space-x-2 text-left md:mt-2.5'>
                  <input
                    type='checkbox'
                    id='agreeToTerms'
                    required
                    onChange={(e) => field.onChange(e.target.checked)}
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
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className={`mt-2 h-9 w-full rounded-md px-4 text-sm disabled:bg-primary md:mt-2.5 md:text-base`}
        >
          Get Started
        </Button>
      </form>
      {/* Success/Failure Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-80 sm:max-w-96'>
          <div className='mx-auto flex h-full w-full flex-col items-center justify-center bg-card'>
            {isSuccess && (
              <div className='-mb-24 -mt-5 flex w-full items-center justify-between'>
                <Image
                  alt='successOne'
                  className='z-10 -translate-x-[22px]'
                  src={successOne}
                  quality={100}
                />
                <Image
                  alt='successTwo'
                  className='z-10 translate-x-[22px]'
                  src={successTwo}
                  quality={100}
                />
              </div>
            )}

            {/* Success or Failure Icon */}
            {isSuccess ? (
              <AiOutlineCheck className='z-20 mb-4 size-20 rounded-full border-2 border-[#63BFAB] bg-accent p-2 text-[#63BFAB] sm:size-24' />
            ) : (
              <RxCross1 className='z-20 mb-4 size-16 rounded-full border-2 border-red-700 bg-accent p-2 text-red-700 sm:size-20' />
            )}

            {/* Success or Failure Message */}
            {isSuccess ? (
              <>
                <DialogTitle className='mb-0 max-w-64 text-center text-base font-semibold text-[#63BFAB] lg:text-lg'>
                  Registered Successfully!
                </DialogTitle>
                <DialogDescription className='text-center text-xs text-muted-foreground lg:text-sm'>
                  Thank you for choosing us. Our team will reach out to you
                  shortly to assist with the next steps.
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle className='mb-0 max-w-64 text-center text-base font-semibold text-red-700 lg:text-lg'>
                  Registration Failed!
                </DialogTitle>
                <DialogDescription className='text-center text-xs text-muted-foreground lg:text-sm'>
                  Unfortunately, something went wrong. Please try again later.
                </DialogDescription>
              </>
            )}

            <Button
              className={`mt-4 ${
                isSuccess
                  ? 'bg-[#63BFAB] hover:bg-green-500'
                  : 'bg-red-700 hover:bg-red-600'
              }`}
              onClick={handleOkayButtonClick}
            >
              Okay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default CommonLeadForm;
