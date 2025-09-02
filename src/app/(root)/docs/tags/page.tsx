// import AllTagsPage from '../../tags/[tagSlug]/page';

import { BASE_URL_FRONTEND } from '@/constants';
import { Doc } from '../_types/types';
import { getAllTags, getDocsByTag } from './[tagSlug]/_services/services';
import AllTagsPage from './[tagSlug]/page';

const fallbackImageUrl =
  'https://filesurestorage.blob.core.windows.net/docs-images/1b369c5e-74d4-465b-bd07-c9d562a59e8d.png?sp=rcwd&st=2025-07-07T06:06:41Z&se=2027-07-07T14:06:41Z&spr=https&sv=2024-11-04&sr=c&sig=efzd7UgWsxZA4s35aLVNICl4OKSYw36ubXi1PxReJLQ%3D';

export async function generateMetadata() {
  const tags = await getAllTags();
  const keywords = tags.map((tag) => tag.name);

  const { data: docs } = await getDocsByTag(undefined, 1, 6);
  return {
    title: 'All Tags Documentation | Filesure Docs',
    description: docs.length
      ? `Explore ${docs.length} documentation articles on Filesure.`
      : `No documentation found on Filesure.`,
    keywords,
    openGraph: {
      title: 'All Documentation | Filesure Docs',
      description: `Browse all documentation articles and guides on Filesure. Find help, troubleshooting, and how-to guides for every topic.`,
      url: `${BASE_URL_FRONTEND}/docs/tags/all`,
      type: 'website',
      images: docs
        .filter((doc) => doc.headerImageId?.url || doc.thumbnailId?.url)
        .map((doc) => ({
          url: doc.headerImageId?.url || doc.thumbnailId?.url,
          width: 800,
          height: 800,
          alt: doc.title,
        })),
    },
    alternates: {
      canonical: `${BASE_URL_FRONTEND}/docs/tags/all`,
    },
    robots: { index: true, follow: true },
  };
}

const page = async () => {
  const params = { tagSlug: 'all' };
  const searchParams = { page: '1', perPage: '6' };
  let docs: Doc[] = [];

  const { data } = await getDocsByTag(undefined, 1, 6);
  docs = data;

  // JSON-LD for all docs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Documentation',
    description: 'Browse all documentation articles and guides on Filesure.',
    mainEntity: docs.map((doc: Doc) => ({
      '@type': 'Article',
      headline: doc.title,
      description: doc.metaDescription || doc.excerpt,
      url: `${BASE_URL_FRONTEND}/docs/${doc.categoryId.slug}/${doc.slug}`,
      image: doc.headerImageId?.url || doc.thumbnailId?.url || fallbackImageUrl,
      author: {
        '@type': 'Person',
        name:
          doc.authorId?.meta_data?.firstName &&
          doc.authorId?.meta_data?.lastName
            ? `${doc.authorId.meta_data.firstName} ${doc.authorId.meta_data.lastName}`
            : doc.authorId?.emails?.[0] || 'Unknown',
      },
      datePublished: doc.createdAt,
      dateModified: doc.updatedAt,
    })),
  };

  return (
    <div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AllTagsPage params={params} searchParams={searchParams} />
    </div>
  );
};

export default page;
