import { m as ssr_context, n as store_set } from './index2-CCZAVGyA.js';
import './root-_rt12MkU.js';
import './state.svelte-BDSTjmUw.js';
import { t as themeLockedStore } from './theme-BGWSFPhB.js';
import './attributes-PglfaXXh.js';
import './escaping-CqgfEcN3.js';
import './index-W5rMZ-EO.js';

function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    onDestroy(() => {
      store_set(themeLockedStore, false);
    });
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center min-h-[60vh]"><p class="text-gray-400 text-sm">Loading market...</p></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BjQfQYRk.js.map
