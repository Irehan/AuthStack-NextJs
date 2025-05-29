// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// The eslintConfig should directly be the array of configurations
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add your custom rules as a separate configuration object within the array
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

// Export the array directly for the new flat config system
export default eslintConfig;