'use client';
import { useUserSignInDetails } from '@/store/userStore';
import Profile from './_components/Profile';
import { updateAdminUserInfo } from './_services/services';
import { MetaData } from './_types/types';

const ManageAuthorPage = () => {
  const { userSignInDetails, refetchUserSignInDetails } =
    useUserSignInDetails();

  async function onSave(updated: { meta_data: MetaData; file?: File | null }) {
    await updateAdminUserInfo(updated); // ⬅️ service now accepts file
  }

  return userSignInDetails ? (
    <Profile
      userSignInDetails={userSignInDetails.data}
      refetchUserSignInDetails={refetchUserSignInDetails}
      onSave={onSave}
    />
  ) : (
    <div>Manage Author</div>
  );
};

export default ManageAuthorPage;
