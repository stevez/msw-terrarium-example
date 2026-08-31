const { buildMockServer } = await import('./index.js');
const { startMockServer } = await import('msw-terrarium');

startMockServer(buildMockServer(), {
  port: 3001,
  name: 'mock server',
});
