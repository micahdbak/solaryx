const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico","robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.jL-yAeqs.js",app:"_app/immutable/entry/app.C2q3U-6A.js",imports:["_app/immutable/entry/start.jL-yAeqs.js","_app/immutable/chunks/39QomOAa.js","_app/immutable/chunks/DO-gQjmt.js","_app/immutable/chunks/1GVdDEE7.js","_app/immutable/chunks/k0rgCUoy.js","_app/immutable/entry/app.C2q3U-6A.js","_app/immutable/chunks/DO-gQjmt.js","_app/immutable/chunks/Cy5CI8tk.js","_app/immutable/chunks/k0rgCUoy.js","_app/immutable/chunks/CVGEqk8B.js","_app/immutable/chunks/ChBWSnbt.js","_app/immutable/chunks/TnCA1RdC.js","_app/immutable/chunks/DTkmPdJn.js","_app/immutable/chunks/1GVdDEE7.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BjbwoGnS.js')),
			__memo(() => import('./chunks/1-D8LVuiYg.js')),
			__memo(() => import('./chunks/2-B1ZMzdGU.js')),
			__memo(() => import('./chunks/3-RiPHu2H8.js')),
			__memo(() => import('./chunks/4-vkAgVt0Z.js')),
			__memo(() => import('./chunks/5-Bt5Sa9Z4.js')),
			__memo(() => import('./chunks/6-JTljcvOh.js')),
			__memo(() => import('./chunks/7-Cl691oql.js')),
			__memo(() => import('./chunks/8-Dzgi0z7P.js')),
			__memo(() => import('./chunks/9-DMo6vcwI.js')),
			__memo(() => import('./chunks/10-Kug3dpAt.js')),
			__memo(() => import('./chunks/11-BJC58EcT.js')),
			__memo(() => import('./chunks/12-B_x6GFRk.js')),
			__memo(() => import('./chunks/13-BSUjoDbe.js')),
			__memo(() => import('./chunks/14-CDeOOKAH.js')),
			__memo(() => import('./chunks/15-CutsAHiB.js'))
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
				id: "/leaderboard",
				pattern: /^\/leaderboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/my-bets",
				pattern: /^\/my-bets\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/profile/[id]",
				pattern: /^\/profile\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/wallet",
				pattern: /^\/wallet\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
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
