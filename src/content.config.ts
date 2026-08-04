import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const junks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/junks' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // public配下のパス。実ファイルが無くても一覧側でフォールバック表示する
    thumbnail: z.string(),
    // プロジェクト本体へのリンク（相対パスはbase込みで解決、http(s)から始まる場合は外部リンクとしてそのまま使う）
    url: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
  }),
});

export const collections = { junks };
