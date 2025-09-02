import { getSingleDocDetails } from '@/app/(root)/docs/[categorySlug]/[docSlug]/_services/services';
import UpdateDoc from './_component/UpdateDoc';

const UpdateDocPage = async ({ params }: { params: { docSlug: string } }) => {
  const { docSlug } = params;
  const docData = await getSingleDocDetails(docSlug);

  return <UpdateDoc docData={docData} />;
};

export default UpdateDocPage;
