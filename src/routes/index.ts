import { Router } from 'express';

import health from '@/routes/health';
import sympla from '@/routes/sympla';

export const getRoutes: () => Router = (): Router => {
  const router: Router = Router();

  router.use('/health', health);
  router.use('/sympla', sympla);

  return router;
};
