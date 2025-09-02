'use client';

import { FinancialDataLeadForm } from '@/components/shared/LeadForm/FinDataLeadForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart2,
  CalendarDays,
  Coins,
  Lock,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function CapitalStructureTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const offerItems = [
    {
      icon: <BarChart2 className='h-4 w-4 text-blue-500' />,
      title: 'Detailed Analytics',
    },
    {
      icon: <PieChart className='h-4 w-4 text-green-500' />,
      title: 'Ownership Breakdown',
    },
    {
      icon: <TrendingUp className='h-4 w-4 text-purple-500' />,
      title: 'Valuation Trends',
    },
    {
      icon: <Coins className='h-4 w-4 text-yellow-500' />,
      title: 'Investment Returns',
    },
  ];

  return (
    <div>
      <div>
        <h2 className='text-lg font-bold md:text-xl'>
          Funding and Capital Structure Insights
        </h2>
        <p className='mt-4 text-balance text-xs leading-relaxed text-gray-700 md:text-sm'>
          Visualize your company&apos;s evolution from founding to funding
          rounds. Our capital structure analysis tool reveals key insights into
          ownership changes, valuation jumps, and investor returns. Understand
          how each round impacts your stake and guides your next strategic move.
        </p>
      </div>

      <div className='relative mt-6 overflow-hidden rounded-lg border'>
        <Table className='w-full border-collapse'>
          <TableHeader>
            <TableRow className='bg-gradient-to-br from-blue-100 to-blue-50'>
              <TableHead
                rowSpan={2}
                className='whitespace-nowrap border text-foreground'
              >
                <Users className='mr-1 inline size-4' /> Name
              </TableHead>
              <TableHead
                colSpan={4}
                className='whitespace-nowrap border text-center text-xs font-bold text-foreground'
              >
                CAPITAL STRUCTURE BEFORE THIS ROUND
              </TableHead>
              <TableHead
                colSpan={3}
                className='whitespace-nowrap border text-center text-xs font-bold text-foreground'
              >
                CAPITAL STRUCTURE AFTER THIS ROUND
              </TableHead>
              <TableHead
                rowSpan={2}
                className=' whitespace-nowrap border text-foreground'
              >
                Amount Invested
              </TableHead>
              <TableHead
                rowSpan={2}
                className=' whitespace-nowrap border text-foreground'
              >
                % Return
              </TableHead>
            </TableRow>

            <TableRow className='bg-blue-50'>
              <TableHead className='flex items-center gap-1  whitespace-nowrap border text-foreground'>
                <CalendarDays className='size-4' /> Date
              </TableHead>
              <TableHead className='whitespace-nowrap border text-foreground'>
                Nos
              </TableHead>
              <TableHead className='whitespace-nowrap border text-foreground'>
                % Stake Pre
              </TableHead>
              <TableHead className='whitespace-nowrap border text-foreground'>
                Last valuation
              </TableHead>
              <TableHead className='whitespace-nowrap border text-foreground'>
                Nos
              </TableHead>
              <TableHead className='whitespace-nowrap border text-foreground'>
                % Stake Post
              </TableHead>
              <TableHead className='whitespace-nowrap border text-foreground'>
                Post Valuation
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='relative'>
            <TableRow className='absolute inset-0'>
              <TableCell colSpan={10} className='h-full'>
                <div className='absolute inset-0 z-10 bg-white/60 backdrop-blur-sm'></div>

                {/* CTA - Access Details */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant='default'
                      size='lg'
                      className='absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 gap-2 ring-4'
                    >
                      <Lock className='mr-2 h-5 w-5' />
                      Unlock Detailed Insights
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='p-4 sm:max-w-[800px] md:p-8'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div>
                        <h3 className='mb-2 text-2xl font-bold text-gray-800'>
                          Unlock Funding Details
                        </h3>
                        <Separator className='my-4' />
                        <p className='mb-4 hidden text-gray-600 md:block'>
                          Gain access to company&apos;s capital structure,
                          funding rounds, and investor dynamics that will
                          empower your strategic decisions and drive your
                          company&apos;s growth.
                        </p>
                        <ul className='hidden flex-wrap gap-4 md:flex'>
                          {offerItems.map((item, index) => (
                            <li
                              key={index}
                              className='flex items-center space-x-3 rounded-lg bg-gray-50 p-3'
                            >
                              {item.icon}
                              <span className='text-xs font-medium text-gray-700'>
                                {item.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='space-y-4'>
                        <FinancialDataLeadForm
                          source='company page funding details cta'
                          serviceTypes={['Funding Details']}
                          onSuccessfulSubmission={() => setIsModalOpen(false)}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className='hover:bg-blue-50'>
                <TableCell className='border border-blue-100'>
                  ********
                </TableCell>
                <TableCell className='border border-blue-100'>
                  **/**/****
                </TableCell>
                <TableCell className='border border-blue-100'>****</TableCell>
                <TableCell className='border border-blue-100'>**.**%</TableCell>
                <TableCell className='border border-blue-100'>
                  ₹******
                </TableCell>
                <TableCell className='border border-blue-100'>****</TableCell>
                <TableCell className='border border-blue-100'>**.**%</TableCell>
                <TableCell className='border border-blue-100'>
                  ₹******
                </TableCell>
                <TableCell className='border border-blue-100'>
                  ₹******
                </TableCell>
                <TableCell className='border border-blue-100'>**.**%</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className='bg-gradient-to-r from-blue-100 to-indigo-100'>
              <TableCell className='border border-blue-200 font-bold'>
                Total
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'></TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                *****
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                **.**%
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                ₹******
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                ****
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                **.**%
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                ₹******
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                ****
              </TableCell>
              <TableCell className='border border-blue-200 blur-sm'>
                **.**%
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
