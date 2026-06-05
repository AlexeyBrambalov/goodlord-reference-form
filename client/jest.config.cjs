/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': '<rootDir>/test/styleMock.cjs',
  },
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  clearMocks: true,
}
