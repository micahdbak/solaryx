const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.PVwfO9mI.js",app:"_app/immutable/entry/app.DwMXXPaf.js",imports:["_app/immutable/entry/start.PVwfO9mI.js","_app/immutable/chunks/Bwu1nDks.js","_app/immutable/chunks/D8StqO6s.js","_app/immutable/chunks/Ce-W7byn.js","_app/immutable/chunks/Df_vWAA_.js","_app/immutable/entry/app.DwMXXPaf.js","_app/immutable/chunks/D8StqO6s.js","_app/immutable/chunks/BXocVRlS.js","_app/immutable/chunks/Df_vWAA_.js","_app/immutable/chunks/DdazIBMK.js","_app/immutable/chunks/CpnOqmky.js","_app/immutable/chunks/C_S0mXsj.js","_app/immutable/chunks/Ce-W7byn.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-6245FnDf.js')),
			__memo(() => import('./chunks/1-ABehbYWh.js')),
			__memo(() => import('./chunks/2-D6uUcTWp.js')),
			__memo(() => import('./chunks/3-CKx5w0hZ.js')),
			__memo(() => import('./chunks/4-Dz7LNl-L.js')),
			__memo(() => import('./chunks/5-DaCXNQh9.js')),
			__memo(() => import('./chunks/6-CVbR-fc3.js')),
			__memo(() => import('./chunks/7-CohJa-p1.js')),
			__memo(() => import('./chunks/8-DNzDRROY.js')),
			__memo(() => import('./chunks/9-fJXEuH_g.js')),
			__memo(() => import('./chunks/10-DueUuhV9.js')),
			__memo(() => import('./chunks/11-CkaLz_ur.js')),
			__memo(() => import('./chunks/12-CFXekUQT.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/bet/[id]",
				pattern: /^\/bet\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/create-charity",
				pattern: /^\/create-charity\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/create",
				pattern: /^\/create\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/my-bets",
				pattern: /^\/my-bets\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
