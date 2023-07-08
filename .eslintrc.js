module.exports = {
    "env": {
        "browser": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
    ],
    "plugins": [
        "@typescript-eslint"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "rules": {
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/indent": ["error", 2]
    }
};