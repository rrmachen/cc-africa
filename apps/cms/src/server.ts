import { getPayload } from 'payload';
import config from './payload.config.js';

const start = async () => {
  await getPayload({ config });

  // Payload v3 runs its own server internally
  // The admin UI and API are automatically available
};

start();
