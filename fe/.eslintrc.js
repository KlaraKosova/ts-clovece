module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: 'standard-with-typescript',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
    },
    rules: {
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': 'off',
        'strict-boolean-expressions': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        indent: ['error', 4, { SwitchCase: 1 }],
        '@typescript-eslint/indent': ['error', 4, { SwitchCase: 1 }],
        'consistent-type-assertions': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        'prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off'
    }
}
