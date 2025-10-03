import path from 'path';
import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.resolve(projectRoot, '.env');
dotenv.config({ path: envPath });

const app = express();

app.use('/media', express.static(path.resolve(projectRoot, 'media')));

app.get('/', (_req, res) => {
  res.redirect('/admin');
});

const start = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const configPath = isProduction
    ? path.resolve(projectRoot, 'dist/payload.config.js')
    : path.resolve(projectRoot, 'src/payload.config.ts');

  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '',
    express: app,
    config: configPath,
    onInit: async (cms) => {
      cms.logger.info('Payload CMS is ready.');
    },
  });

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    payload.logger.info(`Server is listening on port ${port}`);
  });
};

start();
