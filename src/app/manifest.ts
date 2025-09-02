/* eslint-disable camelcase */

import { MetadataRoute } from 'next';
import { META_DESCRIPTION, META_TITLE } from './(root)/_utils/meta_data';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: META_TITLE,
    short_name: 'FileSure',
    description: META_DESCRIPTION,
    start_url: '/',
    scope: '/',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone', // Launches the app in standalone mode, without browser UI
    orientation: 'any', // Supports all device orientations
    lang: 'en-US',
    dir: 'ltr', // Left-to-right text direction,
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
