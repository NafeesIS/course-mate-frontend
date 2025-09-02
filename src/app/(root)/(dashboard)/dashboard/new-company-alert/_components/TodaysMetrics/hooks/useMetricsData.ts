import { useMemo } from 'react';
import { INcaEmailHistoryItem } from '../../../_hooks/useNcaEmailHistory';

export interface MetricsData {
  companies: number;
  directors: number;
  llps: number;
  partners: number;
  waitingForCompanies: boolean;
  waitingForLLPs: boolean;
}

export interface LatestEmailDates {
  llp: string | null;
  company: string | null;
}

export const useMetricsData = (filesData?: INcaEmailHistoryItem[]) => {
  // Memoize aggregation logic
  const data = useMemo((): MetricsData => {
    if (!filesData || filesData.length === 0) {
      return {
        companies: 0,
        directors: 0,
        llps: 0,
        partners: 0,
        waitingForCompanies: true,
        waitingForLLPs: true,
      };
    }

    let companies = 0;
    let directors = 0;
    let llps = 0;
    let partners = 0;
    let hasCompanies = false;
    let hasLLPs = false;

    for (const item of filesData) {
      const total =
        item.stateWiseData &&
        Array.isArray(item.stateWiseData) &&
        item.stateWiseData.length > 0
          ? item.stateWiseData.find((s) => s.state === 'Total')
          : { entityCount: 0, personCount: 0 };
      if (item.dataType === 'companies' && total) {
        companies += total.entityCount || 0;
        directors += total.personCount || 0;
        hasCompanies = true;
      }
      if (item.dataType === 'llps' && total) {
        llps += total.entityCount || 0;
        partners += total.personCount || 0;
        hasLLPs = true;
      }
    }

    return {
      companies,
      directors,
      llps,
      partners,
      waitingForCompanies: !hasCompanies,
      waitingForLLPs: !hasLLPs,
    };
  }, [filesData]);

  // Get the latest email sent dates for LLP and Company separately
  const latestEmailDates = useMemo((): LatestEmailDates => {
    if (!filesData || filesData.length === 0) {
      return {
        llp: null,
        company: null,
      };
    }

    let latestLLPDate: string | null = null;
    let latestCompanyDate: string | null = null;
    let latestLLPTime = 0;
    let latestCompanyTime = 0;

    for (const item of filesData) {
      if (item.emailSentDate) {
        const time = new Date(item.emailSentDate).getTime();

        if (item.dataType === 'llps' && time > latestLLPTime) {
          latestLLPTime = time;
          latestLLPDate = item.emailSentDate;
        }

        if (item.dataType === 'companies' && time > latestCompanyTime) {
          latestCompanyTime = time;
          latestCompanyDate = item.emailSentDate;
        }
      }
    }

    return {
      llp: latestLLPDate,
      company: latestCompanyDate,
    };
  }, [filesData]);

  return {
    data,
    latestEmailDates,
  };
};
