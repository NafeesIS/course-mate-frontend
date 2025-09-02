'use client';

import { Switch } from '@/components/ui/switch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function FeaturedToggle({
  isFeatured,
}: {
  isFeatured: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isFeaturedState, setIsFeaturedState] = useState(isFeatured);

  const toggleFeatured = () => {
    const newFeaturedState = !isFeaturedState;
    setIsFeaturedState(newFeaturedState);

    startTransition(() => {
      // Extract the current path segments after /docs/categories/
      const pathSegments = pathname.split('/').filter(Boolean);
      const categoriesIndex = pathSegments.indexOf('categories');

      if (categoriesIndex === -1) return;

      // Get the slug parts (everything after /docs/categories/)
      let slugParts = pathSegments.slice(categoriesIndex + 1);

      // Remove 'featured' if it exists at the end
      if (slugParts[slugParts.length - 1] === 'featured') {
        slugParts = slugParts.slice(0, -1);
      }

      // Add 'featured' if the new state is true
      if (newFeaturedState) {
        slugParts.push('featured');
      }

      // Construct the new path
      const newPath = `/docs/categories/${slugParts.join('/')}`;

      // Preserve existing search params and reset page to 1
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');

      const finalUrl = `${newPath}?${params.toString()}`;

      router.push(finalUrl);
    });
  };

  return (
    <div className='flex items-center gap-3'>
      <p className='text-xs font-semibold md:text-sm'>Featured Only</p>
      <Switch
        checked={isFeaturedState}
        onCheckedChange={toggleFeatured}
        disabled={isPending}
        className={`transition-colors duration-300 ease-in-out ${isPending ? 'opacity-70' : ''}`}
      />
    </div>
  );
}
