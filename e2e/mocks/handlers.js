import { createRestHandlers } from 'msw-terrarium';

export function createHandlers({ store }) {
  return createRestHandlers({
    store,
    routes: {
      'GET /tasks': ({ world }) => ({
        body: world.db.task.findMany((q) => q.where({})),
      }),

      'POST /tasks': async ({ world, body }) => {
        const task = await world.db.task.createNext(body);
        return { status: 201, body: task };
      },

      'PUT /tasks/:id': async ({ world, params, body }) => {
        const existing = world.db.task.findFirst((q) => q.where({ id: params.id }));
        if (!existing) return { status: 404 };
        await world.db.task.update(existing, {
          data(current) {
            Object.assign(current, body);
          },
        });
        const updated = world.db.task.findFirst((q) => q.where({ id: params.id }));
        return { status: 200, body: updated };
      },

      'DELETE /tasks/:id': ({ world, params }) => {
        const target = world.db.task.findFirst((q) => q.where({ id: params.id }));
        if (!target) return { status: 404 };
        world.db.task.delete(target);
        return { status: 204 };
      },
    },
  });
}
