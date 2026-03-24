module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended"],
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^React$",
      },
    ],
    "react/jsx-uses-vars": "error",
    "react/react-in-jsx-scope": "off",
  },
  ignorePatterns: ["build", "dist", "node_modules"],
  overrides: [
    {
      files: ["**/*.test.js", "**/*.test.jsx"],
      globals: {
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        vi: "readonly",
      },
    },
  ],
};
