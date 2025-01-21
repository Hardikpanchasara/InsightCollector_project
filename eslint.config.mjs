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
  // {
  //   rules: {
  //     '@typescript-eslint/no-unused-vars': [
  //       'warn', // or 'off' to disable the rule completely
  //       {
  //         args: 'after-used', // Don't warn for unused function arguments
  //         argsIgnorePattern: '^_', // Ignore variables starting with _
  //         ignoreRestSiblings: true, // Ignore variables that are part of destructuring
  //       },
  //     ],
  //     '@typescript-eslint/no-explicit-any': 'warn', // Change to 'warn' or 'off' for flexibility
  //   },
  // },
];

export default eslintConfig;