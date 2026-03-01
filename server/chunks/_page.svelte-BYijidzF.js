import { c as attr_class, d as stringify, f as store_get, k as unsubscribe_stores } from './index2-DepLL4jW.js';
import { i as isHydeStore } from './theme-BFrXHlwE.js';
import { a as attr } from './attributes-DmmHphcL.js';
import { e as escape_html } from './escaping-CqgfEcN3.js';
import './context-CuKPUhzf.js';
import './index-B_Ibri8K.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let name = "";
    let description = "";
    let link = "";
    let logoUrl = "";
    let walletAddress = "";
    let submitting = false;
    $$renderer2.push(`<div class="max-w-2xl mx-auto px-6 md:px-10 py-12"><h1 class="text-3xl font-extrabold text-white mb-8 tracking-tight">Create Charity</h1> <div${attr_class(`rounded-2xl border p-8 space-y-6 ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#200505] border-red-900/40" : "bg-[#11141c] border-gray-800")}`)}><div class="space-y-2"><label for="charity-name" class="block text-sm font-semibold text-gray-300">Name</label> <input id="charity-name" type="text" placeholder="e.g. Red Cross"${attr_class(`w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}${attr("value", name)}/></div> <div class="space-y-2"><label for="charity-desc" class="block text-sm font-semibold text-gray-300">Description</label> <textarea id="charity-desc" rows="3" placeholder="What does this charity do..."${attr_class(`w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none resize-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}>`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="space-y-2"><label for="charity-link" class="block text-sm font-semibold text-gray-300">Website</label> <input id="charity-link" type="url" placeholder="https://example.org"${attr_class(`w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}${attr("value", link)}/></div> <div class="space-y-2"><label for="charity-logo" class="block text-sm font-semibold text-gray-300">Logo URL</label> <input id="charity-logo" type="url" placeholder="https://example.org/logo.png"${attr_class(`w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}${attr("value", logoUrl)}/></div> <div class="space-y-2"><label for="charity-wallet" class="block text-sm font-semibold text-gray-300">Solana Wallet Address</label> <input id="charity-wallet" type="text" placeholder="e.g. 7xKX..."${attr_class(`w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors font-mono text-sm ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}${attr("value", walletAddress)}/></div> <button type="button"${attr("disabled", submitting, true)}${attr_class(`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 cursor-pointer mt-2 ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-red-600 hover:bg-red-700 shadow-[0_4px_14px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.5)]" : "bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]")} ${stringify("")}`)}>${escape_html("Create Charity")}</button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BYijidzF.js.map
