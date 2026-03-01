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
		client: {start:"_app/immutable/entry/start.D4_S_Cs1.js",app:"_app/immutable/entry/app.CfUzwYFR.js",imports:["_app/immutable/entry/start.D4_S_Cs1.js","_app/immutable/chunks/D4_cn0Rs.js","_app/immutable/chunks/uDPRyAOF.js","_app/immutable/chunks/DUwCBbVm.js","_app/immutable/chunks/BGh1C5e_.js","_app/immutable/entry/app.CfUzwYFR.js","_app/immutable/chunks/uDPRyAOF.js","_app/immutable/chunks/C7eqeGV3.js","_app/immutable/chunks/BGh1C5e_.js","_app/immutable/chunks/BnIN0Tst.js","_app/immutable/chunks/BEUaE752.js","_app/immutable/chunks/ByiXqGWG.js","_app/immutable/chunks/DUwCBbVm.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BoHobcFh.js')),
			__memo(() => import('./chunks/1-Cc4VNZV1.js')),
			__memo(() => import('./chunks/2-DRSfsx5w.js')),
			__memo(() => import('./chunks/3-DipzVWNq.js')),
			__memo(() => import('./chunks/4-QgWlPv0l.js')),
			__memo(() => import('./chunks/5-Cl_L0RXP.js')),
			__memo(() => import('./chunks/6-BsPNk4Mx.js')),
			__memo(() => import('./chunks/7--FQQwu2d.js')),
			__memo(() => import('./chunks/8-DZoiWG6J.js')),
			__memo(() => import('./chunks/9-4Vp3ro6O.js')),
			__memo(() => import('./chunks/10-n0199t1Z.js')),
			__memo(() => import('./chunks/11-DO5F0eo3.js')),
			__memo(() => import('./chunks/12-B0JPVAEK.js')),
			__memo(() => import('./chunks/13-DE96dhAJ.js'))
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
			},
			{
				id: "/wallet",
				pattern: /^\/wallet\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
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
