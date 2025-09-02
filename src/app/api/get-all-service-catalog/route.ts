/* eslint-disable camelcase */
import { NextRequest, NextResponse } from 'next/server';
import { IUnlockPricing, TServiceCatalog } from './_types/types';

export const dynamic = 'force-dynamic'; // Ensure the route is always dynamic

// const API_URL = `http://localhost:4000/api/v1/service-catalog/get-all-service-catalog`;
const API_URL =
  process.env.NODE_ENV === 'production'
    ? `https://production.filesure.in/api/v1/service-catalog/get-all-service-catalog`
    : `http://localhost:4000/api/v1/service-catalog/get-all-service-catalog`;

const CACHE_DURATION = 6 * 60 * 60; // 6 hours in seconds

// Cache the fetch operation with a short TTL
const cachedFetch = async (url: string) => {
  const response = await fetch(url, {
    next: { revalidate: CACHE_DURATION }, // Cache for 6 hours
  });
  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }
  return response.json();
};

export async function GET(request: NextRequest) {
  try {
    const country =
      request.headers.get('cloudfront-viewer-country')?.toLowerCase() ||
      'unknown';

    const responseData = await cachedFetch(API_URL);
    const { data } = responseData;

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // Process the service catalog data
    const processedData = data.map((service: TServiceCatalog) => {
      if (
        service.serviceType === 'directorUnlock' &&
        service.directorUnlockPricing
      ) {
        return processUnlockPricing(service, country, 'directorUnlockPricing');
      }
      if (
        service.serviceType === 'companyUnlock' &&
        service.companyUnlockPricing
      ) {
        return processUnlockPricing(service, country, 'companyUnlockPricing');
      }
      if (service.serviceType === 'vpdUnlock' && service.vpdUnlockPricing) {
        return processUnlockPricing(service, country, 'vpdUnlockPricing');
      }
      return service;
    });

    return NextResponse.json(
      {
        serviceCatalog: processedData,
        country: country,
        currency: country === 'in' || country === 'unknown' ? 'INR' : 'USD',
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Error in GET function:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while fetching service catalog data',
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

function processUnlockPricing(
  service: TServiceCatalog,
  country: string,
  pricingType:
    | 'directorUnlockPricing'
    | 'companyUnlockPricing'
    | 'vpdUnlockPricing'
) {
  const pricingArray = service[pricingType] as IUnlockPricing[];
  const pricing =
    country === 'in' || country === 'unknown'
      ? pricingArray.find((item) => item.currency === 'INR')
      : pricingArray.find((item) => item.currency === 'USD');

  if (!pricing) {
    return {
      ...service,
      error: 'Pricing not available for your region',
    };
  }

  return {
    ...service,
    [pricingType]: {
      singleUnlock: pricing.singleUnlock,
      bulkUnlock: pricing.bulkUnlock,
      currency: pricing.currency,
      country: country,
    },
  };
}
