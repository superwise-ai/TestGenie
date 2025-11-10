import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow 'any' type for now (can be fixed incrementally)
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused variables (common in development)
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow unescaped entities in JSX (common in text content)
      "react/no-unescaped-entities": "off",
      // Allow img tags (can be migrated to next/image later)
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
