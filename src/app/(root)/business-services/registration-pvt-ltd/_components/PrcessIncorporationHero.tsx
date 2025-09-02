import { ArrowFrameSvg } from '../_data/PLCSvg';

const PrcessIncorporationHero = () => {
  const handleScrollToStep = (stepId: any) => {
    const element = document.getElementById(stepId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className='no-scrollbar mx-auto my-auto flex min-h-[170px] w-full max-w-[99%] items-center gap-8 overflow-scroll pl-6 xl:max-w-full xl:gap-1 xl:overflow-hidden xl:pl-3'>
      <div
        className='group relative z-10 flex max-h-[130px] min-h-[130px] w-full min-w-[145px] max-w-[145px] cursor-pointer items-center justify-center xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[170px] xl:max-w-[170px]'
        onClick={() => handleScrollToStep('step-1')}
      >
        <ArrowFrameSvg />
        <div className='absolute inset-0 mt-1 flex max-h-[130px] min-h-[130px] w-full min-w-[131px] max-w-[131px] -translate-x-2 items-start justify-center xl:mt-2 xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[168px] xl:max-w-[168px]'>
          <div className='flex flex-col items-center justify-center bg-transparent'>
            <div className='mx-auto my-auto flex max-h-[150px] max-w-28 flex-col items-center justify-center gap-4'>
              <p className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-center text-base text-white duration-200 group-hover:bg-midnight-blue'>
                1
              </p>
              <p className='text-xs font-semibold text-black lg:text-sm'>
                Part A of SPICe + Form
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='group relative z-[9] flex max-h-[130px] min-h-[130px] w-full min-w-[145px] max-w-[145px] cursor-pointer items-center justify-center xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[170px] xl:max-w-[170px]'
        onClick={() => handleScrollToStep('step-2')}
      >
        <ArrowFrameSvg />
        <div className='absolute inset-0 mt-1 flex max-h-[130px] min-h-[130px] w-full min-w-[131px] max-w-[131px] -translate-x-2 items-start justify-center xl:mt-2 xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[168px] xl:max-w-[168px]'>
          <div className='flex flex-col items-center justify-center bg-transparent'>
            <div className='mx-auto my-auto flex max-h-[150px] max-w-28 flex-col items-center justify-center gap-4'>
              <p className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-center text-base text-white duration-200 group-hover:bg-midnight-blue'>
                2
              </p>
              <p className='text-xs font-semibold text-black lg:text-sm'>
                Part B of SPICe + Form
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='group relative z-[8] flex max-h-[130px] min-h-[130px] w-full min-w-[145px] max-w-[145px] cursor-pointer items-center justify-center xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[170px] xl:max-w-[170px]'
        onClick={() => handleScrollToStep('step-3')}
      >
        <ArrowFrameSvg />
        <div className='absolute inset-0 mt-1 flex max-h-[130px] min-h-[130px] w-full min-w-[131px] max-w-[131px] -translate-x-2 items-start justify-center xl:mt-2 xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[168px] xl:max-w-[168px]'>
          <div className='flex flex-col items-center justify-center bg-transparent'>
            <div className='mx-auto my-auto flex max-h-[150px] max-w-28 flex-col items-center justify-center gap-4'>
              <p className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-center text-base text-white duration-200 group-hover:bg-midnight-blue'>
                3
              </p>
              <p className='text-xs font-semibold text-black lg:text-sm'>
                INC-33 Memorandum of Association (MOA)
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='group relative z-[7] flex max-h-[130px] min-h-[130px] w-full min-w-[145px] max-w-[145px] cursor-pointer items-center justify-center xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[170px] xl:max-w-[170px]'
        onClick={() => handleScrollToStep('step-4')}
      >
        <ArrowFrameSvg />
        <div className='absolute inset-0 mt-1 flex max-h-[130px] min-h-[130px] w-full min-w-[131px] max-w-[131px] -translate-x-2 items-start justify-center xl:mt-2 xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[168px] xl:max-w-[168px]'>
          <div className='flex flex-col items-center justify-center bg-transparent'>
            <div className='mx-auto my-auto flex max-h-[150px] max-w-28 flex-col items-center justify-center gap-4'>
              <p className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-center text-base text-white duration-200 group-hover:bg-midnight-blue'>
                4
              </p>
              <p className='text-xs font-semibold text-black lg:text-sm'>
                INC-34 Article of Association (AOA)
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='group relative z-[6] flex max-h-[130px] min-h-[130px] w-full min-w-[145px] max-w-[145px] cursor-pointer items-center justify-center xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[170px] xl:max-w-[170px]'
        onClick={() => handleScrollToStep('step-5')}
      >
        <ArrowFrameSvg />
        <div className='absolute inset-0 mt-1 flex max-h-[130px] min-h-[130px] w-full min-w-[131px] max-w-[131px] -translate-x-2 items-start justify-center xl:mt-2 xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[168px] xl:max-w-[168px]'>
          <div className='flex flex-col items-center justify-center bg-transparent'>
            <div className='mx-auto my-auto flex max-h-[150px] max-w-28 flex-col items-center justify-center gap-4'>
              <p className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-center text-base text-white duration-200 group-hover:bg-midnight-blue'>
                5
              </p>
              <p className='text-xs font-semibold text-black lg:text-sm'>
                INC-35 Agile Pro
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='group relative z-[5] flex max-h-[130px] min-h-[130px] w-full min-w-[145px] max-w-[145px] cursor-pointer items-center justify-center xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[170px] xl:max-w-[170px]'
        onClick={() => handleScrollToStep('step-6')}
      >
        <ArrowFrameSvg />
        <div className='absolute inset-0 mt-1 flex max-h-[130px] min-h-[130px] w-full min-w-[131px] max-w-[131px] -translate-x-2 items-start justify-center xl:mt-2 xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[168px] xl:max-w-[168px]'>
          <div className='flex flex-col items-center justify-center bg-transparent'>
            <div className='mx-auto my-auto flex max-h-[150px] max-w-28 flex-col items-center justify-center gap-4'>
              <p className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-center text-base text-white duration-200 group-hover:bg-midnight-blue'>
                6
              </p>
              <p className='text-xs font-semibold text-black lg:text-sm'>
                INC-9 Declaration by all Subscribers & first Directors
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='group relative flex max-h-[130px] min-h-[130px] w-full min-w-[145px] max-w-[145px] -translate-x-3 cursor-pointer items-center justify-center xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[170px] xl:max-w-[170px]'
        onClick={() => handleScrollToStep('step-7')}
      >
        <svg
          className='absolute'
          xmlns='http://www.w3.org/2000/svg'
          width='169'
          height='162'
          viewBox='0 0 169 162'
          fill='none'
        >
          <mask id='path-1-inside-1_745_5996' fill='white'>
            <path d='M0.445312 7.08806C0.445312 3.1733 3.61885 -0.000244141 7.53362 -0.000244141H161.768C165.683 -0.000244141 168.857 3.1733 168.857 7.08806V154.661C168.857 158.576 165.683 161.75 161.768 161.75H7.53363C3.61886 161.75 0.445312 158.576 0.445312 154.661V7.08806Z' />
          </mask>
          <path
            d='M0.445312 7.08806C0.445312 3.1733 3.61885 -0.000244141 7.53362 -0.000244141H161.768C165.683 -0.000244141 168.857 3.1733 168.857 7.08806V154.661C168.857 158.576 165.683 161.75 161.768 161.75H7.53363C3.61886 161.75 0.445312 158.576 0.445312 154.661V7.08806Z'
            fill='white'
          />
          <path
            d='M7.53362 3.54391H161.768V-3.5444H7.53362V3.54391ZM165.313 7.08806V154.661H172.401V7.08806H165.313ZM161.768 158.206H7.53363V165.294H161.768V158.206ZM3.98946 154.661V7.08806H-3.09884V154.661H3.98946ZM7.53363 158.206C5.57624 158.206 3.98946 156.619 3.98946 154.661H-3.09884C-3.09884 160.534 1.66149 165.294 7.53363 165.294V158.206ZM165.313 154.661C165.313 156.619 163.726 158.206 161.768 158.206V165.294C167.641 165.294 172.401 160.534 172.401 154.661H165.313ZM161.768 3.54391C163.726 3.54391 165.313 5.13068 165.313 7.08806H172.401C172.401 1.21591 167.641 -3.5444 161.768 -3.5444V3.54391ZM7.53362 -3.5444C1.66147 -3.5444 -3.09884 1.21591 -3.09884 7.08806H3.98946C3.98946 5.13068 5.57623 3.54391 7.53362 3.54391V-3.5444Z'
            fill='#0076CE'
            mask='url(#path-1-inside-1_745_5996)'
          />
        </svg>
        <div className='absolute inset-0 mt-1 flex max-h-[130px] min-h-[130px] w-full min-w-[131px] max-w-[131px] items-start justify-center xl:mt-2 xl:max-h-[150px] xl:min-h-[150px] xl:min-w-[168px] xl:max-w-[168px]'>
          <div className='flex flex-col items-center justify-center bg-transparent'>
            <div className='mx-auto my-auto flex max-h-[150px] max-w-28 flex-col items-center justify-center gap-4'>
              <p className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-center text-base text-white duration-200 group-hover:bg-midnight-blue'>
                7
              </p>
              <p className='text-xs font-semibold text-black lg:text-sm'>
                Signed Forms and payment of Government Fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrcessIncorporationHero;
