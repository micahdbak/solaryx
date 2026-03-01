import { j as ensure_array_like, c as attr_class, d as stringify, m as bind_props } from './index2-DepLL4jW.js';
import { f as fallback, a as attr } from './attributes-DmmHphcL.js';
import { e as escape_html } from './escaping-CqgfEcN3.js';
import './context-CuKPUhzf.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let tmp = data, topUsers = fallback(tmp.topUsers, () => [], true), biggestWins = fallback(tmp.biggestWins, () => [], true);
    let currentTab = "monthly";
    let tabs = [
      { id: "today", label: "Today" },
      { id: "weekly", label: "Weekly" },
      { id: "monthly", label: "Monthly" },
      { id: "all", label: "All" }
    ];
    function formatAmount(amount) {
      const val = parseFloat(amount || 0);
      return `+$${(val * 100).toLocaleString(void 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    $$renderer2.push(`<div class="px-4 py-8 max-w-[1400px] mx-auto min-h-screen text-slate-100 font-sans"><div class="flex flex-col lg:flex-row gap-12 items-start relative"><div class="flex-1 w-full min-w-0"><h1 class="text-4xl font-bold mb-8 tracking-tight">Leaderboard</h1> <div class="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 mb-8"><div class="flex bg-slate-800/60 p-1 rounded-xl w-full sm:w-auto overflow-x-auto text-sm"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`px-5 py-2 whitespace-nowrap rounded-lg font-medium transition-colors ${stringify(currentTab === tab.id ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200")}`)}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-4 w-full sm:w-auto items-center text-sm font-medium"><button class="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">All Categories <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div></div> <div class="flex items-center text-xs text-slate-400 mb-4 px-4 font-semibold uppercase tracking-wider"><div class="flex-1 flex gap-2 items-center"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <input type="text" placeholder="Search by name" class="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full"/></div> <div class="w-32 text-right relative"><span class="pb-2 inline-block">Profit/Loss</span> <div class="absolute bottom-0 right-0 w-8 h-[2px] bg-white"></div></div> <div class="w-24 text-right hidden sm:block">Volume</div></div> <hr class="border-slate-800 mb-2"/> <div class="flex flex-col gap-1"><!--[-->`);
    const each_array_1 = ensure_array_like(topUsers);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let user = each_array_1[i];
      $$renderer2.push(`<div class="flex items-center px-4 py-3 hover:bg-slate-800/40 transition-colors rounded-xl text-sm"><div class="w-6 text-slate-500 text-xs text-right mr-4 font-mono">${escape_html(i + 1)}</div> <div class="flex-1 flex items-center gap-4"><div class="relative w-10 h-10 shrink-0"><img${attr("src", user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username)} alt="avatar" class="w-full h-full rounded-full object-cover shrink-0"/> `);
      if (i === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute -bottom-1 -left-1 text-lg leading-none filter drop-shadow">🥇</div>`);
      } else if (i === 1) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="absolute -bottom-1 -left-1 text-lg leading-none filter drop-shadow">🥈</div>`);
      } else if (i === 2) {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<div class="absolute -bottom-1 -left-1 text-lg leading-none filter drop-shadow">🥉</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <span class="font-bold text-slate-200 truncate pr-4 text-base">${escape_html(user.username)}</span></div> <div class="w-32 text-right font-bold text-white tracking-tight">${escape_html(formatAmount(user.total_donated))}</div> <div class="w-24 text-right text-slate-400 font-medium hidden sm:block">$${escape_html((parseFloat(user.total_donated) * 10 * Math.random()).toLocaleString(void 0, { maximumFractionDigits: 0 }))}</div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (topUsers.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-12 text-slate-500">No data available for this timeframe.</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="w-full lg:w-[400px] shrink-0 sticky top-24 self-start"><div class="bg-[#1c1c21] rounded-2xl p-6 border border-slate-800/60 shadow-xl shadow-black/20 flex flex-col h-[70vh] lg:h-[80vh] min-h-[500px]"><h2 class="text-xl font-bold mb-6 text-white tracking-tight shrink-0">Biggest wins this month</h2> <div class="overflow-y-auto flex-1 pr-2 -mr-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent svelte-c59208"><!--[-->`);
    const each_array_2 = ensure_array_like(biggestWins);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let win = each_array_2[i];
      $$renderer2.push(`<div class="flex items-start gap-4"><div class="w-4 text-slate-500 text-xs pt-2 font-mono shrink-0">${escape_html(i + 1)}</div> <img${attr("src", win.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + win.username)} alt="avatar" class="w-10 h-10 rounded-full object-cover shrink-0"/> <div class="min-w-0 flex-1 leading-tight mt-0.5"><div class="flex items-center flex-wrap gap-x-2"><span class="font-bold text-slate-200 truncate max-w-[120px]">${escape_html(win.username)}</span> <span class="text-slate-400 text-xs truncate flex-1">${escape_html(win.market_title)}</span></div> <div class="text-sm mt-1 flex items-center gap-2"><span class="text-slate-300 font-medium line-through decoration-slate-500/50">$${escape_html((parseFloat(win.amount_sol) * 30).toLocaleString(void 0, { maximumFractionDigits: 0 }))}</span> <span class="text-[#22c55e] font-bold">→ ${escape_html(formatAmount(win.amount_sol))}</span></div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (biggestWins.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-8 text-slate-500 text-sm">No big wins this month yet.</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div></div></div>`);
    bind_props($$props, { data });
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-ByKXhYGj.js.map
