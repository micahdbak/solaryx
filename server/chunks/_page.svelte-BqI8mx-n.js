import { m as store_set } from './index2-B8lvG46o.js';
import { o as onDestroy } from './index-server-rV_ykSw2.js';
import './root-MNg7jatu.js';
import './state.svelte-Cs4ef96Q.js';
import { t as themeLockedStore } from './theme-FXW1Sz_r.js';
import './attributes-DmmHphcL.js';
import './escaping-CqgfEcN3.js';
import './context-CuKPUhzf.js';
import './index-D1wIZuTd.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    onDestroy(() => {
      store_set(themeLockedStore, false);
    });
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center min-h-[60vh] svelte-kk735k"><p class="text-gray-400 text-sm svelte-kk735k">Loading market...</p></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BqI8mx-n.js.map
