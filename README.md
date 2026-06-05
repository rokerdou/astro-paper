# AstroPaper Cloudflare SSR 博客系统

这是一个基于 AstroPaper 改造的 Cloudflare 版本博客系统。项目使用 Astro SSR
保留服务端 HTML 与 SEO 优势，同时提供数据库驱动的后台管理能力。

## 技术架构

- Astro 5：负责页面 SSR、路由、SEO meta、RSS、sitemap。
- Cloudflare Pages Worker：承载 Astro SSR 运行时。
- Cloudflare D1：存储文章、标签、评论、站点设置。
- Cloudflare KV：存储后台会话相关数据。
- Cloudflare R2：存储后台上传的文章图片和文件。
- React + TanStack Query：只用于后台管理界面和评论组件。
- Pagefind：构建时生成静态搜索索引。

公开页面的核心设计目标是：**服务端直接输出完整 HTML，前台尽量少加载 JS**。

## 核心功能

- 后台文章新增、编辑、删除。
- 文章 URL slug 可在后台编辑。
- Markdown 内容在保存时预渲染为 HTML，公开文章页不在请求热路径上渲染 Markdown。
- 后台支持拖拽或选择上传图片/文件到 R2，并自动插入 Markdown 图片或文件链接。
- 评论提交、分页、审核、拒绝、删除。
- 后台配置站点标题、SEO 描述、作者、OG 图、语言、footer 版权、GitHub、X/Twitter、LinkedIn、邮箱。
- 首页、文章页、标签页、RSS、sitemap 由 Astro SSR 输出 SEO 友好内容。

## 本地要求

- Node.js 20+
- npm
- Wrangler 4+
- Cloudflare 账号，并启用 Pages、D1、KV、R2

安装依赖：

```bash
npm install
```

确认 Wrangler 登录状态：

```bash
npx wrangler whoami
```

## Cloudflare 资源创建

### 1. 创建 D1 数据库

```bash
npx wrangler d1 create astro-paper
```

创建后把返回的 `database_id` 写入 `wrangler.jsonc`。

### 2. 创建 KV 命名空间

```bash
npx wrangler kv namespace create SESSION
```

创建后把返回的 `id` 写入 `wrangler.jsonc`。

### 3. 创建 R2 Bucket

```bash
npx wrangler r2 bucket create astro-paper-assets
```

R2 bucket 用于存储文章编辑器上传的图片和文件。

## Wrangler 配置

`wrangler.jsonc` 需要包含 D1、KV、R2 绑定：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "astro-paper",
  "compatibility_date": "2026-05-31",
  "pages_build_output_dir": "./dist",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "astro-paper",
      "database_id": "your-d1-database-id",
      "migrations_dir": "./src/db/migrations"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "SESSION",
      "id": "your-kv-namespace-id"
    }
  ],
  "r2_buckets": [
    {
      "binding": "UPLOADS",
      "bucket_name": "astro-paper-assets"
    }
  ]
}
```

当前项目中的 binding 名称约定：

- `DB`：D1 数据库。
- `SESSION`：后台会话 KV。
- `UPLOADS`：R2 上传文件 bucket。

## Pages Secrets

后台认证和评论安全需要配置 Cloudflare Pages secrets。

```bash
npx wrangler pages secret put ADMIN_USERNAME --project-name astro-paper
npx wrangler pages secret put ADMIN_PASSWORD --project-name astro-paper
npx wrangler pages secret put COMMENT_HASH_SECRET --project-name astro-paper
```

建议同时在 Preview 和 Production 环境配置。`COMMENT_HASH_SECRET` 应使用足够长的随机字符串。

本地开发可以创建 `.dev.vars`：

```dotenv
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
COMMENT_HASH_SECRET=replace-with-a-long-random-secret
```

`admin/admin` 只建议用于本地或临时测试，线上必须替换。

## 数据库迁移

本地执行 D1 migrations：

```bash
npx wrangler d1 migrations apply astro-paper --local
```

远端执行 D1 migrations：

```bash
npx wrangler d1 migrations apply astro-paper --remote
```

如果你已有导入文章，但缺少 `body_html`、`headings`、`search_text` 等派生字段，需要回填：

```bash
npm run backfill:rendered
```

主要数据表：

- `posts`：文章主表，包含 slug、标题、Markdown 原文、预渲染 HTML、SEO 字段、发布状态。
- `tags`：标签。
- `posts_tags`：文章和标签的关联表。
- `tag_post_counts`：标签文章数物化表，用于降低标签导航查询成本。
- `comments`：评论和审核状态。
- `site_settings`：站点标题、SEO、footer、社交链接等运行时配置。

## 本地开发

启动开发服务器：

```bash
npm run dev
```

构建：

```bash
npm run build
```

`npm run build` 会依次执行：

1. `astro check`
2. `astro build`
3. `pagefind --site dist`
4. 复制 Pagefind 索引到 `public/pagefind`

## 部署到 Cloudflare Pages

### 方式一：命令行部署

先构建：

```bash
npm run build
```

部署 `dist`：

```bash
npx wrangler pages deploy dist --project-name astro-paper
```

部署完成后 Wrangler 会输出两个地址：

- preview 地址，例如 `https://xxxx.astro-paper-btv.pages.dev`
- alias 地址，例如 `https://cloudflare.astro-paper-btv.pages.dev`

### 方式二：Git 集成部署

也可以在 Cloudflare Pages 控制台连接 Git 仓库。

推荐配置：

- Framework preset：Astro
- Build command：`npm run build`
- Build output directory：`dist`
- Node.js version：20+

如果使用 Git 集成部署，也要确保 Pages 项目绑定了同样的 D1、KV、R2 和 secrets。

## 部署后验证清单

部署后建议逐项检查：

- `/` 首页是否正常。
- `/posts/` 文章列表是否正常。
- `/posts/{slug}/` 文章详情是否正常。
- `/tags/` 标签页是否正常。
- `/rss.xml` RSS 是否正常。
- `/sitemap-index.xml` sitemap 是否正常。
- `/admin` 后台是否需要认证。
- `/admin/settings` 是否能编辑站点设置。
- `/admin/posts/new` 是否能新增文章。
- `/admin/posts/edit/{slug}` 是否能编辑文章 URL slug。
- Markdown 编辑器拖拽上传图片或文件后，是否自动插入 Markdown 链接。
- `/uploads/...` 上传后的公开文件链接是否能访问。
- `/admin/comments` 评论审核是否正常。

## 后台使用说明

后台入口：

```text
/admin
```

文章管理：

- 新增文章：`/admin/posts/new`
- 编辑文章：`/admin/posts/edit/{slug}`
- `Post URL` 字段控制文章公开 URL：`/posts/{slug}/`
- 新文章 URL 可以留空，系统会根据标题自动生成。
- 修改文章 URL 后，会清理旧 URL 和新 URL 的公开缓存。

上传文件：

- 在 Markdown 编辑器中点击 `Upload` 选择文件。
- 或将图片/文件直接拖拽到 Markdown 文本框。
- 图片会插入为：`![filename](/uploads/...)`
- 文件会插入为：`[filename](/uploads/...)`
- 文件存储在 R2，bucket 不需要公开。
- 公开访问通过同源 Worker 路由 `/uploads/...` 代理读取。

站点设置：

- 入口：`/admin/settings`
- 可配置站点标题、网站地址、meta description、作者、作者主页、OG 图、语言方向、theme color。
- 可配置 footer 版权文案、footer 说明、GitHub、X/Twitter、LinkedIn、邮箱。
- 这些设置会由服务器渲染到公开页面，不需要前台额外请求。

评论审核：

- 入口：`/admin/comments`
- 新评论默认为 `pending`。
- 后台可以 approve、reject、delete。

## SEO 与性能原则

当前工程的公开页性能策略：

- 公开页面由 Astro SSR 输出完整 HTML。
- SEO 标签在服务端生成，包括 title、description、canonical、OG、Twitter、JSON-LD。
- Markdown 不在公开请求时渲染；后台保存时已生成 `body_html`。
- R2 上传能力只在后台编辑器加载，不影响公开文章页 JS。
- 上传文件在文章中只是普通 Markdown 图片或文件链接。
- 评论 JS 只在文章详情页加载。
- 后台 React/TanStack 代码只在后台路由加载。
- D1 查询尽量按 slug、发布状态、分页、物化标签计数控制扫描成本。
- Pagefind 是构建时搜索索引；大量新增或修改文章后，需要重新构建部署以更新静态搜索索引。

## R2 上传安全说明

上传接口：

```text
POST /api/uploads
```

安全策略：

- 上传接口属于后台 API，需要后台认证。
- 单文件最大 15 MB。
- 单次最多上传 10 个文件。
- 禁止 HTML、SVG 等更容易产生 XSS 风险的类型。
- R2 bucket 不公开，公开读取走 `/uploads/...`。
- 公开读取响应设置长缓存和 `X-Content-Type-Options: nosniff`。

## 常用命令

```bash
npm run dev
npm run build
npm run lint
npm run format:check
npm run backfill:rendered
npx wrangler d1 migrations apply astro-paper --remote
npx wrangler pages deploy dist --project-name astro-paper
```

## 生产环境上线清单

- 替换默认后台账号密码。
- 设置足够长的 `COMMENT_HASH_SECRET`。
- 确认 `wrangler.jsonc` 中 D1 `database_id` 正确。
- 确认 `SESSION` KV namespace id 正确。
- 确认 `UPLOADS` R2 bucket 名称正确。
- 远端执行所有 D1 migrations。
- 在 `/admin/settings` 中配置正确的网站 canonical 地址。
- 验证 RSS、sitemap、首页、文章页、标签页。
- 验证后台上传文件后 `/uploads/...` 可访问。
- 大量内容变更后重新构建部署，更新 Pagefind 索引。
