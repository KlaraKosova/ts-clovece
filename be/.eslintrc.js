module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": "standard-with-typescript",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": './tsconfig.json'
    },
    "rules": {
        indent: ['error', 4, { SwitchCase: 1 }],
        '@typescript-eslint/indent': ['error', 4, { SwitchCase: 1 }],
        'prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': 'off',
        'strict-boolean-expressions': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        'prefer-optional-chain': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off'
    }
}
