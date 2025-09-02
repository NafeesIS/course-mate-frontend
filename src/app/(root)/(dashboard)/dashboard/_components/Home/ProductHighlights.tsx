import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Building, FileSearch, UserRound } from 'lucide-react';
import Link from 'next/link';

const products = [
  {
    name: 'Unlock Companies',
    icon: Building,
    href: '/dashboard/unlock-companies',
  },
  {
    name: 'Director Contacts',
    icon: UserRound,
    href: '/dashboard/director-contacts',
  },
  { name: 'New Company Alerts', icon: Bell, href: '/new-company-alert' },
  { name: 'Advanced Search', icon: FileSearch, href: '/search' },
];

export default function ProductHighlights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          {products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className='flex items-center rounded-lg p-2 hover:bg-gray-100'
            >
              <product.icon className='mr-2 h-6 w-6 text-blue-500' />
              <span className='text-sm font-medium'>{product.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
