'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FILESURE_SUPPORT_EMAIL } from '@/constants';

const ContactForm = () => {
  const generateMailToLink = (form: {
    name: string;
    email: string;
    message: string;
  }) => {
    const recipientEmail = FILESURE_SUPPORT_EMAIL; // Email to receive the message
    const subject = 'Contact Form Submission'; // Default email subject
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`;

    return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Card className='rounded-md'>
      <CardHeader className='gap-1.5 pb-4'>
        <CardTitle className='text-2xl font-medium md:text-3xl'>
          <strong>Send A</strong> Message
        </CardTitle>
        <p className='text-sm  opacity-90'>
          Fill out the form below and we&apos;ll get back to you as soon as
          possible.
        </p>
      </CardHeader>
      <CardContent>
        <form
          className='space-y-4 border-t pt-4'
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement; // Cast to HTMLFormElement
            const formData = {
              name: (form.elements.namedItem('name') as HTMLInputElement).value,
              email: (form.elements.namedItem('email') as HTMLInputElement)
                .value,
              message: (
                form.elements.namedItem('message') as HTMLTextAreaElement
              ).value,
            };
            const mailToLink = generateMailToLink(formData);
            window.location.href = mailToLink; // Opens the user's email client
          }}
        >
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-1'>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' name='name' placeholder='Your name' required />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                placeholder='Your email address'
                type='email'
                required
              />
            </div>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              name='message'
              placeholder='Your message'
              required
            />
          </div>
          <Button className='w-full' type='submit' variant='default'>
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
