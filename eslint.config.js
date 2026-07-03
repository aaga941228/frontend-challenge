import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: globals.browser,
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'warn',
      'vue/no-mutating-props': 'error',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
]
