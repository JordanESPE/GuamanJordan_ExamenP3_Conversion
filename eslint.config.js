const globals = require('globals');

module.exports = [
    {
        ignores: ['coverage/**', '**/coverage/**', 'node_modules/**'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.browser,
                ...globals.commonjs,
                ...globals.es2021,
                ...globals.jest,
            },
        },
        rules: {
            // Puedes agregar reglas personalizadas aquí
        },
    },
];