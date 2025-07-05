import { Event } from '@prisma/client';
import nodeCron from 'node-cron';

import { updateOrders } from '@/jobs/updateOrders';
import { eventService } from '@/services';
import { logger } from '@/utils';

export const startJobs: () => Promise<void> = async () => {
  try {
    const events: Event[] = await eventService.getAllEvents({ where: { active: true } });

    events.forEach((event: Event) => {
      nodeCron.schedule('*/20 * * * * *', () => updateOrders(event.id));
    });
  } catch (error) {
    logger('ERROR', 'JOBS', `Error starting jobs: ${error}`);
  }
};
