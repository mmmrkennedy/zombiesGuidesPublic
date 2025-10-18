import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                module: 'readonly',
                require: 'readonly',
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // React Rules
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/prop-types': 'off', // Turn off if you don't use PropTypes

            // React Hooks Rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // General JavaScript Rules
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off', // Allow console.log
            'prefer-const': 'warn',
            'no-var': 'error',
        },
    },
    prettier, // Must be last to override other configs
];
