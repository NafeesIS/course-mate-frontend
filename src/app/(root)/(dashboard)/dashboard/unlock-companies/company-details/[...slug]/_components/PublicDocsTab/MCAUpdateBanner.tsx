'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import {
  IoCheckmarkCircle,
  IoChevronDown,
  IoChevronUp,
  IoInformationCircle,
  IoWarning,
} from 'react-icons/io5';

const MCAUpdateBanner = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className='my-6 border-sky-200 bg-sky-50 shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-semibold text-sky-900 md:text-base'>
          <IoInformationCircle className='h-5 w-5 text-sky-600' />
          Important Update: MCA V2 to V3 Migration
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='space-y-4 text-xs text-sky-800 md:text-sm'>
          <p>
            The Ministry of Corporate Affairs (MCA) has successfully completed
            its migration to the V3 portal as of 18 June 2025.
          </p>

          <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-4'>
            <h4 className='mb-3 flex items-center gap-2 font-semibold text-emerald-800'>
              <IoCheckmarkCircle className='h-4 w-4' />
              On Our Platform
            </h4>
            <div className='space-y-3 text-xs text-emerald-800 md:text-sm'>
              <div>
                <span className='font-medium'>
                  • For filings dated before July 2016:
                </span>
                <p className='ml-4 mt-1'>
                  We fetch documents from{' '}
                  <span className='font-semibold'>both V2 and V3</span>, and pay
                  challans on both portals when needed. You get{' '}
                  <span className='font-semibold'>complete access</span> to all
                  available filings.
                </p>
                <p className='ml-4 text-emerald-700'>
                  → These documents appear under the V2 tab.
                </p>
              </div>
              <div>
                <span className='font-medium'>
                  • For filings dated July 2016 onwards:
                </span>
                <p className='ml-4 mt-1'>
                  We fetch documents{' '}
                  <span className='font-semibold'>only from V3</span>, as MCA
                  has completed the migration for all forms post-2016.
                </p>
                <p className='ml-4 text-emerald-700'>
                  → These documents appear under the V3 tab.
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
            <h4 className='mb-3 flex items-center gap-2 font-semibold text-amber-800'>
              <IoWarning className='h-4 w-4' />
              Important Note:
            </h4>
            <p className='mb-2 text-xs text-amber-800 md:text-sm'>
              Our system organizes documents by{' '}
              <span className='font-semibold'>filing date</span>, not
              incorporation date.
            </p>
            <p className='text-xs text-amber-800 md:text-sm'>
              For example, a company incorporated in 2010 will have:
            </p>
            <ul className='ml-4 mt-1 space-y-1 text-xs text-amber-800 md:text-sm'>
              <li>• Filings from 2010-2016 in the V2 tab</li>
              <li>• Filings from 2017 onward in the V3 tab</li>
            </ul>
          </div>

          {/* <div className='rounded-lg border border-sky-200 bg-white p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <IoCheckmarkCircle className='h-4 w-4 text-emerald-600' />
              <span className='font-semibold text-sky-900'>Quick Summary</span>
            </div>
            <ul className='ml-6 space-y-1 text-xs text-sky-700 md:text-sm'>
              <li>
                • Filings before July 2016 →{' '}
                <span className='font-medium'>V2 tab</span>
              </li>
              <li>
                • Filings July 2016 onwards →{' '}
                <span className='font-medium'>V3 tab</span>
              </li>
            </ul>
          </div> */}

          <div className='flex justify-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowDetails(!showDetails)}
              className='border-sky-300 text-sky-700 hover:bg-sky-100'
            >
              {showDetails ? (
                <>
                  Hide Details <IoChevronUp className='ml-1 h-4 w-4' />
                </>
              ) : (
                <>
                  View Full Details <IoChevronDown className='ml-1 h-4 w-4' />
                </>
              )}
            </Button>
          </div>

          {showDetails && (
            <div className='mt-4 space-y-4 border-t border-sky-200 pt-4'>
              <p className='rounded-lg bg-sky-100 p-3 text-xs text-sky-700 md:text-sm'>
                Here&apos;s a clear overview of what changed and how it affects
                access to company documents.
              </p>

              <div className='overflow-hidden rounded-lg border border-sky-200 bg-white'>
                <div className='border-b border-sky-200 bg-sky-100 p-3'>
                  <h4 className='font-semibold text-sky-900'>
                    📋 MCA Portal Migration Timeline (by Form Type)
                  </h4>
                </div>
                <div className='overflow-x-auto'>
                  <table className='w-full text-xs md:text-sm'>
                    <thead>
                      <tr className='bg-sky-50'>
                        <th className='border-r border-sky-200 px-3 py-2 text-left font-medium text-sky-900'>
                          Period
                        </th>
                        <th className='border-r border-sky-200 px-3 py-2 text-left font-medium text-sky-900'>
                          Incorporation Forms
                        </th>
                        <th className='border-r border-sky-200 px-3 py-2 text-left font-medium text-sky-900'>
                          ADT-1, MGT-7, AOC-4 (Key Annual Forms)
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-sky-900'>
                          Other Company Forms
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b border-sky-100'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          2005 - 2023
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Filed via V2
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Filed via V2
                        </td>
                        <td className='px-3 py-2'>Filed via V2</td>
                      </tr>
                      <tr className='bg-sky-25 border-b border-sky-100'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          2023 - 18 June 2025
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Filed via V3 only
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Filed via V2 (last date: 18 June 2025)
                        </td>
                        <td className='px-3 py-2'>Gradually migrated to V3</td>
                      </tr>
                      <tr className='border-b border-sky-100'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          From 18 June to 13 July 2025
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Filed via V3 only
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          No filings (MCA under maintenance)
                        </td>
                        <td className='px-3 py-2'>Filed via V3 only</td>
                      </tr>
                      <tr className='bg-emerald-50'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          From 14 July 2025
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Filed via V3 only
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Filed via V3 only
                        </td>
                        <td className='px-3 py-2'>Filed via V3 only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='overflow-hidden rounded-lg border border-sky-200 bg-white'>
                <div className='border-b border-sky-200 bg-sky-100 p-3'>
                  <h4 className='font-semibold text-sky-900'>
                    📁 Access to Filed Documents (by Form Type)
                  </h4>
                </div>
                <div className='overflow-x-auto'>
                  <table className='w-full text-xs md:text-sm'>
                    <thead>
                      <tr className='bg-sky-50'>
                        <th className='border-r border-sky-200 px-3 py-2 text-left font-medium text-sky-900'>
                          Filing Date
                        </th>
                        <th className='border-r border-sky-200 px-3 py-2 text-left font-medium text-sky-900'>
                          Incorporation Forms
                        </th>
                        <th className='border-r border-sky-200 px-3 py-2 text-left font-medium text-sky-900'>
                          ADT-1, MGT-7, AOC-4
                        </th>
                        <th className='px-3 py-2 text-left font-medium text-sky-900'>
                          Other Company Forms
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b border-sky-100'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          Before July 2016
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Only on V2
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Only on V2
                        </td>
                        <td className='px-3 py-2'>Only on V2</td>
                      </tr>
                      <tr className='bg-sky-25 border-b border-sky-100'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          July 2016 - 2022
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Available on both V2 and V3
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Available on both V2 and V3
                        </td>
                        <td className='px-3 py-2'>
                          Available on both V2 and V3
                        </td>
                      </tr>
                      <tr className='border-b border-sky-100'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          2023 - 18 June 2025
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Only on V3
                        </td>
                        <td className='border-r border-sky-200 px-3 py-2'>
                          Available on both V2 and V3
                        </td>
                        <td className='px-3 py-2'>
                          Available on both V2 and V3
                        </td>
                      </tr>
                      <tr className='bg-emerald-50'>
                        <td className='border-r border-sky-200 px-3 py-2 font-medium'>
                          After 18 June 2025
                        </td>
                        <td
                          colSpan={3}
                          className='border-r border-sky-200 px-3 py-2'
                        >
                          V2 portal officially discontinued. All filings are now
                          exclusively available on V3.
                        </td>
                        {/* <td className='border-r border-sky-200 px-3 py-2'>
                          Only on V3
                        </td>
                        <td className='px-3 py-2'>Only on V3</td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MCAUpdateBanner;
