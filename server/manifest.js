const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico","hyde.png","jekyll.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.DVi7EfOT.js",app:"_app/immutable/entry/app.CNDuXJsG.js",imports:["_app/immutable/entry/start.DVi7EfOT.js","_app/immutable/chunks/DGvcNDwH.js","_app/immutable/chunks/CakkSitO.js","_app/immutable/chunks/D_9Q7r3x.js","_app/immutable/chunks/Zx8yr4Z3.js","_app/immutable/entry/app.CNDuXJsG.js","_app/immutable/chunks/CakkSitO.js","_app/immutable/chunks/B1UE6JjW.js","_app/immutable/chunks/Zx8yr4Z3.js","_app/immutable/chunks/DcY06AV-.js","_app/immutable/chunks/CVQc7UL2.js","_app/immutable/chunks/UAf983EM.js","_app/immutable/chunks/DIq4UY94.js","_app/immutable/chunks/D_9Q7r3x.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CYG4g6xy.js')),
			__memo(() => import('./chunks/1-VZoHsuHN.js')),
			__memo(() => import('./chunks/2-B9h87uLu.js')),
			__memo(() => import('./chunks/3-BpVwTezY.js')),
			__memo(() => import('./chunks/4-BegYIhVb.js')),
			__memo(() => import('./chunks/5-DBlhodlK.js')),
			__memo(() => import('./chunks/6-CooNuGWy.js')),
			__memo(() => import('./chunks/7-CxN2PT9K.js')),
			__memo(() => import('./chunks/8-BAnZT-gR.js')),
			__memo(() => import('./chunks/9-DzmZ3iTg.js')),
			__memo(() => import('./chunks/10-DWkd4UbU.js')),
			__memo(() => import('./chunks/11-CjGDqDAx.js')),
			__memo(() => import('./chunks/12-BEm0jwIu.js')),
			__memo(() => import('./chunks/13-DDJqqNQy.js')),
			__memo(() => import('./chunks/14-D4vFeU7q.js')),
			__memo(() => import('./chunks/15-Cu8YkOqV.js'))
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
