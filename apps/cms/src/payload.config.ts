import path from 'path';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { Churches } from './collections/Churches';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

const allowedOrigins = [
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
].filter((value): value is string => Boolean(value));

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
  },
  collections: [Users, Churches, Media],
  typescript: {
    outputFile: path.resolve(__dirname, '../../payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, '../../generated-schema.graphql'),
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
    },
    migrationDir: path.resolve(__dirname, '../../migrations'),
    schemaName: process.env.DATABASE_SCHEMA,
  }),
});
