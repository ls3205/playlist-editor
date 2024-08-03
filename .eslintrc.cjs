/** @type {import("eslint").Linter.Config} */
const config = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    rules: {
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-imports": [
            "warn",
            {
                prefer: "type-imports",
                fixStyle: "inline-type-imports",
            },
        ],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
            },
        ],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: {
                    attributes: false,
                },
            },
        ],
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/consistent-indexed-object-style": "off",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "react/no-unescaped-entities": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "react/jsx-key": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-member-access": "off"
    },
};
module.exports = config;
