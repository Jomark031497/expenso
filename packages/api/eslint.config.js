import tseslint from "typescript-eslint";
import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier
    ],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "no-console": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  }
)