const js = require("@eslint/js");
const globals = require("globals");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
	js.configs.recommended,
	eslintConfigPrettier,
	{
		// 1. General settings for all Node.js files
		languageOptions: {
			globals: {
				...globals.node
			},
			sourceType: "commonjs"
		},
		rules: {
			"no-unused-vars": "warn"
		}
	},
	{
		// 2. Settings ONLY for test files (This fixes your errors)
		files: ["**/*.test.js", "**/*.spec.js"],
		languageOptions: {
			globals: {
				...globals.jest
			}
		}
	},
	{
		ignores: ["node_modules/**"]
	}
];
