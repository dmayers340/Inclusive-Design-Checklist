module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    // If you import CSS or files in components:
    '\\.(css|less|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/__tests__/**'
  ],
  coverageDirectory: 'test-coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
    }
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
};
