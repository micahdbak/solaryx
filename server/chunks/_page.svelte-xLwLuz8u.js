import { c as attr_class, d as stringify, f as store_get, j as ensure_array_like, k as unsubscribe_stores } from './index2-CzTCGPOT.js';
import { e as escape_html } from './escaping-CqgfEcN3.js';
import { i as isHydeStore } from './theme-KQ8J5K_H.js';
import { a as attr } from './attributes-PglfaXXh.js';
import './context-DBa-_tdZ.js';
import './index-C_O_tEO_.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let title = "";
    let description = "";
    let durationValue = 1;
    let durationUnit = "d";
    let charityA = "";
    let charityB = "";
    let submitting = false;
    let charities = [];
    $$renderer2.push(`<div class="max-w-2xl mx-auto px-6 md:px-10 py-12"><h1 class="text-3xl font-extrabold text-white mb-8 tracking-tight">Create Market</h1> <div${attr_class(`rounded-2xl border p-8 space-y-6 ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#200505] border-red-900/40" : "bg-[#11141c] border-gray-800")}`)}><div class="space-y-2"><label for="market-title" class="block text-sm font-semibold text-gray-300">Title</label> <input id="market-title" type="text" placeholder="e.g. Wildlife Protection: WWF vs WCS"${attr_class(`w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}${attr("value", title)}/></div> <div class="space-y-2"><label for="market-desc" class="block text-sm font-semibold text-gray-300">Description</label> <textarea id="market-desc" rows="3" placeholder="Describe what this market is about..."${attr_class(`w-full rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none resize-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}>`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="space-y-2"><label class="block text-sm font-semibold text-gray-300">Type</label> <div class="flex gap-3"><button type="button"${attr_class(`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border ${stringify(
      "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
    )}`)}>Jekyll</button> <button type="button"${attr_class(`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-transparent border-red-900/40 text-gray-400 hover:border-red-700" : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500")}`)}>Hyde</button></div></div> <div class="space-y-2"><label for="market-duration" class="block text-sm font-semibold text-gray-300">Time length</label> <div class="flex gap-3"><input id="market-duration" type="number" min="1"${attr_class(`w-1/2 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`)}${attr("value", durationValue)}/> `);
    $$renderer2.select(
      {
        class: `w-1/2 rounded-lg px-4 py-3 text-white outline-none transition-colors cursor-pointer ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "bg-black border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")}`,
        value: durationUnit
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "m" }, ($$renderer4) => {
          $$renderer4.push(`Minute(s)`);
        });
        $$renderer3.option({ value: "h" }, ($$renderer4) => {
          $$renderer4.push(`Hour(s)`);
        });
        $$renderer3.option({ value: "d" }, ($$renderer4) => {
          $$renderer4.push(`Day(s)`);
        });
        $$renderer3.option({ value: "w" }, ($$renderer4) => {
          $$renderer4.push(`Week(s)`);
        });
      }
    );
    $$renderer2.push(`</div></div> <div class="space-y-2"><label class="block text-sm font-semibold text-gray-300">Charities</label> `);
    if (charities.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-gray-500 text-sm italic">No charities available yet. Create charities via the API first.</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-2 gap-3">`);
      $$renderer2.select(
        {
          class: `rounded-lg px-4 py-3 text-white outline-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50" : "bg-black border border-gray-700")}`,
          value: charityA
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`Select Charity A`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(charities);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let c = each_array[$$index];
            $$renderer3.option({ value: c.id }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(c.name)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          class: `rounded-lg px-4 py-3 text-white outline-none transition-colors ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-[#150000] border border-red-900/50" : "bg-black border border-gray-700")}`,
          value: charityB
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`Select Charity B`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(charities);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let c = each_array_1[$$index_1];
            $$renderer3.option({ value: c.id }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(c.name)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div>`);
    }
    $$renderer2.push(`<!--]--></div> <button type="button"${attr("disabled", submitting, true)}${attr_class(`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 cursor-pointer mt-2 ${stringify(store_get($$store_subs ??= {}, "$isHydeStore", isHydeStore) ? "bg-red-600 hover:bg-red-700 shadow-[0_4px_14px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.5)]" : "bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]")} ${stringify("")}`)}>${escape_html("Create Market")}</button> `);
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
//# sourceMappingURL=_page.svelte-xLwLuz8u.js.map
