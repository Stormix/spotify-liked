module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "unused-imports"
  ],
  env: {
    "es6": true,
    "node": true
  },
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:jest/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    debugLevel: false
  },
  rules: {
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "@typescript-eslint/naming-convention": "off",
    "import/no-cycle": "off",
    "no-await-in-loop": "off",
    "class-methods-use-this": "off",
    "max-classes-per-file":"off",
    "jest/no-done-callback":"off",
    "import/prefer-default-export": "off",
		"func-names": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{ "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
		]
  },
}
