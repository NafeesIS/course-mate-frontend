import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RiDownload2Line } from 'react-icons/ri';
import DownLoadNCASampleFile from './DownLoadNCASampleFile';

const DownloadSampleFileDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant='gooeyLeft'
          className='flex items-center justify-center gap-2 border border-nca-primary-blue bg-transparent px-7 text-center text-nca-primary-blue hover:bg-nca-primary-blue hover:text-white sm:px-8'
        >
          <RiDownload2Line className='min-w-4 text-sm text-nca-primary-blue md:text-base' />{' '}
          <span className='font-semibold'> Download Sample File</span>
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className='text-center text-xl font-semibold text-black'>
              Download Sample File
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>

        <DownLoadNCASampleFile setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default DownloadSampleFileDialog;
