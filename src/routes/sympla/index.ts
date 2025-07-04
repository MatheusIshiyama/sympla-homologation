import { Router } from 'express';

import events from '@/routes/sympla/events';

const router: Router = Router();

router.use('/events', events);

export default router;
