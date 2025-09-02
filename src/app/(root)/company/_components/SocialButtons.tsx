'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import {
  RiFacebookLine,
  RiLink,
  RiMailSendLine,
  RiShareLine,
  RiTwitterXLine,
  RiWhatsappLine,
} from 'react-icons/ri';

import { BASE_URL_FRONTEND } from '@/constants';

const SocialButtons = ({
  pathname,
  name,
  about,
  activeTab,
  mobile = false,
}: {
  pathname: string;
  name: string;
  about: string;
  activeTab?: string;
  mobile?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sharableUrl = `${BASE_URL_FRONTEND}${pathname}${activeTab ? `?tab=${activeTab}` : ''}`;

  const openWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${name} | FileSure \n${sharableUrl}`)}`;
    openWindow(url);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharableUrl)}&quote=${encodeURIComponent(about)}&hashtag=${encodeURIComponent(`#${name} #FileSure`)}`;
    openWindow(url);
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${name} | FileSure`)}&url=${encodeURIComponent(sharableUrl)}`;
    openWindow(url);
  };

  const shareOnEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(`${name} | FileSure`)}&body=${encodeURIComponent(`${about} \n\nFor more details: ${sharableUrl}`)}`;
    openWindow(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(sharableUrl)
      .then(() => {
        alert('Link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const shareOptions = [
    { title: 'Whatsapp', icon: RiWhatsappLine, onClick: shareOnWhatsApp },
    { title: 'Facebook', icon: RiFacebookLine, onClick: shareOnFacebook },
    { title: 'Twitter', icon: RiTwitterXLine, onClick: shareOnTwitter },
    { title: 'Email', icon: RiMailSendLine, onClick: shareOnEmail },
    { title: 'Copy Link', icon: RiLink, onClick: copyToClipboard },
  ];

  if (mobile) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            title='Share'
            variant='outline'
            size='sm'
            className='flex-center h-8 gap-2 px-2 text-primary ring-1 ring-primary hover:text-primary'
          >
            <RiShareLine className='size-4' />
            {/* Share */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {shareOptions.map((option) => (
            <DropdownMenuItem key={option.title} onSelect={option.onClick}>
              <option.icon className='mr-2 size-4' />
              {option.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      {shareOptions.map((option) => (
        <Button
          key={option.title}
          title={option.title}
          variant='outline'
          size='sm'
          className='flex-center h-7 gap-2 px-1.5 text-primary ring-1 ring-primary hover:text-primary md:h-8 md:px-2'
          onClick={option.onClick}
        >
          <option.icon className='size-4' />
        </Button>
      ))}
    </>
  );
};

export default SocialButtons;
