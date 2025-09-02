'use client';

import { Button } from '@/components/ui/button';
import { BASE_URL_BACKEND } from '@/constants';
import { IBillingDetails, IUserData } from '@/store/userStoreTypes';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useBillingStore } from '../_store/billingStore';
import BillingForm, { billingSchema } from './BillingForm';
import BillingInfoList from './BillingInfoList';

interface BillingDetailsProps {
  userDetails: IUserData | undefined;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({ userDetails }) => {
  const { updateBillingInfo } = useBillingStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [billingInfoList, setBillingInfoList] = useState<IBillingDetails[]>([]);

  useEffect(() => {
    if (userDetails && userDetails.billingDetails) {
      const defaultBillingInfo = userDetails.billingDetails.find(
        (item) => item.isDefault === true
      ) || {
        billingType: 'personal',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        state: '',
      };
      updateBillingInfo(defaultBillingInfo);
      setBillingInfoList(userDetails.billingDetails);

      // Check if any mandatory fields are missing
      const validationResult = billingSchema.safeParse(defaultBillingInfo);
      if (!validationResult.success) {
        setIsEditing(true);
        setEditingIndex(
          userDetails.billingDetails.findIndex(
            (item) => item.isDefault === true
          )
        );
        toast.warning('Please complete your billing information');
      }
    }
  }, [userDetails, updateBillingInfo]);

  const handleApiCall = async (url: string, method: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL_BACKEND}${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('API call failed');
      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      toast.error('Failed to process billing details');
      throw error;
    }
  };

  const handleSubmit = async (data: IBillingDetails) => {
    try {
      const url =
        editingIndex !== null
          ? '/api/v1/users/update-billing-details'
          : '/api/v1/users/add-billing-details';
      const apiResponse = await handleApiCall(url, 'POST', {
        ...data,
        _billingDetailsId:
          editingIndex !== null ? billingInfoList[editingIndex]._id : undefined,
      });

      if (apiResponse.success) {
        const defaultBillingInfo = apiResponse.data.billingDetails.find(
          (item: any) => item.isDefault === true
        ) || {
          billingType: 'personal',
          firstName: '',
          lastName: '',
          email: '',
          mobileNumber: '',
          address: '',
          city: '',
          zipCode: '',
          country: '',
          state: '',
        };
        updateBillingInfo(defaultBillingInfo);
        setBillingInfoList(apiResponse.data.billingDetails);
        setIsEditing(false);
        setEditingIndex(null);
        toast.success('Billing details updated successfully!');
      } else {
        throw new Error(apiResponse.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to update billing details');
    }
  };

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleDelete = async (id: string) => {
    if (billingInfoList.length === 1) {
      toast.error('At least one billing detail is required');
      return;
    }

    try {
      const apiResponse = await handleApiCall(
        `/api/v1/users/delete-billing-details/${id}`,
        'DELETE',
        {}
      );
      if (apiResponse.success) {
        const defaultBillingInfo = apiResponse.data.billingDetails.find(
          (item: any) => item.isDefault === true
        ) || {
          billingType: 'personal',
          firstName: '',
          lastName: '',
          email: '',
          mobileNumber: '',
          address: '',
          city: '',
          zipCode: '',
          country: '',
          state: '',
        };
        updateBillingInfo(defaultBillingInfo);
        setBillingInfoList(apiResponse.data.billingDetails);
        toast.success('Billing details deleted successfully!');
      } else {
        throw new Error(apiResponse.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete billing details');
    }
  };

  // const handleSetDefault = async (id: string) => {
  //   try {
  //     const apiResponse = await handleApiCall(
  //       '/api/v1/users/update-billing-details',
  //       'POST',
  //       { _billingDetailsId: id, isDefault: true }
  //     );
  //     if (apiResponse.success) {
  //       setBillingInfoList(apiResponse.data.billingDetails);
  //       toast.success('Default billing info updated');
  //     } else {
  //       throw new Error(apiResponse.message);
  //     }
  //   } catch (error) {
  //     console.error('Set default error:', error);
  //     toast.error('Failed to set default billing info');
  //   }
  // };

  const handleSelectedBillingInfo = (billingInfo: IBillingDetails) => {
    updateBillingInfo(billingInfo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // className='rounded-md border border-gray-200 bg-white'
    >
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-800 md:text-xl'>
          Billing Details
        </h2>
        {!isEditing && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setIsEditing(true);
              setEditingIndex(null);
            }}
            className='flex items-center space-x-1'
          >
            <Plus size={16} />
            <span>Add New</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <BillingForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsEditing(false);
            setEditingIndex(null);
          }}
          initialData={
            editingIndex !== null ? billingInfoList[editingIndex] : undefined
          }
        />
      ) : (
        <BillingInfoList
          billingInfoList={billingInfoList}
          onSelect={handleSelectedBillingInfo}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </motion.div>
  );
};

export default BillingDetails;
