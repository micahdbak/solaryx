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
		client: {start:"_app/immutable/entry/start.BM39LkU1.js",app:"_app/immutable/entry/app.CtUd56oW.js",imports:["_app/immutable/entry/start.BM39LkU1.js","_app/immutable/chunks/BQkkC6CK.js","_app/immutable/chunks/D6fmpCj_.js","_app/immutable/chunks/BFp5vyOd.js","_app/immutable/chunks/DgBc4gsN.js","_app/immutable/entry/app.CtUd56oW.js","_app/immutable/chunks/D6fmpCj_.js","_app/immutable/chunks/D55amiXP.js","_app/immutable/chunks/DgBc4gsN.js","_app/immutable/chunks/I2sOb7JU.js","_app/immutable/chunks/BWT5Owqn.js","_app/immutable/chunks/DVaysnsx.js","_app/immutable/chunks/Ckk2bFsV.js","_app/immutable/chunks/BFp5vyOd.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-B6_yBNnB.js')),
			__memo(() => import('./chunks/1-DVT6H7s_.js')),
			__memo(() => import('./chunks/2-CnxPSuoS.js')),
			__memo(() => import('./chunks/3-seW8Hsyu.js')),
			__memo(() => import('./chunks/4-Cee65feo.js')),
			__memo(() => import('./chunks/5-MI81W8bi.js')),
			__memo(() => import('./chunks/6-B98SgwvL.js')),
			__memo(() => import('./chunks/7-DZi3EjhF.js')),
			__memo(() => import('./chunks/8-BdQsfDw_.js')),
			__memo(() => import('./chunks/9-CU8y-Gca.js')),
			__memo(() => import('./chunks/10-DU5O3Sh-.js')),
			__memo(() => import('./chunks/11-CPgLAt7F.js')),
			__memo(() => import('./chunks/12-JjdfgpNy.js')),
			__memo(() => import('./chunks/13-DXRiE8o0.js')),
			__memo(() => import('./chunks/14-D9O-T7v1.js')),
			__memo(() => import('./chunks/15-K7DviR_O.js'))
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
