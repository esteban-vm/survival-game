/* eslint-env node */

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-imports': ['warn', { disallowTypeAnnotations: false }],
    'prettier/prettier': 'warn',
    'import/no-named-as-default': 'off',
    'import/default': 'off',
    'import/order': [
      'warn',
      { groups: ['type', 'builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'] },
    ],
  },
  ignorePatterns: ['*.cjs', 'node_modules', 'dist', 'public'],
  settings: { 'import/resolver': { typescript: true } },
  root: true,
}
