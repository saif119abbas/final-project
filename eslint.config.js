import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import pluginSecurity from "eslint-plugin-security";


export default defineConfig([
{
  files: ["*.js", "*.ts"],
  ignores: ["dist/**", "node_modules/**"]
},
{
  files: ["src/**/*.ts"],
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
    },
  },
},

  {
    ignores: ["dist/**", "node_modules/**"],
  },
  tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
]);
