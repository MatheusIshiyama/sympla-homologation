import { Router } from 'express';

import { healthRouter } from '@/routes/health';
import { symplaRoutes } from '@/routes/sympla';

export const getRoutes: () => Router = (): Router => {
  const router: Router = Router();

  router.use('/health', healthRouter);
  router.use('/sympla', symplaRoutes);

  return router;
};
