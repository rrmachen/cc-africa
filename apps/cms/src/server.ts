import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import config from './payload.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.resolve(projectRoot, '.env');
dotenv.config({ path: envPath });

const app = express();

app.use('/media', express.static(path.resolve(projectRoot, 'media')));

app.get('/', (_req, res) => {
  res.redirect('/admin');
});

const start = async () => {
  await payload.init({
    config,
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
