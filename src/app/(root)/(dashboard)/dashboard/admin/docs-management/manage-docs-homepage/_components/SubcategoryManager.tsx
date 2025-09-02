import { ISubcategory } from '@/app/(root)/docs/_types/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateSubcategory } from '../../manage-subcategory/_services/services';

const SubcategoryManager = ({
  subcategories,
  onUpdate,
}: {
  subcategories: ISubcategory[];
  onUpdate: () => void;
}) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const homepageCount = subcategories.filter(
    (subcat) => subcat.isHomepage
  ).length;
  const handleToggle = async (subcat: ISubcategory, checked: boolean) => {
    if (checked && homepageCount >= 5) {
      toast.error(
        'The maximum limit has been reached. Please remove an existing document from the homepage section before adding a new one.',
        {
          duration: 20000, // 20 seconds
        }
      );
      return; // explicitly return void here
    }
    setUpdating(subcat._id);
    try {
      await updateSubcategory(subcat._id, undefined, undefined, checked);
      onUpdate();
      toast.success(
        `${subcat.name} ${checked ? 'added to' : 'removed from'} homepage`
      );
    } catch (err) {
      toast.error('Failed to update category');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className='max-h-[80vh] space-y-3 overflow-y-auto'>
      {subcategories.map((subcat) => (
        <Card
          key={subcat._id}
          className={cn(
            'transition-all duration-200',
            subcat.isHomepage
              ? 'border-green-200 bg-green-50/50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <CardContent className='flex items-center justify-between p-4'>
            <div className='flex-1'>
              <h4 className='font-medium text-gray-900'>{subcat.name}</h4>
              <p className='text-sm text-muted-foreground'>/{subcat.slug}</p>
            </div>
            <div className='flex items-center gap-3'>
              {subcat.isHomepage && (
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-700'
                >
                  <Home className='mr-1 h-3 w-3' />
                  Live
                </Badge>
              )}
              <Switch
                checked={!!subcat.isHomepage}
                onCheckedChange={(checked) => handleToggle(subcat, checked)}
                disabled={updating === subcat._id}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubcategoryManager;
