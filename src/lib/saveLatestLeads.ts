import { BASE_URL_BACKEND } from '@/constants';
import axios from 'axios';
import { INewCommonLead } from '../app/(root)/business-services/_types/types';

export const SaveLatestLeads = async (
  newCompanyAlertLeadData: INewCommonLead,
  // eslint-disable-next-line no-unused-vars
  setIsSuccess: (value: boolean) => void,
  // eslint-disable-next-line no-unused-vars
  setIsModalOpen: (value: boolean) => void,
  resetForm: () => void
): Promise<any> => {
  if (!newCompanyAlertLeadData) {
    return console.error('No new company alert lead data to save');
  }

  try {
    const response = await axios.post(
      `${BASE_URL_BACKEND}/api/v1/leads/addLead`,
      newCompanyAlertLeadData
    );
    setIsSuccess(true);
    resetForm();
    return response.data;
  } catch (error) {
    setIsSuccess(false);
  } finally {
    setIsModalOpen(true);
  }
};
