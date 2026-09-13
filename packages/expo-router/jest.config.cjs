const native = require("../react-native/jest.config.cjs");

module.exports = {
  ...native,
  setupFilesAfterEnv: ["<rootDir>/../react-native/tests/setup.ts"],
  moduleNameMapper: {
    ...native.moduleNameMapper,
    "^@ssgoi/react-native$": "<rootDir>/../react-native/src/index.ts",
    "^@ssgoi/react-native/(.*)$": "<rootDir>/../react-native/src/$1",
  },
};
