import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/sw.js",
    "public/workbox-*.js",
  ]),
  {
    rules: {
      // Downgrade noisy TS rules to warnings — these don't affect runtime
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      // JSX style — non-blocking
      "react/no-unescaped-entities": "warn",
      // Hooks — warn only
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      // Prefer const — autofix friendly
      "prefer-const": "error",
      // Next.js specific
      "@next/next/no-html-link-for-pages": "error",
      // Allow img elements (needed for blob URLs / canvas output)
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
