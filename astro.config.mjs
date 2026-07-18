// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const base = '/Junks';
const publicDir = fileURLToPath(new URL('./public', import.meta.url));

// astro dev は public/ 配下のディレクトリURL(例: /Junks/react-three-city/)を
// index.html に解決しないため、本番の静的サーバー(GitHub Pages / astro preview)と
// 同じディレクトリインデックス解決を dev サーバーにだけ追加する。
/** @returns {import('astro').AstroIntegration} */
function publicDirectoryIndex() {
  return {
    name: 'public-directory-index',
    hooks: {
      'astro:server:setup'({ server }) {
        /** @type {import('vite').Connect.NextHandleFunction} */
        const handler = (req, res, next) => {
          if (req.method !== 'GET' && req.method !== 'HEAD') return next();
          const pathname = decodeURIComponent((req.url ?? '').split('?')[0]);
          if (pathname.includes('..')) return next();
          // Astro dev はこのミドルウェアに届く前に base を剥がすが、
          // 念のため base 付きのパスも受け付ける
          const rest = pathname.startsWith(`${base}/`)
            ? pathname.slice(base.length)
            : pathname;
          const indexFile = path.join(publicDir, rest, 'index.html');
          if (!existsSync(indexFile)) return next();
          if (!rest.endsWith('/')) {
            // 末尾スラッシュ無しは本番(GitHub Pages)と同じくスラッシュ付きへ
            res.statusCode = 301;
            res.setHeader('Location', `${base}${rest}/`);
            res.end();
            return;
          }
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(readFileSync(indexFile));
        };
        // Astro本体の404ハンドラより先に処理するため、スタックの先頭に積む
        server.middlewares.use(handler);
        const layer = server.middlewares.stack.pop();
        if (layer) server.middlewares.stack.unshift(layer);
      },
    },
  };
}

// GitHub Pages (プロジェクトサイト) 向け設定。
// 既存プロジェクトは public/ 配下にあり、URL は https://s20024.github.io/Junks/<slug>/ を維持する。
export default defineConfig({
  site: 'https://s20024.github.io',
  base,
  integrations: [publicDirectoryIndex()],
});
