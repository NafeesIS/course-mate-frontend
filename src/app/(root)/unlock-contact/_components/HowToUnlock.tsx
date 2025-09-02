import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FaQuestionCircle } from 'react-icons/fa'; // Play Icon
import { RiPlayCircleLine } from 'react-icons/ri';

const HowToUnlock = () => {
  return (
    <Dialog>
      {/* Main Button to Open Video Options */}
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='flex h-7 items-center justify-center rounded-lg bg-gradient-to-r from-teal-300 to-blue-300 text-[10px] text-foreground opacity-80 transition-all hover:text-foreground hover:opacity-100 lg:text-xs'
        >
          <FaQuestionCircle className='mr-2' /> {/* Query Icon */}
          How to Unlock Director Contacts
        </Button>
      </DialogTrigger>

      {/* Modal for Video Options */}
      <DialogContent className='max-w-xl rounded-lg bg-white px-4 py-10 shadow-lg md:p-10'>
        {/* Video 1: Unlocking Director's Contact */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='lg'
              className='justify-start bg-gray-100 px-2 text-[10px] text-blue-600 hover:bg-gray-200 hover:text-blue-600 md:w-full md:px-4 md:text-sm'
            >
              <RiPlayCircleLine className='mr-2 text-lg md:text-2xl' /> Watch
              How to Unlock Director&apos;s Contact
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-3xl overflow-hidden border-0 bg-muted-foreground p-0'>
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe
                width='560'
                height='315'
                src='https://www.youtube.com/embed/kl5OR6WV00g?si=zIXGM76D9oEDxlGn'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                }}
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>

        {/* Video 2: Using Bulk Contact Redemption Code */}
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='lg'
              className='w-full justify-start bg-gray-100 px-2 text-[10px] text-blue-600 hover:bg-gray-200 hover:text-blue-600 md:px-4 md:text-sm'
            >
              <RiPlayCircleLine className='mr-2 text-lg md:text-2xl' /> Watch
              How to Use Bulk Contact Redemption Code
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-3xl overflow-hidden border-0 bg-muted-foreground p-0'>
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe
                width='560'
                height='315'
                src='https://www.youtube.com/embed/ta-B1y3VMKo?si=C8Yz2O73jj41pVS_'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                }}
              ></iframe>
            </div>
          </DialogContent>
        </Dialog> */}

        {/* Video 3: Unlocking Director's Contact (Hindi) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='lg'
              className='justify-start bg-gray-100 px-2 text-[10px] text-blue-600 hover:bg-gray-200 hover:text-blue-600 md:w-full md:px-4 md:text-sm'
            >
              <RiPlayCircleLine className='mr-2 text-lg md:text-2xl' /> Watch
              How to Unlock Director&apos;s Contact (Hindi)
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-3xl overflow-hidden border-0 bg-muted-foreground p-0'>
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe
                width='560'
                height='315'
                src='https://www.youtube.com/embed/8NN9YWvlUro?si=Pz3iLWbHK_l8jm8j'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                }}
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>

        {/* Video 4: Using Bulk Contact Redemption Code (Hindi) */}
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='lg'
              className='w-full justify-start bg-gray-100 px-2 text-[10px] text-blue-600 hover:bg-gray-200 hover:text-blue-600 md:px-4 md:text-sm'
            >
              <RiPlayCircleLine className='mr-2 text-lg md:text-2xl' /> Watch
              How to Use Bulk Contact Redemption Code (Hindi)
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-3xl overflow-hidden border-0 bg-muted-foreground p-0'>
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe
                width='560'
                height='315'
                src='https://www.youtube.com/embed/sDyisoWtqv0?si=JnL6D4rlTjrktSXl'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                }}
              ></iframe>
            </div>
          </DialogContent>
        </Dialog> */}
      </DialogContent>
    </Dialog>
  );
};

export default HowToUnlock;
