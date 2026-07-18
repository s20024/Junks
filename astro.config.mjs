// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages (プロジェクトサイト) 向け設定。
// 既存プロジェクトは public/ 配下にあり、URL は https://s20024.github.io/Junks/<slug>/ を維持する。
export default defineConfig({
  site: 'https://s20024.github.io',
  base: '/Junks',
});
