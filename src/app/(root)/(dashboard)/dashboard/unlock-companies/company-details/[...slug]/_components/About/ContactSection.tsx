import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactSectionProps {
  email: string;
  website: string;
  address?: {
    registeredAddress?: string;
    city?: string;
    pinCode?: string;
    addressType?: string;
  };
}

export function ContactSection({
  //   email,
  //   website,
  address,
}: ContactSectionProps) {
  if (!address || !address.registeredAddress) return null;
  return (
    <Card>
      <CardHeader className='p-4 md:p-6'>
        <CardTitle>Registered Address</CardTitle>
      </CardHeader>
      <CardContent className='p-4 pt-0 md:p-6 md:pt-0'>
        <p className='text-xs md:text-sm'>{address.registeredAddress}</p>
      </CardContent>
    </Card>
  );
}
