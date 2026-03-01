import { c as attr_class, k as ensure_array_like, d as stringify } from './index2-B8lvG46o.js';
import { e as escape_html } from './escaping-CqgfEcN3.js';
import { a as attr } from './attributes-DmmHphcL.js';
import './context-CuKPUhzf.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let title = "";
    let description = "";
    let durationValue = 1;
    let durationUnit = "d";
    let charityA = "";
    let charityB = "";
    let submitting = false;
    let charities = [];
    $$renderer2.push(`<div class="max-w-2xl mx-auto px-6 md:px-10 py-12"><h1 class="text-3xl font-extrabold text-[var(--text-primary)] mb-8 tracking-tight">Create Market</h1> <div class="rounded-2xl border p-8 space-y-6 bg-[var(--bg-card)] border-[var(--border-card)]"><div class="space-y-2"><label for="market-title" class="block text-sm font-semibold text-[var(--text-muted)]">Title</label> <input id="market-title" type="text" placeholder="e.g. Wildlife Protection: WWF vs WCS" class="w-full rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"${attr("value", title)}/></div> <div class="space-y-2"><label for="market-desc" class="block text-sm font-semibold text-[var(--text-muted)]">Description</label> <textarea id="market-desc" rows="3" placeholder="Describe what this market is about..." class="w-full rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none resize-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]">`);
    const $$body = escape_html(description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="space-y-2"><label class="block text-sm font-semibold text-[var(--text-muted)]">Type</label> <div class="flex gap-3"><button type="button"${attr_class(`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border ${stringify(
      "bg-[var(--color-primary)] border-[var(--color-primary)] text-[#e0e4f0] shadow-[0_0_12px_rgba(122,162,247,0.2)]"
    )}`)}>Jekyll</button> <button type="button"${attr_class(`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer border ${stringify("bg-transparent border-[var(--border-card)] text-[var(--text-muted)] hover:border-[var(--text-muted)]")}`)}>Hyde</button></div></div> <div class="space-y-2"><label for="market-duration" class="block text-sm font-semibold text-[var(--text-muted)]">Time length</label> <div class="flex gap-3"><input id="market-duration" type="number" min="1" class="w-1/2 rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"${attr("value", durationValue)}/> `);
    $$renderer2.select(
      {
        class: "w-1/2 rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none transition-colors cursor-pointer bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
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
    $$renderer2.push(`</div></div> <div class="space-y-2"><label class="block text-sm font-semibold text-[var(--text-muted)]">Charities</label> `);
    if (charities.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-[var(--text-muted)] text-sm italic">No charities available yet. Create charities via the API first.</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-2 gap-3">`);
      $$renderer2.select(
        {
          class: "rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)]",
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
          class: "rounded-lg px-4 py-3 text-[var(--text-primary)] outline-none transition-colors bg-[var(--bg-input)] border border-[var(--border-input)]",
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
    $$renderer2.push(`<!--]--></div> <button type="button"${attr("disabled", submitting, true)}${attr_class(`w-full py-3 rounded-lg font-bold text-[#e0e4f0] transition-all duration-300 cursor-pointer mt-2 bg-[var(--color-primary)] hover:brightness-110 shadow-[0_4px_14px_rgba(122,162,247,0.2)] hover:shadow-[0_6px_20px_rgba(122,162,247,0.3)] ${stringify("")}`)}>${escape_html("Create Market")}</button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CL_ehK1J.js.map
