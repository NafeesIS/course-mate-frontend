import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { BASE_URL_FRONTEND } from '@/constants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, Edit, ExternalLink, Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DocWithHome } from './HomeDocsManager';

function DocumentCard({
  doc,
  onToggleHomepage,
}: {
  doc: DocWithHome;
  // eslint-disable-next-line no-unused-vars
  onToggleHomepage: (doc: DocWithHome, value: boolean) => Promise<void>;
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggleHomepage(doc, checked);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        doc.isHomepage ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
      )}
    >
      <CardContent className='p-4'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <h3 className='text-sm font-medium text-gray-900 md:truncate md:text-base'>
                {doc.status === 'published' ? (
                  <Link
                    href={`${BASE_URL_FRONTEND}/docs/${(doc as any).categoryId?.slug}/${doc.slug}`}
                    className='flex items-center gap-1 hover:text-blue-600'
                  >
                    {doc.title}
                    <ExternalLink className='hidden h-3 w-3 md:block' />
                  </Link>
                ) : (
                  doc.title
                )}
              </h3>
              <Badge
                variant={doc.status === 'published' ? 'default' : 'secondary'}
                className={cn(
                  'hidden md:block',
                  doc.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                )}
              >
                {doc.status}
              </Badge>
            </div>

            <p className='mb-3 hidden text-xs text-muted-foreground md:block md:text-sm'>
              /{doc.slug}
            </p>

            <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <Calendar className='h-3 w-3' />
                Updated {format(new Date(doc.updatedAt), 'MMM dd, yyyy')}
              </div>
              {doc.isHomepage && (
                <Badge
                  variant='outline'
                  className='whitespace-nowrap border-green-200 bg-green-50 text-green-700'
                >
                  <Home className='mr-1 h-3 w-3' />
                  On Homepage
                </Badge>
              )}
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='flex flex-col items-center gap-1'>
              <Switch
                checked={!!doc.isHomepage}
                onCheckedChange={handleToggle}
                disabled={isToggling}
              />
              <span className='hidden text-xs text-muted-foreground sm:block'>
                {doc.isHomepage ? 'Visible' : 'Hidden'}
              </span>
            </div>

            <Link
              href={`/dashboard/admin/docs-management/update-docs/${doc.slug}`}
            >
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <Edit className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentCard;
