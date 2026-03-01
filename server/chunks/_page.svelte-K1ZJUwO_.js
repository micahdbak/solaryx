import { c as attr_class, d as stringify } from './index2-B8lvG46o.js';
import { a as attr } from './attributes-DmmHphcL.js';
import './escaping-CqgfEcN3.js';
import './context-CuKPUhzf.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let username = "";
    let email = "";
    let password = "";
    let passwordAgain = "";
    $$renderer2.push(`<div class="flex items-center justify-center min-h-[calc(100vh-80px)] px-4"><div class="w-full max-w-md"><div class="text-center mb-8"><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">Solaryx Welcomes You</h1></div> <div class="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-8 shadow-2xl space-y-5"><div class="space-y-1.5 relative"><label for="signup-username" class="block text-sm font-semibold text-[var(--text-muted)]">Username</label> <div class="relative"><input id="signup-username"${attr_class(`w-full bg-[var(--bg-input)] border ${stringify("border-[var(--border-input)]")} rounded-lg px-4 py-3 pr-10 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors`)} type="text" placeholder="CryptoWhale"${attr("value", username)}/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="space-y-1.5"><label for="signup-email" class="block text-sm font-semibold text-[var(--text-muted)]">Email</label> <input id="signup-email" class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors" type="text" placeholder="name@example.com"${attr("value", email)}/></div> <div class="space-y-1.5"><label for="signup-password" class="block text-sm font-semibold text-[var(--text-muted)]">Password</label> <input id="signup-password" class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors" type="password" placeholder="••••••••"${attr("value", password)}/></div> <div class="space-y-1.5"><label for="signup-password-again" class="block text-sm font-semibold text-[var(--text-muted)]">Confirm Password</label> <input id="signup-password-again" class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors" type="password" placeholder="••••••••"${attr("value", passwordAgain)}/></div> <button class="w-full py-3 rounded-lg font-bold text-[#e0e4f0] bg-[var(--color-primary)] hover:brightness-110 transition-all duration-200 shadow-[0_4px_14px_0_rgba(122,162,247,0.2)] hover:shadow-[0_6px_20px_0_rgba(122,162,247,0.3)] cursor-pointer mt-2" type="button">Create Account</button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <p class="text-center text-sm text-[var(--text-muted)] pt-2">Already have an account? <a href="/login" class="text-[var(--color-primary)] hover:brightness-125 font-semibold transition-colors">Log In</a></p></div></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-K1ZJUwO_.js.map
