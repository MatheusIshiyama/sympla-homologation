import { Router } from 'express';

import { symplaEventsRouter } from '@/routes/sympla/events';

const router: Router = Router();

router.use('/events', symplaEventsRouter);

export const symplaRoutes: Router = router;
