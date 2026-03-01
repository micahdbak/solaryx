import { e as escape_html } from './escaping-CqgfEcN3.js';
import './state.svelte-B8fG0fWE.js';
import './root-Ctl1xNBE.js';
import { w as writable } from './index-B_Ibri8K.js';
import { g as getContext } from './context-CuKPUhzf.js';
import './attributes-DmmHphcL.js';
import './index2-DepLL4jW.js';

function create_updated_store() {
  const { set, subscribe } = writable(false);
  {
    return {
      subscribe,
      // eslint-disable-next-line @typescript-eslint/require-await
      check: async () => false
    };
  }
}
const stores = {
  updated: /* @__PURE__ */ create_updated_store()
};
({
  check: stores.updated.check
});
function context() {
  return getContext("__request__");
}
const page$1 = {
  get error() {
    return context().page.error;
  },
  get status() {
    return context().page.status;
  }
};
const page = page$1;
function Error$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
  });
}

export { Error$1 as default };
//# sourceMappingURL=error.svelte-DQp20-nA.js.map
