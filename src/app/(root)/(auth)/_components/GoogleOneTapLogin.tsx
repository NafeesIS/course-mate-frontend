/* eslint-disable camelcase */

import { useGoogleOneTapLogin } from '../_config/useGoogleOneTapLogin';

export default function GoogleOneTapLogin({
  onSuccess,
}: {
  // eslint-disable-next-line no-unused-vars
  onSuccess: (response: any) => void;
}) {
  useGoogleOneTapLogin({
    client_id:
      '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
    onSuccess,
  });

  return null;
}
