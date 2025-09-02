/* eslint-disable indent */
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { IBillingDetails } from '@/store/userStoreTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Country, ICountry, IState, State } from 'country-state-city';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as z from 'zod';

export const billingSchema = z.object({
  billingType: z.string().min(1, { message: 'Billing type is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  mobileNumber: z
    .string()
    .min(10, { message: 'Valid phone number is required' }),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z
    .string()
    .min(1, { message: 'Zip code is required' })
    .regex(/^\d+$/, { message: 'Zip code must be numeric' }), // Only numbers allowed
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  isDefault: z.boolean().optional(),
});

export type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: IBillingDetails) => void;
  onCancel: () => void;
  initialData?: IBillingDetails;
}

const BillingForm: React.FC<BillingFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [customBillingType, setCustomBillingType] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          country: Country.getAllCountries().find(
            (c) => c.name === initialData.country
          )?.isoCode,
          state: State.getStatesOfCountry(
            Country.getAllCountries().find(
              (c) => c.name === initialData.country
            )?.isoCode || ''
          ).find((s) => s.name === initialData.state)?.isoCode,
        }
      : {
          billingType: 'personal',
          firstName: '',
          lastName: '',
          email: '',
          mobileNumber: '',
          address: '',
          city: '',
          zipCode: '',
          country: 'IN', // Default country set to India
          state: '',
        },
  });

  const watchCountry = watch('country');
  const watchBillingType = watch('billingType');

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (watchCountry) {
      setStates(State.getStatesOfCountry(watchCountry));
      setValue('state', ''); // Reset the state field when country changes
    }
  }, [watchCountry, setValue]);

  const handleFormSubmit = (data: BillingFormData) => {
    // Convert country and state codes to full names
    const selectedCountry = Country.getCountryByCode(data.country);
    const selectedState = State.getStateByCodeAndCountry(
      data.state,
      data.country
    );

    const submissionData: IBillingDetails = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      country: selectedCountry?.name || data.country,
      state: selectedState?.name || data.state,
      billingType:
        data.billingType === 'createNew' ? customBillingType : data.billingType,
      isDefault: data.isDefault || false,
    };

    onSubmit(submissionData);
  };

  // const handleFormSubmit = (data: BillingFormData) => {
  //   // Convert country and state codes to full names
  //   const selectedCountry = Country.getCountryByCode(data.country);
  //   const selectedState = State.getStateByCodeAndCountry(
  //     data.state,
  //     data.country
  //   );

  //   const submissionData: IBillingDetails = {
  //     ...data,
  //     country: selectedCountry?.name || data.country,
  //     state: selectedState?.name || data.state,
  //     billingType:
  //       data.billingType === 'createNew' ? customBillingType : data.billingType,
  //     isDefault: data.isDefault || false,
  //   };

  //   // // Trigger the onSetDefault function if the user sets this as default billing info
  //   // if (data.isDefault && initialData?._id) {
  //   //   onSetDefault(initialData._id);
  //   // }

  //   onSubmit(submissionData);
  // };

  const renderField = (
    name: keyof BillingFormData,
    label: string,
    isMandatory: boolean = true,
    type: string = 'text'
  ) => (
    <div className='mb-4'>
      <label
        htmlFor={name}
        className='mb-1 block text-xs font-medium text-gray-700 md:text-sm'
      >
        {label}
        {isMandatory && <span className='ml-1 text-red-500'>*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type={type}
            value={typeof field.value === 'boolean' ? '' : field.value}
            className={cn(
              'w-full',
              errors[name] &&
                'border-red-300 focus:border-red-500 focus:ring-red-500'
            )}
          />
        )}
      />
      {errors[name] && (
        <p className='mt-1 text-xs text-red-500'>{errors[name]?.message}</p>
      )}
    </div>
  );

  const renderSelect = (
    name: 'country' | 'state' | 'billingType',
    label: string,
    options: { value: string; label: string }[]
  ) => (
    <div className='mb-4'>
      <label
        htmlFor={name}
        className='mb-1 block text-xs font-medium text-gray-700 md:text-sm'
      >
        {label}
        <span className='ml-1 text-red-500'>*</span>
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={(value) => {
              if (name === 'billingType' && value === 'createNew') {
                setCustomBillingType('');
              }
              field.onChange(value);
            }}
            value={field.value}
          >
            <SelectTrigger id={name} className='w-full'>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent className='bg-muted'>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='w-full'
                >
                  {option.label}
                </SelectItem>
              ))}
              {name === 'billingType' && (
                <SelectItem value='createNew'>Create New</SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      />
      {name === 'billingType' && watchBillingType === 'createNew' && (
        <Input
          className='mt-2'
          placeholder='Enter custom billing type'
          value={customBillingType}
          onChange={(e) => setCustomBillingType(e.target.value)}
        />
      )}
      {errors[name] && (
        <p className='mt-1 text-xs text-red-500'>{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className='grid gap-4 md:grid-cols-2'>
        {renderSelect('billingType', 'Billing Type', [
          { value: 'personal', label: 'Personal' },
          { value: 'business', label: 'Business' },
        ])}
        {renderField('firstName', 'First Name')}
        {renderField('lastName', 'Last Name')}
        {renderField('email', 'Email')}
        <div className='mb-4'>
          <label
            htmlFor='mobileNumber'
            className='mb-1 block text-xs font-medium text-gray-700 md:text-sm'
          >
            Phone Number<span className='ml-1 text-red-500'>*</span>
          </label>
          <Controller
            name='mobileNumber'
            control={control}
            render={({ field }) => (
              <PhoneInput
                country='in'
                value={field.value}
                onChange={(value) => field.onChange(value)}
                containerClass={cn('mt-1 w-full h-9 text-foreground')}
                inputStyle={{
                  width: '100%',
                  height: '36px',
                  fontSize: '14px',
                  borderRadius: '0.375rem',
                  border: errors.mobileNumber
                    ? '1px solid rgb(252 165 165)'
                    : '1px solid rgb(209 213 219)',
                }}
                buttonStyle={{
                  borderRadius: '0.375rem 0 0 0.375rem',
                  border: errors.mobileNumber
                    ? '1px solid rgb(252 165 165)'
                    : '1px solid rgb(209 213 219)',
                }}
                dropdownStyle={{
                  borderRadius: '0.375rem',
                  width: '280px',
                }}
              />
            )}
          />
          {errors.mobileNumber && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.mobileNumber.message}
            </p>
          )}
        </div>
        {renderField('address', 'Address', false)}
        {renderField('city', 'City', false)}
        {renderField('zipCode', 'ZIP Code', true, 'number')}
        {renderSelect(
          'country',
          'Country',
          countries.map((country) => ({
            value: country.isoCode,
            label: country.name,
          }))
        )}
        {renderSelect(
          'state',
          'State',
          states.map((state) => ({
            value: state.isoCode,
            label: state.name,
          }))
        )}
      </div>

      <div className='mt-4 flex items-center space-x-2'>
        <Controller
          name='isDefault'
          control={control}
          render={({ field }) => (
            <Checkbox
              id='isDefault'
              checked={!!field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label
          htmlFor='isDefault'
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Set as default billing information
        </label>
      </div>

      <div className='mt-6 flex justify-end space-x-3'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='flex items-center space-x-1'
        >
          <X size={16} />
          <span>Cancel</span>
        </Button>
        <Button type='submit' className='flex items-center space-x-1'>
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div>
    </motion.form>
  );
};

export default BillingForm;
