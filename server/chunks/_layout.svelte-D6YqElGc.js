import { h as head, c as attr_class, d as stringify, f as store_get, j as attr_style, k as ensure_array_like, l as unsubscribe_stores } from './index2-B8lvG46o.js';
import { t as themeLockedStore, i as isHydeStore, s as searchQueryStore, a as activeTopicStore, b as selectedCurrencyStore, e as exchangeRatesStore } from './theme-FXW1Sz_r.js';
import { p as page } from './stores-CT5_NKvC.js';
import { e as escape_html } from './escaping-CqgfEcN3.js';
import { a as attr } from './attributes-DmmHphcL.js';
import './context-CuKPUhzf.js';
import './index-D1wIZuTd.js';
import './root-MNg7jatu.js';
import './state.svelte-Cs4ef96Q.js';

function formatSol(amount) {
  const num = Number(amount);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 9 }).format(num);
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const topics = ["Trending", "New", "Expiring Soon"];
    let pillStyle = "";
    $$renderer2.push(`<header class="sticky top-0 z-50 backdrop-blur transition-colors duration-700 ease-in-out border-b bg-[#0b0f19]/90 border-gray-800/60"><nav class="flex justify-between items-center px-4 md:px-8 py-4 w-full"><div class="flex items-center flex-1"><div class="flex items-center gap-1 mr-8 md:mr-12"><button${attr_class(`bg-transparent border-none flex items-center justify-center w-12 h-12 text-2xl text-[#e0e4f0] no-underline tracking-wide whitespace-nowrap transition-all cursor-pointer relative ${stringify(store_get($$store_subs ??= {}, "$themeLockedStore", themeLockedStore) ? "opacity-50 grayscale scale-95 cursor-not-allowed" : "hover:scale-105")}`)} aria-label="Toggle theme"${attr("disabled", store_get($$store_subs ??= {}, "$themeLockedStore", themeLockedStore), true)}>`);
    if (store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img src="/hyde.png" alt="Icon" style="width: 40px; height: 40px;"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<img src="/jekyll.png" alt="Icon" style="width: 40px; height: 40px;"/>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$themeLockedStore", themeLockedStore)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute -bottom-1 -right-1 bg-gray-900/80 rounded-full p-0.5 border border-white/10 scale-75"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></button> <a href="/" class="font-normal text-xl tracking-wide transition-colors duration-700">SOLARYX</a></div> `);
    if (![
      "/login",
      "/signup",
      "/create",
      "/create-charity",
      "/settings",
      "/terms",
      "/profile",
      "/wallet",
      "/leaderboard"
    ].includes(store_get($$store_subs ??= {}, "$page", page).url.pathname)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center"><div class="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full py-2.5 px-5 w-full max-w-[450px] transition-all duration-300 focus-within:bg-white/[0.08] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"><svg class="w-[18px] h-[18px] text-gray-400 mr-3 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> <input type="text" placeholder="Search..." class="bg-transparent border-none text-[#e0e4f0] w-full outline-none text-[0.95rem] placeholder-gray-400"${attr("value", store_get($$store_subs ??= {}, "$searchQueryStore", searchQueryStore))}/></div> <button class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$page", page).url.pathname === "/" || store_get($$store_subs ??= {}, "$page", page).url.pathname === "/my-bets") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="topic-switcher hidden md:flex items-center ml-2 rounded-full p-0.5 bg-white/[0.06] relative"><div class="topic-pill absolute top-0.5 left-0 h-[calc(100%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none bg-white/[0.12] shadow-[0_0_12px_rgba(255,255,255,0.08)]"${attr_style(pillStyle)}></div> <!--[-->`);
      const each_array = ensure_array_like(topics);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let topic = each_array[i];
        $$renderer2.push(`<button${attr_class(`relative z-10 px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-colors duration-300 ease-in-out bg-transparent border-none cursor-pointer ${stringify(store_get($$store_subs ??= {}, "$activeTopicStore", activeTopicStore) === topic ? "text-[#e0e4f0]" : "text-gray-400 hover:text-gray-200")}`)}>${escape_html(topic)}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4"><a href="/leaderboard"${attr_class(`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-300 ease-in-out no-underline ${stringify(store_get($$store_subs ??= {}, "$page", page).url.pathname === "/leaderboard" ? "bg-white/10 text-[#e0e4f0] shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50")}`)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> <span class="hidden sm:inline">Leaderboard</span></a> `);
    if (!data?.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/login" class="px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-gray-300 bg-transparent hover:text-[#e0e4f0] hover:bg-white/10">LOGIN</a> <a href="/signup" class="px-5 py-2 rounded-full font-semibold no-underline transition-all duration-700 text-sm cursor-pointer whitespace-nowrap text-[#e0e4f0] hover:-translate-y-px bg-blue-500 shadow-[0_4px_14px_rgba(59,130,246,0.39)] hover:bg-blue-600 hover:shadow-[0_6px_20px_rgba(59,130,246,0.39)]">SIGN UP</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data?.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="relative"><button class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 hover:-translate-y-px cursor-pointer bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-[#e0e4f0]">`);
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
      $$renderer2.push(`<!--]--> <svg class="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button> <div${attr_class(`dropdown-menu absolute right-0 mt-3 w-32 bg-gray-900 border border-gray-800 rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden transform origin-top-right ${stringify("opacity-0 invisible scale-95")}`)}><button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "SOL" ? "bg-gray-800/50 text-[#e0e4f0] font-bold" : "")}`)}>SOL</button> <button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "USD" ? "bg-gray-800/50 text-[#e0e4f0] font-bold" : "")}`)}>USD</button> <button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "CAD" ? "bg-gray-800/50 text-[#e0e4f0] font-bold" : "")}`)}>CAD</button> <button${attr_class(`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors ${stringify(store_get($$store_subs ??= {}, "$selectedCurrencyStore", selectedCurrencyStore) === "EUR" ? "bg-gray-800/50 text-[#e0e4f0] font-bold" : "")}`)}>EUR</button></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data?.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="relative"><button class="flex items-center gap-1 border-none cursor-pointer p-2 text-gray-300 bg-transparent hover:text-[#e0e4f0] hover:bg-white/10 rounded-full transition-all duration-200"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button> <div${attr_class(`dropdown-menu absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl transition-all duration-300 z-50 overflow-hidden transform origin-top-right ${stringify("opacity-0 invisible scale-95")}`)}><a href="/profile" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors">Profile</a> <a href="/wallet" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors">Wallet</a> <a href="/create" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors">Create Market</a> <a href="/create-charity" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors">Create Charity</a> <a href="/settings" class="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#e0e4f0] transition-colors">Settings</a> <div class="border-t border-gray-800 my-1"></div> <a href="/logout" class="block px-4 py-3 text-sm text-red-500 hover:bg-red-900/30 transition-colors">Logout</a></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></nav></header>`);
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
//# sourceMappingURL=_layout.svelte-D6YqElGc.js.map
