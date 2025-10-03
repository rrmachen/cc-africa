import path from 'path';
import { fileURLToPath } from 'url';
import type { CollectionConfig } from 'payload';
import { canUploadMedia, isAdmin } from '../utils/access.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
