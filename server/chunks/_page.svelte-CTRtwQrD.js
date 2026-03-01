import { f as store_get, l as unsubscribe_stores } from './index2-B8lvG46o.js';
import { p as page } from './stores-CT5_NKvC.js';
import './attributes-DmmHphcL.js';
import './escaping-CqgfEcN3.js';
import './context-CuKPUhzf.js';
import './root-MNg7jatu.js';
import './state.svelte-Cs4ef96Q.js';

function ProfileView($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="max-w-[1240px] mx-auto p-4 md:p-6 lg:p-8 pt-8 font-sans">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-20"><p class="text-[var(--text-muted)] text-sm">Loading profile...</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    ProfileView($$renderer2, {
      userId: store_get($$store_subs ??= {}, "$page", page).params.id
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CTRtwQrD.js.map
