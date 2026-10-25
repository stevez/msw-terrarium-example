const { buildMockServer } = await import('./index.js');
const { startMockServer } = await import('msw-terrarium');

// The desktop app (web-terrarium) passes a free port and 127.0.0.1; tests and dev use 3001.
startMockServer(buildMockServer(), {
  port: Number(process.env.MOCK_PORT ?? 3001),
  host: process.env.MOCK_HOST,
  name: 'mock server',
});
