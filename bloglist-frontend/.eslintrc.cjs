module.exports = {
  root: true,
  env: { browser: true, es2020: true, "vitest-globals/env": true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:vitest-globals/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.js", "node_modules"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    indent: ["ignore", 2],
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    "no-unused-vars": "warn",
    "react/prop-types": 1,
  },
};
