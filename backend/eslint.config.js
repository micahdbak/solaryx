const js = require("@eslint/js");
const globals = require("globals");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
	js.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: {
				...globals.node
			},
			sourceType: "commonjs"
		},
		rules: {
			"no-unused-vars": "warn",
			"no-useless-escape": "off"
		}
	},
	{
		ignores: ["node_modules/**"]
	}
];
