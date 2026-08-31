import { z } from 'zod';
import { defineSchema } from 'msw-terrarium';

export const { createDb, seedBaseline } = defineSchema({
  task: {
    schema: z.object({
      id: z.string(),
      text: z.string(),
    }),
    // The app always supplies its own uuid on create (see AddTask.tsx),
    // so this is only a fallback for rows created without one.
    idPrefix: 'task',
  },

  // No baseline: every fresh bucket starts genuinely empty. Tests that need
  // the app's canned starting data load the `default-tasks` seed explicitly.
});
