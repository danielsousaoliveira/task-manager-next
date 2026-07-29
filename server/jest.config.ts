import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./__tests__/setup.ts'],
  globalSetup: './__tests__/globalSetup.ts',
  globalTeardown: './__tests__/globalTeardown.ts',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testTimeout: 15000,
  maxWorkers: 1,
  forceExit: true,
};

export default config;
