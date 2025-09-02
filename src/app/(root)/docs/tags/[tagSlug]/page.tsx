import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import type { Doc } from '../../_types/types';
import TagDocsPage from './_component/TagDocsPage';
import { getAllTags, getDocsByTag } from './_services/services';
const fallbackImageUrl =
  'https://filesurestorage.blob.core.windows.net/docs-images/1b369c5e-74d4-465b-bd07-c9d562a59e8d.png?sp=rcwd&st=2025-07-07T06:06:41Z&se=2027-07-07T14:06:41Z&spr=https&sv=2024-11-04&sr=c&sig=efzd7UgWsxZA4s35aLVNICl4OKSYw36ubXi1PxReJLQ%3D';
// --- SEO METADATA GENERATION ---
export async function generateMetadata({
  params,
}: {
  params: { tagSlug: string };
}) {
  const tags = await getAllTags();
  const keywords = tags.map((tag) => tag.name);
  const { tagSlug } = params;

  // 1. "All" page: show all docs/tags SEO
  if (tagSlug === 'all') {
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

  // 2. Tag page: try to find the tag
  const tag = tags.find((t) => t.slug === tagSlug);

  // 3. Invalid tag: set SEO for "Tag Not Found" (noindex)
  if (!tag) {
    return {
      title: 'Explore All tags | Filesure Docs',
      description:
        'Explore Filesure documentation: product guides, troubleshooting tips, API references, and best practices to get the most out of Filesure.',
      robots: { index: false, follow: false },
    };
  }

  // 4. Tag found: set tag-specific SEO
  const { data: docs } = await getDocsByTag(tag._id, 1, 6);
  const title = `${tag.name} Documentation | Filesure Docs`;
  const description = docs.length
    ? `Explore ${docs.length} documentation articles for ${tag.name} on Filesure.`
    : `No documentation found for ${tag.name} on Filesure.`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${BASE_URL_FRONTEND}/docs/tags/${tag.slug}`,
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
      canonical: `${BASE_URL_FRONTEND}/docs/tags/${tag.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

// --- MAIN PAGE COMPONENT ---
const AllTagsPage = async ({
  params,
  searchParams,
}: {
  params: { tagSlug: string };
  searchParams: { page?: string; perPage?: string };
}) => {
  const tags = await getAllTags();
  const { tagSlug } = params;
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = parseInt(searchParams.perPage || '6', 10);

  let docs: Doc[] = [];
  let paginationData: any = null;

  // 1. "All" page: show all docs
  if (tagSlug === 'all') {
    const { data, meta } = await getDocsByTag(undefined, page, perPage);
    docs = data;
    paginationData = meta;

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
        image:
          doc.headerImageId?.url || doc.thumbnailId?.url || fallbackImageUrl,
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
        <HeroWrapper className='h-14 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 md:h-16'>
          <div></div>
        </HeroWrapper>
        <TagDocsPage
          params={params}
          searchParams={searchParams}
          tags={tags}
          docs={docs}
          paginationData={paginationData}
        />
      </div>
    );
  }

  // 2. Tag page: try to find the tag
  const tag = tags.find((t) => t.slug === tagSlug);

  // 3. Invalid tag: show not found message
  if (!tag) {
    return (
      <div className='mx-auto mt-20 max-w-96 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-12 text-center lg:mt-24 lg:px-8 lg:py-16'>
        <div className='mx-auto max-w-md'>
          <div className='mb-4 text-4xl'>📄</div>
          <p className='m-0 text-lg text-slate-500'>
            No documents found for this.
          </p>
          <p className='mt-2 text-sm text-slate-400'>
            Try selecting a different tag or check back later.
          </p>
        </div>
      </div>
    );
  }

  // 4. Tag found: show tag docs
  const { data, meta } = await getDocsByTag(tag._id, page, perPage);
  docs = data;
  paginationData = meta;

  // JSON-LD for tag docs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tag.name} Documentation`,
    description: `All documentation and guides related to ${tag.name} on Filesure.`,
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
      <HeroWrapper className='h-14 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 md:h-16'>
        <div></div>
      </HeroWrapper>
      <TagDocsPage
        params={params}
        searchParams={searchParams}
        tags={tags}
        docs={docs}
        paginationData={paginationData}
      />
    </div>
  );
};

export default AllTagsPage;
