import path from 'path';
import type { CollectionConfig } from 'payload';
import { canUploadMedia, isAdmin } from '../utils/access';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
    ],
  },
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
    create: canUploadMedia,
    update: canUploadMedia,
    delete: ({ req }) => isAdmin(req.user as any),
  },
  fields: [],
};
