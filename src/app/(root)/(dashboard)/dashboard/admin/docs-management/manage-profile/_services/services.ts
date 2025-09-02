/* eslint-disable camelcase */
import { BASE_URL_BACKEND } from '@/constants';
import { MetaData } from '../_types/types';

export type UpdatePayload = {
  meta_data: MetaData;
  file?: File | null; // ⬅️ NEW: optional image file
};

function toSnakeCaseBody(meta: MetaData) {
  return {
    first_name: meta.firstName,
    last_name: meta.lastName,
    mobile_number: meta.mobileNumber,
    bio: meta.bio,
    linkedin: meta.social?.linkedin,
    facebook: meta.social?.facebook,
    github: meta.social?.github,
  };
}

export async function updateAdminUserInfo(payload: UpdatePayload) {
  const body = toSnakeCaseBody(payload.meta_data);

  // ⬇️ Send as multipart/form-data so Multer can read `file`
  const form = new FormData();
  Object.entries(body).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });

  // NOTE: backend field name is 'file' (upload.single('file'))
  if (payload.file) {
    form.append('file', payload.file);
  }
  const res = await fetch(
    `${BASE_URL_BACKEND}/api/v1/users/update-admin-user-info`,
    {
      method: 'PATCH',
      // IMPORTANT: no manual Content-Type; the browser sets proper boundary
      body: form,
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(
      `Failed to update profile (${res.status}): ${errText || res.statusText}`
    );
  }

  const json = await res.json().catch(() => ({}));
  return json?.data ?? json;
}
