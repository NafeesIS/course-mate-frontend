'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'sonner';

export default function ContactDetails() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const phoneNumber = '+918104946419';
  const email = 'helpdesk@filesure.in';

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'phone') setCopiedPhone(true);
      else setCopiedEmail(true);
      toast.success(`Copied Successfully`);
      setTimeout(() => {
        if (type === 'phone') setCopiedPhone(false);
        else setCopiedEmail(false);
      }, 2000);
    });
  };

  return (
    <div className='mx-auto mt-6 w-full max-w-4xl px-4'>
      <div className='grid grid-cols-1 gap-8 text-center md:grid-cols-3'>
        {/* Phone Section */}
        <div className='flex flex-col items-center'>
          <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-muted-foreground'>
            <Phone className='size-6 text-primary-foreground' />
          </div>
          <h3 className='mb-2 text-base font-bold uppercase'>Phone</h3>
          <p className='mb-2 text-sm text-muted-foreground'>+918104946419</p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => (window.location.href = `tel:+918104946419`)}
            >
              Call Us
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => copyToClipboard('+918104946419', 'phone')}
            >
              {copiedPhone ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>

        {/* Email Section */}
        <div className='flex flex-col items-center'>
          <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-muted-foreground'>
            <Mail className='size-6 text-primary-foreground' />
          </div>
          <h3 className='mb-2 text-base font-bold uppercase'>Email</h3>
          <p className='mb-2 text-sm text-muted-foreground'>{email}</p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => (window.location.href = `mailto:${email}`)}
            >
              Email Us
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => copyToClipboard(email, 'email')}
            >
              {copiedEmail ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>

        {/* WhatsApp Section */}
        <div className='flex flex-col items-center'>
          <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-muted-foreground'>
            <FaWhatsapp className='size-6 text-primary-foreground' />
          </div>
          <h3 className='mb-2 text-base font-bold uppercase'>WhatsApp</h3>
          <p className='mb-2 text-sm text-muted-foreground'>
            Chat with Support
          </p>
          <Button
            className='bg-[#25D366] text-white hover:bg-[#128C7E]'
            size='sm'
            onClick={() =>
              window.open(
                `https://wa.me/${phoneNumber.replace('+', '')}`,
                '_blank'
              )
            }
          >
            Open WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
