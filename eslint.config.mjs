import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: true, // React를 전역 변수로 추가
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // React 17+ 버전에서는 이 규칙을 끄는 것이 권장됨
    },
  },
];
