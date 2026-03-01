import { a as attr } from './attributes-PglfaXXh.js';
import './escaping-CqgfEcN3.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let email = "";
    let password = "";
    $$renderer2.push(`<div class="flex items-center justify-center min-h-[calc(100vh-80px)] px-4"><div class="w-full max-w-md"><div class="bg-[#11141c] border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-5"><h1 class="text-2xl font-bold text-white text-center mb-2">Log In</h1> <div class="space-y-1.5"><label for="login-email" class="block text-sm font-semibold text-gray-300">Email</label> <input id="login-email" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" type="text" placeholder="name@example.com"${attr("value", email)}/></div> <div class="space-y-1.5"><label for="login-password" class="block text-sm font-semibold text-gray-300">Password</label> <input id="login-password" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" type="password" placeholder="••••••••"${attr("value", password)}/></div> <button class="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-[0_4px_14px_0_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.5)] cursor-pointer mt-2" type="button">Log In</button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <p class="text-center text-sm text-gray-400 pt-2">Don't have an account? <a href="/signup" class="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign Up</a></p></div></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DGoswMEN.js.map
