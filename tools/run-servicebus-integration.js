const { spawnSync } = require('child_process');

process.env.CAP_SERVICEBUS_INTEGRATION_REQUIRED = 'true';
process.env.CAP_USE_REAL_SERVICEBUS_CLIENT = 'true';

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  [
    'jest',
    '--config',
    './apps/cap-test-app/test/jest-integration.json',
    '--testPathPattern=transport-azure-servicebus.integration-spec.ts',
    '--runInBand',
  ],
  { stdio: 'inherit', env: process.env },
);

process.exit(result.status ?? 1);
