import { k as ensure_array_like, c as attr_class, d as stringify, f as store_get, l as unsubscribe_stores } from './index2-B8lvG46o.js';
import { i as isHydeStore } from './theme-FXW1Sz_r.js';
import { e as escape_html } from './escaping-CqgfEcN3.js';
import { a as attr } from './attributes-DmmHphcL.js';
import './context-CuKPUhzf.js';
import './index-D1wIZuTd.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const menuItems = [
      {
        label: "Account",
        icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
        description: "Manage your profile and account details"
      },
      {
        label: "Security",
        icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        description: "Password, two-factor authentication"
      },
      {
        label: "Privacy",
        icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
        description: "Control your data and visibility"
      },
      {
        label: "Transaction History",
        icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
        description: "View your donation and betting history"
      },
      {
        label: "Terms & Conditions",
        icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
        description: "Read our terms of service"
      },
      {
        label: "Help",
        icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
        description: "FAQs and troubleshooting"
      },
      {
        label: "Contact",
        icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
        description: "Get in touch with our team"
      }
    ];
    $$renderer2.push(`<div class="max-w-3xl mx-auto px-6 md:px-10 py-12"><div class="space-y-4"><!--[-->`);
    const each_array = ensure_array_like(menuItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<button class="w-full text-left bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--text-muted)]/40 rounded-xl px-10 py-8 transition-all duration-200 cursor-pointer group reactive-hover"><div class="flex items-center gap-6 m-3"><div class="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${attr_class(`${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "text-red-400" : "text-blue-400")} transition-colors`)}><path${attr("d", item.icon)}></path></svg></div> <div class="flex-1 min-w-0"><div class="text-[#e0e4f0] font-semibold text-sm group-hover:text-gray-100">${escape_html(item.label)}</div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "text-red-800" : "text-gray-500")} text-xs mt-0.5 transition-colors`)}>${escape_html(item.description)}</div></div> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${attr_class(`${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "text-red-700" : "text-gray-600")} group-hover:translate-x-1 transition-all`)}><path d="m9 18 6-6-6-6"></path></svg></div></button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C_amX1Hi.js.map
