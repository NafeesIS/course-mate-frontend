import HeroWrapper from '@/components/shared/HeroWrapper';
import { BASE_URL_FRONTEND } from '@/constants';
import type { Doc } from '../../_types/types';
import CategoryDocs from './_components/CategoryDocs';
import {
  getAllCategories,
  getDocsByCategorySubcategory,
  getSubcategoriesByCategory,
} from './_services/services';

const fallbackImageUrl =
  'https://filesurestorage.blob.core.windows.net/docs-images/1b369c5e-74d4-465b-bd07-c9d562a59e8d.png?sp=rcwd&st=2025-07-07T06:06:41Z&se=2027-07-07T14:06:41Z&spr=https&sv=2024-11-04&sr=c&sig=efzd7UgWsxZA4s35aLVNICl4OKSYw36ubXi1PxReJLQ%3D';
// --- SEO METADATA GENERATION ---
export async function generateMetadata({
  params,
}: {
  params: { categorySlug: string };
}) {
  const allCategoriesData = await getAllCategories();

  // Extract categories array safely
  const categories = (allCategoriesData?.categories || []).filter(
    (cat) => cat._id.toString() !== '68a19bb4b09c3b367367f7bc'
  );
  const keywords = categories.map((category) => category.name);
  const { categorySlug } = params;

  // 1. "All" page: show all docs/categories SEO
  if (categorySlug[0] === 'all') {
    const { data: docs } = await getDocsByCategorySubcategory({
      page: 1,
      limit: 6,
    });
    // Get up to 3 category names or metaDescriptions for brevity
    const categorySnippets = categories
      .map((cat) => cat.metaDescription || cat.description || cat.name)
      .filter(Boolean)
      .slice(0, 3);

    const categoryList = categorySnippets.join(', ');

    const description = categoryList
      ? `Browse documentation for ${categoryList}${categories.length > 3 ? ', and more' : ''} on Filesure. Explore ${docs.length} expert-written articles and guides.`
      : docs.length > 0
        ? `Explore ${docs.length} expert-written documentation articles and guides on Filesure.`
        : `No documentation found on Filesure. Check back soon for new guides and resources.`;

    return {
      title: 'All Categories Documentation | Filesure Docs',
      description,
      keywords,
      openGraph: {
        title: 'All Documentation | Filesure Docs',
        description: `Browse all documentation articles and guides on Filesure. Find help, troubleshooting, and how-to guides for every topic.`,
        url: `${BASE_URL_FRONTEND}/docs/categories/all`,
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
        canonical: `${BASE_URL_FRONTEND}/docs/categories/all`,
      },
      robots: { index: true, follow: true },
    };
  }

  // 2. Category page: try to find the category
  const category = categories.find((t) => t.slug === categorySlug[0]);

  // 3. Invalid category: set SEO for "Category Not Found" (noindex)
  if (!category) {
    return {
      title: 'Explore All Categories | Filesure Docs',
      description:
        'Explore Filesure documentation: product guides, troubleshooting tips, API references, and best practices to get the most out of Filesure.',
      robots: { index: false, follow: false },
    };
  }

  // 4. Category found: set category-specific SEO
  const { data: docs } = await getDocsByCategorySubcategory({
    categoryId: category._id,
    page: 1,
    limit: 6,
  });
  const title = `${category.metaTitle || category.name} Documentation | Filesure Docs`;
  const description =
    category.metaDescription ||
    category.description ||
    (docs.length
      ? `Explore expert-written ${docs.length} documentation articles and guides for ${category.name} on Filesure.${
          category.metaDescription || category.description
        }`
      : `No documentation found for ${category.name} on Filesure. Check back soon for new guides and resources.`);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${BASE_URL_FRONTEND}/docs/categories/${category.slug}`,
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
      canonical: `${BASE_URL_FRONTEND}/docs/categories/${category.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

// --- MAIN PAGE COMPONENT ---
const AllCategoriesPage = async ({
  params,
  searchParams,
}: {
  params: { categorySlug: string };
  searchParams: { page?: string; perPage?: string; featured?: string };
}) => {
  const allCategoriesData = await getAllCategories();
  const categories = (allCategoriesData?.categories || []).filter(
    (cat) => cat._id.toString() !== '68a19bb4b09c3b367367f7bc'
  );
  const slugArray = params.categorySlug; // array
  const categorySlug = slugArray?.[0] || 'all';
  const subcategorySlug =
    slugArray?.[1] !== 'featured' ? slugArray?.[1] : undefined;
  const isFeatured = slugArray?.includes('featured') || false;
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = parseInt(searchParams.perPage || '6', 10);
  let docs: Doc[] = [];
  let paginationData: any = null;

  // 1. "All" page: show all docs
  if (categorySlug === 'all') {
    const { data, meta } = await getDocsByCategorySubcategory({
      page,
      limit: perPage,
      isFeatured: isFeatured,
    });
    docs = data;
    paginationData = meta;
    const categorySnippets = categories
      .map((cat) => cat.metaDescription || cat.description || cat.name)
      .filter(Boolean)
      .slice(0, 3);

    const categoryList = categorySnippets.join(', ');

    const description = categoryList
      ? `Browse documentation for ${categoryList}${categories.length > 3 ? ', and more' : ''} on Filesure. Explore ${docs.length} expert-written articles and guides.`
      : docs.length > 0
        ? `Explore ${docs.length} expert-written documentation articles and guides on Filesure.`
        : `No documentation found on Filesure. Check back soon for new guides and resources.`;
    // JSON-LD for all docs
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'All Documentation',
      description: description,
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
        <CategoryDocs
          params={params}
          searchParams={searchParams}
          categories={categories}
          docs={docs}
          paginationData={paginationData}
          isFeatured={isFeatured}
        />
      </div>
    );
  }

  // 2. Category page: try to find the category
  const category = categories.find((t) => t.slug === categorySlug);

  // 3. Invalid category: show not found message
  if (!category) {
    return (
      <div className='mx-auto mb-8 mt-24 max-w-96 rounded-xl border bg-white px-6 py-12 text-center shadow-sm lg:px-8 lg:py-16'>
        <div className='mx-auto max-w-md'>
          <div className='mb-4 text-4xl'>📄</div>
          <p className='m-0 text-lg text-slate-500'>
            No documents found for this.
          </p>
          <p className='mt-2 text-sm text-slate-400'>
            Try selecting a different category or check back later.
          </p>
        </div>
      </div>
    );
  }
  const subcategories = await getSubcategoriesByCategory(category._id);
  let subcategory;
  if (subcategorySlug && subcategories.length > 0) {
    subcategory = subcategories.find((t) => t.slug === subcategorySlug);
  }
  // 4. Category found: show category docs
  const { data, meta } = await getDocsByCategorySubcategory({
    categoryId: category._id,
    ...(subcategory ? { subcategoryId: subcategory._id } : {}),
    page,
    limit: perPage,
    isFeatured: isFeatured,
  });

  docs = data;
  paginationData = meta;
  const description =
    category.metaDescription ||
    category.description ||
    (docs.length
      ? `Explore expert-written ${docs.length} documentation articles and guides for ${category.name} on Filesure.${
          category.metaDescription || category.description
        }`
      : `No documentation found for ${category.name} on Filesure. Check back soon for new guides and resources.`);

  // JSON-LD for category docs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Documentation`,
    description: description,
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
      <CategoryDocs
        params={params}
        searchParams={searchParams}
        categories={categories}
        subcategories={subcategories}
        docs={docs}
        paginationData={paginationData}
        isFeatured={isFeatured}
      />
    </div>
  );
};

export default AllCategoriesPage;
