import js from "@eslint/js";
import globals from "globals";
import eslintPluginSvelte from "eslint-plugin-svelte";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	js.configs.recommended,
	...eslintPluginSvelte.configs["flat/recommended"],
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			"no-unused-vars": "warn",
			"no-useless-escape": "off",
			"svelte/no-navigation-without-resolve": "off",
			"svelte/require-each-key": "off"
		}
	},
	{
		ignores: ["node_modules/**", "build/**", ".svelte-kit/**"]
	}
];
