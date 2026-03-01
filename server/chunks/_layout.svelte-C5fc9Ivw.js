import { h as head, c as attr_class, d as stringify, f as store_get, j as ensure_array_like, k as unsubscribe_stores } from './index2-DepLL4jW.js';
import { t as themeLockedStore, i as isHydeStore, s as searchQueryStore, a as activeTopicStore, b as selectedCurrencyStore, e as exchangeRatesStore } from './theme-BFrXHlwE.js';
import { g as getContext } from './context-CuKPUhzf.js';
import './root-Ctl1xNBE.js';
import './state.svelte-B8fG0fWE.js';
import { e as escape_html } from './escaping-CqgfEcN3.js';
import { a as attr } from './attributes-DmmHphcL.js';
import './index-B_Ibri8K.js';

function formatSol(amount) {
  const num = Number(amount);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 9 }).format(num);
}
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const topics = ["Trending", "New", "Expiring Soon"];
    $$renderer2.push(`<header class="sticky top-0 z-50 backdrop-blur transition-colors duration-700 ease-in-out border-b bg-[#0b0f19]/90 border-gray-800/60"><nav class="flex justify-between items-center px-4 md:px-8 py-4 w-full"><div class="flex items-center flex-1"><div class="flex items-center gap-4 mr-4 md:mr-8"><a href="/"${attr_class(`bg-transparent border-none flex items-center justify-center relative w-12 h-12 text-2xl font-extrabold text-white no-underline tracking-wide whitespace-nowrap hover:scale-105 transition-transform ${stringify(store_get($$store_subs ??= {}, "$themeLockedStore", themeLockedStore) && store_get($$store_subs ??= {}, "$page", page).url.pathname === "/" ? "cursor-not-allowed opacity-80" : "")}`)} aria-label="Home"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${attr_class(`absolute transition-all duration-700 ease-in-out ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "opacity-0 scale-50 rotate-90 text-red-500" : "opacity-100 scale-100 rotate-0 text-white")}`)} style="width: 32px; height: 32px;"><path d="M12 4a3 1 0 1 1 0-2 3 1 0 1 1 0 2z"></path><path d="M11 9.5c-2.5-3-6-3.5-8-2.5 1 2.5 3 4.5 6 4.5 1 0 2-.5 2-2z"></path><path d="M13 9.5c2.5-3 6-3.5 8-2.5-1 2.5-3 4.5-6 4.5-1 0-2-.5-2-2z"></path><path d="M12 9.5v8.5"></path><path d="M9 18h6"></path></svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${attr_class(`absolute transition-all duration-700 ease-in-out ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "opacity-100 scale-100 rotate-0 text-red-500" : "opacity-0 scale-50 -rotate-90 text-white")}`)} style="width: 32px; height: 32px;"><path d="M9 8c-3-2-5-5-5-5s2 4 4 5z"></path><path d="M15 8c3-2 5-5 5-5s-2 4-4 5z"></path><path d="M12 20A8 8 0 1 0 12 4a8 8 0 0 0 0 16z"></path><path d="M8 12l2 1"></path><path d="M16 12l-2 1"></path></svg></a> <span${attr_class(`font-semibold text-xl hidden sm:block tracking-wide transition-colors duration-700 ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "text-red-500 font-bold" : "text-white")}`)}>SOLARYX</span></div> `);
    if (store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/login" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/signup" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/create" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/create-charity" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/settings" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/terms" && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/profile") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center bg-white/5 border border-white/10 rounded-full py-2.5 px-5 w-full max-w-[450px] transition-all duration-300 focus-within:bg-white/[0.08] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"><svg class="w-[18px] h-[18px] text-gray-400 mr-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> <input type="text" placeholder="Search..." class="bg-transparent border-none text-white w-full outline-none text-[0.95rem] placeholder-gray-400"${attr("value", store_get($$store_subs ??= {}, "$searchQueryStore", searchQueryStore))}/></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$page", page).url.pathname === "/" || store_get($$store_subs ??= {}, "$page", page).url.pathname === "/my-bets" || store_get($$store_subs ??= {}, "$page", page).url.pathname === "/leaderboard") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-2 ml-2"><!--[-->`);
      const each_array = ensure_array_like(topics);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let topic = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-300 ease-in-out ${stringify(store_get($$store_subs ??= {}, "$activeTopicStore", activeTopicStore) === topic && store_get($$store_subs ??= {}, "$page", page).url.pathname !== "/leaderboard" ? store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-red-900/40 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]" : store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "text-red-700 hover:text-red-400 hover:bg-red-900/20" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50")}`)}>${escape_html(topic)}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-4 pl-4"><a href="/leaderboard"${attr_class(`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm transition-all duration-300 ease-in-out no-underline ${stringify(store_get($$store_subs ??= {}, "$page", page).url.pathname === "/leaderboard" ? store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-red-900/40 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]" : store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "text-red-700 hover:text-red-400 hover:bg-red-900/20" : "text-gray-300 hover:text-white hover:bg-white/10")}`)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> <span class="hidden sm:inline">Leaderboard</span></a> `);
    if (!data?.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/login" class="px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-gray-300 bg-transparent hover:text-white hover:bg-white/10">LOGIN</a> <a href="/signup"${attr_class(`px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-white hover:-translate-y-px ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)] hover:bg-red-800 hover:shadow-[0_6px_20px_rgba(220,38,38,0.6)]" : "bg-blue-500 shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(59,130,246,0.39)]")}`)}>SIGN UP</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data?.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="relative"><button${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 hover:-translate-y-px cursor-pointer ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-red-950/30 border-red-900/50 text-red-300 hover:bg-red-900/40" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white")}`)}>`);
      if (store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "SOL") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg class="w-3.5 h-3.5" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="currentColor"></path><path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="currentColor"></path><path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="currentColor"></path></svg> <span>${escape_html(formatSol(data.user.balance_sol))} SOL</span>`);
      } else if (store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "USD") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<span>$${escape_html(((data.user.balance_sol ?? 0) * store_get($$store_subs ??= {}, "$exchangeRatesStore", exchangeRatesStore).usd).toFixed(2))} USD</span>`);
      } else if (store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "CAD") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<span>$${escape_html(((data.user.balance_sol ?? 0) * store_get($$store_subs ??= {}, "$exchangeRatesStore", exchangeRatesStore).cad).toFixed(2))} CAD</span>`);
      } else if (store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "EUR") {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`<span>€${escape_html(((data.user.balance_sol ?? 0) * store_get($$store_subs ??= {}, "$exchangeRatesStore", exchangeRatesStore).eur).toFixed(2))} EUR</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <svg class="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button> <div${attr_class(`dropdown-menu absolute right-0 mt-3 w-32 bg-gray-900 border border-gray-800 rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden transform origin-top-right ${stringify("opacity-0 invisible scale-95")}`)}><button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "SOL" ? "bg-gray-800/50 text-white font-bold" : "")}`)}>SOL</button> <button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "USD" ? "bg-gray-800/50 text-white font-bold" : "")}`)}>USD</button> <button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "CAD" ? "bg-gray-800/50 text-white font-bold" : "")}`)}>CAD</button> <button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "EUR" ? "bg-gray-800/50 text-white font-bold" : "")}`)}>EUR</button></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="relative"><button class="flex items-center gap-1 border-none cursor-pointer p-2 text-gray-300 bg-transparent hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button> <div${attr_class(`dropdown-menu absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden transform origin-top-right ${stringify("opacity-0 invisible scale-95")}`)}>`);
    if (data?.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/profile" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Profile</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <a href="/wallet" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Wallet</a> <a href="/create" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Create Market</a> <a href="/create-charity" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Create Charity</a> <a href="/settings" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Settings</a> `);
    if (data?.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="border-t border-gray-800 my-1"></div> <a href="/logout" class="block px-4 py-3 text-sm text-red-500 hover:bg-red-900/30 transition-colors">Logout</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div></nav></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, data } = $$props;
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Solaryx</title>`);
      });
      $$renderer3.push(`<link rel="icon" href="/favicon.ico"/>`);
    });
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    Header($$renderer2, { data });
    $$renderer2.push(`<!----> <main class="min-h-screen">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main>`);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-C5fc9Ivw.js.map
