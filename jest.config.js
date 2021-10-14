module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['jest-extended'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
