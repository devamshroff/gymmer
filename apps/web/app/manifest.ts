import type { MetadataRoute } from 'next';
import { buildPwaManifest } from '@/lib/pwa/config';

export default function manifest(): MetadataRoute.Manifest {
  const nextManifest = buildPwaManifest();

  return {
    ...nextManifest,
    icons: [...nextManifest.icons],
    shortcuts: [...nextManifest.shortcuts],
  };
}
