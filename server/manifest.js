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
		client: {start:"_app/immutable/entry/start.Co3zO7XC.js",app:"_app/immutable/entry/app.DDgG5SlE.js",imports:["_app/immutable/entry/start.Co3zO7XC.js","_app/immutable/chunks/nETa_4hm.js","_app/immutable/chunks/D6fmpCj_.js","_app/immutable/chunks/BFp5vyOd.js","_app/immutable/chunks/DgBc4gsN.js","_app/immutable/entry/app.DDgG5SlE.js","_app/immutable/chunks/D6fmpCj_.js","_app/immutable/chunks/Dhbirn3Z.js","_app/immutable/chunks/DgBc4gsN.js","_app/immutable/chunks/I2sOb7JU.js","_app/immutable/chunks/BWT5Owqn.js","_app/immutable/chunks/DVaysnsx.js","_app/immutable/chunks/Ckk2bFsV.js","_app/immutable/chunks/BFp5vyOd.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BDoK9Gcp.js')),
			__memo(() => import('./chunks/1-D11VcXVP.js')),
			__memo(() => import('./chunks/2-Dtr5vRQU.js')),
			__memo(() => import('./chunks/3-CqP1Ason.js')),
			__memo(() => import('./chunks/4-BUC3WpA1.js')),
			__memo(() => import('./chunks/5-BAbCir7q.js')),
			__memo(() => import('./chunks/6-BWF5A7QB.js')),
			__memo(() => import('./chunks/7-CiaxMeJ7.js')),
			__memo(() => import('./chunks/8-DFp45AAl.js')),
			__memo(() => import('./chunks/9-DK2hpFNk.js')),
			__memo(() => import('./chunks/10-Dts6M-OV.js')),
			__memo(() => import('./chunks/11-BBQtWyfU.js')),
			__memo(() => import('./chunks/12-CRbl1GCt.js')),
			__memo(() => import('./chunks/13-BiuC422V.js')),
			__memo(() => import('./chunks/14-BqTaFZ0t.js')),
			__memo(() => import('./chunks/15-BInXiSYB.js'))
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
