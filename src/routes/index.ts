import { Router } from 'express';

import health from '@/routes/health';

export const router: Router = Router();

router.use('/health', health);
