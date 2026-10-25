// Desktop app (web-terrarium): the todo app plus its msw-terrarium mock server, in one window.
export default {
  name: 'Todo Demo',
  appId: 'com.stevez.msw-terrarium-example',
  app: {
    type: 'next',
    env: { MOCK_API_URL: 'http://{host}:{port:mock}' },
  },
  servers: [
    {
      name: 'mock',
      entry: 'e2e/mocks/server.mjs',
      copy: ['seeds'],
      env: { MOCK_PORT: '{port}', MOCK_HOST: '{host}' },
      readyPath: '/tasks',
    },
  ],
};
