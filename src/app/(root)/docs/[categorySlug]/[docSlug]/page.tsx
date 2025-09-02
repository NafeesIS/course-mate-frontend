import HeroWrapper from '@/components/shared/HeroWrapper';
import { Button } from '@/components/ui/button';
import { BASE_URL_FRONTEND } from '@/constants';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ITag } from '../../_types/types';
import CommentSection from './_components/comments/CommentSection';
import DocDetailPage from './_components/DocDetailsPage';
import { getSingleDocDetails } from './_services/services';

export async function generateMetadata({
  params,
}: {
  params: { docSlug: string };
}) {
  const { docSlug } = params;
  const docData = await getSingleDocDetails(docSlug);

  if (!docData) {
    return {
      title: 'Document Not Found | Filesure Docs',
      description: 'This document could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${BASE_URL_FRONTEND}/docs/${docData.categoryId?.slug || 'category'}/${docData.slug}`;
  const imageUrl =
    docData.headerImageId?.url ||
    docData.thumbnailId?.url ||
    'https://filesurestorage.blob.core.windows.net/docs-images/1b369c5e-74d4-465b-bd07-c9d562a59e8d.png?sp=rcwd&st=2025-07-07T06:06:41Z&se=2027-07-07T14:06:41Z&spr=https&sv=2024-11-04&sr=c&sig=efzd7UgWsxZA4s35aLVNICl4OKSYw36ubXi1PxReJLQ%3D';

  return {
    title: docData.metaTitle || docData.title,
    description: docData.metaDescription || docData.excerpt,
    keywords: docData.tagIds?.map((tag: ITag) => tag.name).filter(Boolean),
    openGraph: {
      title: docData.metaTitle || docData.title,
      description: docData.metaDescription || docData.excerpt,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: docData.title,
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: { index: true, follow: true },
  };
}

const DocsDetailsPage = async ({ params }: { params: { docSlug: string } }) => {
  const { docSlug } = params;
  const docData = await getSingleDocDetails(docSlug);

  if (!docData) {
    return (
      <div className='mx-auto max-w-md'>
        <div className='mx-4 mt-32 max-w-96 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-12 text-center lg:px-8 lg:py-16'>
          <div className='mb-4 text-4xl'>📄</div>
          <p className='m-0 mb-6 text-lg'>This document could not be found.</p>
          <Button
            variant={'outline'}
            className='bg-primary text-white hover:bg-blue-900 hover:text-white'
          >
            <Link
              href='/docs/categories/all'
              className='flex items-center justify-center'
            >
              <BookOpen className='mr-2 h-4 w-4' />
              Explore our more docs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const fallbackImageUrl =
    'https://filesurestorage.blob.core.windows.net/docs-images/1b369c5e-74d4-465b-bd07-c9d562a59e8d.png?sp=rcwd&st=2025-07-07T06:06:41Z&se=2027-07-07T14:06:41Z&spr=https&sv=2024-11-04&sr=c&sig=efzd7UgWsxZA4s35aLVNICl4OKSYw36ubXi1PxReJLQ%3D';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: docData.metaTitle || docData.title,
    description: docData.metaDescription || docData.excerpt,
    image:
      docData.headerImageId?.url ||
      docData.thumbnailId?.url ||
      fallbackImageUrl,
    author: {
      '@type': 'Person',
      name:
        docData.authorId?.meta_data?.firstName &&
        docData.authorId?.meta_data?.lastName
          ? `${docData.authorId.meta_data.firstName} ${docData.authorId.meta_data.lastName}`
          : docData.authorId?.emails?.[0] || 'Unknown',
    },
    datePublished: docData.createdAt,
    dateModified: docData.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL_FRONTEND}/docs/${docData.categoryId?.slug || 'category'}/${docData.slug}`,
    },
  };

  return (
    <div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroWrapper>
        <div></div>
      </HeroWrapper>
      <div className='wrapper'>
        <DocDetailPage docData={docData} />
        <CommentSection docId={docData._id} docData={docData} />
      </div>
    </div>
  );
};

export default DocsDetailsPage;
