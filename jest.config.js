module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  reporters: ['<rootDir>/dist/index.js'],
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
