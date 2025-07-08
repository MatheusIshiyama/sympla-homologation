import { Event } from '@prisma/client';
import nodeCron from 'node-cron';

import { updateOrders } from '@/jobs/updateOrders';
import { eventService } from '@/services';
import { logger } from '@/utils';

export const startJobs: () => Promise<void> = async () => {
  nodeCron.schedule('*/20 * * * * *', async () => {
    try {
      const events: Event[] = await eventService.getAllEvents({ where: { active: true } });

      const promises: Promise<void>[] = events.map((event: Event) => updateOrders(event.id));

      await Promise.all(promises);
    } catch (error) {
      logger('ERROR', 'JOBS', `Error starting jobs: ${error}`);
    }
  });
};
