import { m as store_set } from './index2-B8lvG46o.js';
import { o as onDestroy } from './index-server-rV_ykSw2.js';
import { t as themeLockedStore } from './theme-FXW1Sz_r.js';
import './root-MNg7jatu.js';
import './state.svelte-Cs4ef96Q.js';
import '@solana/web3.js';
import './attributes-DmmHphcL.js';
import './escaping-CqgfEcN3.js';
import './context-CuKPUhzf.js';
import './index-D1wIZuTd.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    onDestroy(() => {
      store_set(themeLockedStore, false);
    });
    $$renderer2.push(`<div class="max-w-[1000px] mx-auto p-4 md:p-8 w-full mt-4"><div class="mb-8"><h1 class="text-3xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">Wallet Dashboard</h1> <p class="text-[var(--text-muted)]">Manage your connected wallet, external funds, and platform balance.</p></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center min-h-[40vh]"><p class="text-gray-500 font-medium animate-pulse">Loading wallet data...</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CSkyaD0k.js.map
