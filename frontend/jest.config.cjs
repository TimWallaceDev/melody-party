// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    // other configurations as needed
    transform: {
        '\\.(scss)$':
          '<rootDir>/fileTransformer.cjs',
      },
};