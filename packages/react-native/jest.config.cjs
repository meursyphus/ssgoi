module.exports = {
  preset:
    process.env.SSGOI_TEST_PLATFORM === "android"
      ? "jest-expo/android"
      : "jest-expo/ios",
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@ssgoi/core/runtime$": "<rootDir>/../core/dist/runtime.cjs",
  },
};
