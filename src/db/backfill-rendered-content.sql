PRAGMA foreign_keys = ON;
UPDATE posts SET body_html = '<p>Astro 2.0 has been released with some cool features, breaking changes, DX improvements, better error overlay and so on. AstroPaper takes advantage of those cool features, especially Content Collections API.</p>
<p><img src="https://user-images.githubusercontent.com/53733092/215771435-25408246-2309-4f8b-a781-1f3d93bdf0ec.png" alt="Introducing AstroPaper 2.0"></p>
<h2 id="table-of-contents">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#features--changes">Features &#x26; Changes</a>
<ul>
<li><a href="#type-safe-frontmatters-and-redefined-blog-schema">Type-safe Frontmatters and Redefined Blog Schema</a></li>
<li><a href="#new-home-for-blog-contents">New Home for Blog contents</a></li>
<li><a href="#new-fetch-api">New Fetch API</a></li>
<li><a href="#modified-search-logic-for-better-search-result">Modified Search Logic for better Search Result</a></li>
<li><a href="#renamed-frontmatter-properties">Renamed Frontmatter Properties</a></li>
<li><a href="#default-tag-for-blog-post">Default Tag for blog post</a></li>
<li><a href="#new-predefined-dark-color-scheme">New Predefined Dark Color Scheme</a></li>
<li><a href="#automatic-class-sorting">Automatic Class Sorting</a></li>
<li><a href="#updated-docs--readme">Updated Docs &#x26; README</a></li>
</ul>
</li>
<li><a href="#bug-fixes">Bug Fixes</a></li>
</ul>
<p></p>
<h2 id="features-changes">Features &#x26; Changes</h2>
<h3 id="type-safe-frontmatters-and-redefined-blog-schema">Type-safe Frontmatters and Redefined Blog Schema</h3>
<p>Frontmatter of AstroPaper 2.0 markdown contents are now type-safe thanks to Astro’s Content Collections. Blog schema is defined inside the <code>src/content/_schemas.ts</code> file.</p>
<h3 id="new-home-for-blog-contents">New Home for Blog contents</h3>
<p>All the blog posts were moved from <code>src/contents</code> to <code>src/content/blog</code> directory.</p>
<h3 id="new-fetch-api">New Fetch API</h3>
<p>Contents are now fetched with <code>getCollection</code> function. No relative path to the content needs to be specified anymore.</p>
<pre><code class="language-ts">// old content fetching method
- const postImportResult = import.meta.glob&#x3C;MarkdownInstance&#x3C;Frontmatter>>(
  "../contents/**/**/*.md",);

// new content fetching method
+ const postImportResult = await getCollection("blog");
</code></pre>
<h3 id="modified-search-logic-for-better-search-result">Modified Search Logic for better Search Result</h3>
<p>In the older version of AstroPaper, when someone search some article, the search criteria keys that will be searched are <code>title</code>, <code>description</code> and <code>headings</code> (heading means all the headings h1 ~ h6 of the blog post). In AstroPaper v2, only <code>title</code> and <code>description</code> will be searched as the user types.</p>
<h3 id="renamed-frontmatter-properties">Renamed Frontmatter Properties</h3>
<p>The following frontmatter properties are renamed.</p>
<p>| Old Names | New Names   |
| --------- | ----------- |
| datetime  | pubDatetime |
| slug      | postSlug    |</p>
<h3 id="default-tag-for-blog-post">Default Tag for blog post</h3>
<p>If a blog post doesn''t have any tag (in other words, frontmatter property <code>tags</code> is not specified), the default tag <code>others</code> will be used for that blog post. But you can set the default tag in the <code>/src/content/_schemas.ts</code> file.</p>
<pre><code class="language-ts">// src/contents/_schemas.ts
export const blogSchema = z.object({
  // ---
  // replace "others" with whatever you want
  tags: z.array(z.string()).default(["others"]),
  ogImage: z.string().optional(),
  description: z.string(),
});
</code></pre>
<h3 id="new-predefined-dark-color-scheme">New Predefined Dark Color Scheme</h3>
<p>AstroPaper v2 has a new dark color scheme (high contrast &#x26; low contrast) which is based on Astro''s dark logo. Check out <a href="https://astro-paper.pages.dev/posts/predefined-color-schemes#astro-dark">this link</a> for more info.</p>
<p><img src="https://user-images.githubusercontent.com/53733092/215680520-59427bb0-f4cb-48c0-bccc-f182a428d72d.svg" alt="New Predefined Dark Color Scheme"></p>
<h3 id="automatic-class-sorting">Automatic Class Sorting</h3>
<p>AstroPaper 2.0 includes automatic class sorting with <a href="https://tailwindcss.com/blog/automatic-class-sorting-with-prettier">TailwindCSS Prettier plugin</a></p>
<h3 id="updated-docs-readme">Updated Docs &#x26; README</h3>
<p>All the <a href="https://astro-paper.pages.dev/tags/docs/">#docs</a> blog posts and <a href="https://github.com/satnaing/astro-paper#readme">README</a> are updated for this AstroPaper v2.</p>
<h2 id="bug-fixes">Bug Fixes</h2>
<ul>
<li>fix broken tags in the Blog Post page</li>
<li>in a tag page, the last part of the breadcrumb is now updated to lower-case for consistency</li>
<li>exclude draft posts in a tag page</li>
<li>fix ''onChange value not updating issue'' after a page reload</li>
</ul>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"features-changes","text":"Features & Changes"},{"depth":3,"slug":"type-safe-frontmatters-and-redefined-blog-schema","text":"Type-safe Frontmatters and Redefined Blog Schema"},{"depth":3,"slug":"new-home-for-blog-contents","text":"New Home for Blog contents"},{"depth":3,"slug":"new-fetch-api","text":"New Fetch API"},{"depth":3,"slug":"modified-search-logic-for-better-search-result","text":"Modified Search Logic for better Search Result"},{"depth":3,"slug":"renamed-frontmatter-properties","text":"Renamed Frontmatter Properties"},{"depth":3,"slug":"default-tag-for-blog-post","text":"Default Tag for blog post"},{"depth":3,"slug":"new-predefined-dark-color-scheme","text":"New Predefined Dark Color Scheme"},{"depth":3,"slug":"automatic-class-sorting","text":"Automatic Class Sorting"},{"depth":3,"slug":"updated-docs-readme","text":"Updated Docs & README"},{"depth":2,"slug":"bug-fixes","text":"Bug Fixes"}]', search_text = 'Astro 2.0 has been released with some cool features, breaking changes, DX improvements, better error overlay and so on. AstroPaper takes advantage of those cool features, especially Content Collections API. <! Introducing AstroPaper 2.0 Introducing AstroPaper 2.0 Table of contents Features & Changes Type safe Frontmatters and Redefined Blog Schema Frontmatter of AstroPaper 2.0 markdown contents are now type safe thanks to Astro’s Content Collections. Blog schema is defined inside the src/content/ schemas.ts file. New Home for Blog contents All the blog posts were moved from src/contents to src/content/blog directory. New Fetch API Contents are now fetched with getCollection function. No relative path to the content needs to be specified anymore. Modified Search Logic for better Search Result In the older version of AstroPaper, when someone search some article, the search criteria keys that will be searched are title, description and headings (heading means all the headings h1 h6 of the blog post). In AstroPaper v2, only title and description will be searched as the user types. Renamed Frontmatter Properties The following frontmatter properties are renamed. | Old Names | New Names | | | | | datetime | pubDatetime | | slug | postSlug | Default Tag for blog post If a blog post doesn''t have any tag (in other words, frontmatter property tags is not specified), the default tag others will be used for that blog post. But you can set the default tag in the /src/content/ schemas.ts file. New Predefined Dark Color Scheme AstroPaper v2 has a new dark color scheme (high contrast & low contrast) which is based on Astro''s dark logo. Check out this link for more info. New Predefined Dark Color Scheme Automatic Class Sorting AstroPaper 2.0 includes automatic class sorting with TailwindCSS Prettier plugin Updated Docs & README All the docs blog posts and README are updated for this AstroPaper v2. Bug Fixes fix broken tags in the Blog Post page in a tag page, the last part of the breadcrumb is now updated to lower case for consistency exclude draft posts in a tag page fix ''onChange value not updating issue'' after a page reload' WHERE slug = 'astro-paper-2';
UPDATE posts SET body_html = '<p>We''re excited to announce the release of AstroPaper v3, packed with new features, enhancements, and bug fixes to elevate your web development experience. Let''s dive into the highlights of this release:</p>
<p><img src="@/assets/images/AstroPaper-v3.png" alt="AstroPaper v3"></p>
<h2 id="table-of-contents-1">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#features--changes">Features &#x26; Changes</a>
<ul>
<li><a href="#astro-v3-integration">Astro v3 Integration</a></li>
<li><a href="#update-og-image-generation-logic">Update OG Image Generation Logic</a></li>
<li><a href="#theme-meta-tag">Theme meta tag</a></li>
</ul>
</li>
<li><a href="#other-changes">Other Changes</a>
<ul>
<li><a href="#astro-prettier-plugin">Astro Prettier Plugin</a></li>
<li><a href="#minor-style-changes">Minor Style Changes</a></li>
</ul>
</li>
<li><a href="#upgrade-to-astropaper-v3">Upgrade to AstroPaper v3</a></li>
<li><a href="#option-1-fresh-restart-recommended">Option 1: Fresh Restart (recommended)</a></li>
<li><a href="#option-2-upgrade-using-git">Option 2: Upgrade using Git</a></li>
<li><a href="#outro">Outro</a></li>
</ul>
<p></p>
<h2 id="features-changes-1">Features &#x26; Changes</h2>
<h3 id="astro-v-3-integration">Astro v3 Integration</h3>
<p>AstroPaper now fully supports <a href="https://astro.build/blog/astro-3/">Astro v3</a>, offering improved performance and rendering speed.</p>
<p>Besides, we''ve added support for Astro''s <a href="https://docs.astro.build/en/guides/view-transitions/">ViewTransitions API</a>, allowing you to create captivating and dynamic transitions between views.</p>
<p>In the "Recent Section", only non-featured posts will be displayed to avoid duplications and better support for ViewTransitions API.</p>
<h3 id="update-og-image-generation-logic">Update OG Image Generation Logic</h3>
<p><img src="https://user-images.githubusercontent.com/40914272/269252964-a0dc6735-80f7-41ed-8e74-4d4d70f96891.png" alt="Example OG Image"></p>
<p>We''ve updated the logic for automatic OG image generation, making it even more reliable and efficient. Besides, it now supports special characters in post titles, ensuring accurate, flexible and eye-catching social media previews.</p>
<p><code>SITE.ogImage</code> is now optional. If it is not specified, AstroPaper will automatically generate an OG image using <code>SITE.title</code>, <code>SITE.desc</code> and <code>SITE.website</code></p>
<h3 id="theme-meta-tag">Theme meta tag</h3>
<p>The theme-color meta tag has been added to dynamically adapt to theme switches, ensuring a seamless user experience.</p>
<blockquote>
<p>Notice the difference at the top</p>
</blockquote>
<p><strong><em>AstroPaper v2 theme switch</em></strong></p>
<p><strong><em>AstroPaper v3 theme switch</em></strong></p>
<h2 id="other-changes">Other Changes</h2>
<h3 id="astro-prettier-plugin">Astro Prettier Plugin</h3>
<p>Astro Prettier Plugin is installed out-of-the-box in order to keep the project tidy and organized.</p>
<h3 id="minor-style-changes">Minor Style Changes</h3>
<p>The single-line code block wrapping issue has been solved, making your code snippets look pristine.</p>
<p>Update nav style CSS to allow adding more nav links to the navigation.</p>
<h2 id="upgrade-to-astro-paper-v-3">Upgrade to AstroPaper v3</h2>
<blockquote>
<p>This section is only for those who want to upgrade AstroPaper v3 from the older versions.</p>
</blockquote>
<p>This section will help you migrate from AstroPaper v2 to AstroPaper v3.</p>
<p>Before reading the rest of the section, you might also want to check <a href="https://astro-paper.pages.dev/posts/how-to-update-dependencies/">this article</a> for upgrading dependencies and AstroPaper.</p>
<h2 id="option-1-fresh-restart-recommended">Option 1: Fresh Restart (recommended)</h2>
<p>In this release, a lot of changes have been made_ replacing old Astro APIs with newer APIs, bug fixes, new features etc. Thus, if you are someone who didn''t make customization very much, you should follow this approach.</p>
<p><strong><em>Step 1: Keep all your updated files</em></strong></p>
<p>It''s important to keep all the files which have been already updated. These files include</p>
<ul>
<li><code>/src/config.ts</code> (didn''t touch in v3)</li>
<li><code>/src/styles/base.css</code> (minor changes in v3; mentioned below)</li>
<li><code>/src/assets/</code> (didn''t touch in v3)</li>
<li><code>/public/assets/</code> (didn''t touch in v3)</li>
<li><code>/content/blog/</code> (it''s your blog content directory 🤷🏻‍♂️)</li>
<li>Any other customizations you''ve made.</li>
</ul>
<pre><code class="language-css">/* file: /src/styles/base.css */
@layer base {
  /* Other Codes */
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-skin-card-muted;
  }

  /* Old code
  code {
    white-space: pre;
    overflow: scroll;
  } 
  */

  /* New code */
  code,
  blockquote {
    word-wrap: break-word;
  }
  pre > code {
    white-space: pre;
  }
}

@layer components {
  /* other codes */
}
</code></pre>
<p><strong><em>Step 1: Replace everything else with AstroPaper v3</em></strong></p>
<p>In this step, replace everything_ except above files/directories (plus your customized files/directories)_ with AstroPaper v3.</p>
<p><strong><em>Step 3: Schema Updates</em></strong></p>
<p>Keep in mind that <code>/src/content/_schemas.ts</code> has been replaced with <code>/src/content/config.ts</code>.</p>
<p>Besides, there is no longer <code>BlogFrontmatter</code> type exported from <code>/src/content/config.ts</code>.</p>
<p>Therefore, all the <code>BlogFrontmatter</code> type inside files need to be updated with <code>CollectionEntry&#x3C;"blog">["data"]</code>.</p>
<p>For example: <code>src/components/Card.tsx</code></p>
<pre><code class="language-ts">// AstroPaper v2
import type { BlogFrontmatter } from "@content/_schemas";

export interface Props {
  href?: string;
  frontmatter: BlogFrontmatter;
  secHeading?: boolean;
}
</code></pre>
<pre><code class="language-ts">// AstroPaper v3
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry&#x3C;"blog">["data"];
  secHeading?: boolean;
}
</code></pre>
<h2 id="option-2-upgrade-using-git">Option 2: Upgrade using Git</h2>
<p>This approach is not recommended for most users. You should do the "Option 1" if you can. Only do this if you know how to resolve merge conflicts and you know what you''re doing.</p>
<p>Actually, I''ve already written a blog post for this case and you can check out <a href="https://astro-paper.pages.dev/posts/how-to-update-dependencies/#updating-astropaper-using-git">here</a>.</p>
<h2 id="outro">Outro</h2>
<p>Ready to explore the exciting new features and improvements in AstroPaper v3? Start <a href="https://github.com/satnaing/astro-paper">using AstroPaper</a> now.</p>
<p>For other bug fixes and integration updates, check out the <a href="https://github.com/satnaing/astro-paper/releases/tag/v3.0.0">release notes</a> to learn more.</p>
<p>If you encounter any bugs or face difficulties during the upgrade process, please feel free to open an issue or start a discussion on <a href="https://github.com/satnaing/astro-paper">GitHub</a>.</p>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"features-changes","text":"Features & Changes"},{"depth":3,"slug":"astro-v-3-integration","text":"Astro v3 Integration"},{"depth":3,"slug":"update-og-image-generation-logic","text":"Update OG Image Generation Logic"},{"depth":3,"slug":"theme-meta-tag","text":"Theme meta tag"},{"depth":2,"slug":"other-changes","text":"Other Changes"},{"depth":3,"slug":"astro-prettier-plugin","text":"Astro Prettier Plugin"},{"depth":3,"slug":"minor-style-changes","text":"Minor Style Changes"},{"depth":2,"slug":"upgrade-to-astro-paper-v-3","text":"Upgrade to AstroPaper v3"},{"depth":2,"slug":"option-1-fresh-restart-recommended","text":"Option 1: Fresh Restart (recommended)"},{"depth":2,"slug":"option-2-upgrade-using-git","text":"Option 2: Upgrade using Git"},{"depth":2,"slug":"outro","text":"Outro"}]', search_text = 'We''re excited to announce the release of AstroPaper v3, packed with new features, enhancements, and bug fixes to elevate your web development experience. Let''s dive into the highlights of this release: AstroPaper v3 Table of contents Features & Changes Astro v3 Integration <video autoplay loop="loop" muted="muted" plays inline="true" <source src="https://github.com/satnaing/astro paper/assets/53733092/18fdb604 1ca3 41a0 8372 1367759091ff" type="video/mp4" <! <source src="/assets/docs/astro paper v3 view transitions demo.mp4" type="video/mp4" </video AstroPaper now fully supports Astro v3, offering improved performance and rendering speed. Besides, we''ve added support for Astro''s ViewTransitions API, allowing you to create captivating and dynamic transitions between views. In the "Recent Section", only non featured posts will be displayed to avoid duplications and better support for ViewTransitions API. Update OG Image Generation Logic Example OG Image We''ve updated the logic for automatic OG image generation, making it even more reliable and efficient. Besides, it now supports special characters in post titles, ensuring accurate, flexible and eye catching social media previews. SITE.ogImage is now optional. If it is not specified, AstroPaper will automatically generate an OG image using SITE.title, SITE.desc and SITE.website Theme meta tag The theme color meta tag has been added to dynamically adapt to theme switches, ensuring a seamless user experience. Notice the difference at the top AstroPaper v2 theme switch <video autoplay loop="loop" muted="muted" plays inline="true" <source src="https://github.com/satnaing/astro paper/assets/53733092/3ab5a1e8 1891 4264 a5bb 0ded69143c1a" type="video/mp4" </video AstroPaper v3 theme switch <video autoplay loop="loop" muted="muted" plays inline="true" <source src="https://github.com/satnaing/astro paper/assets/53733092/8ac9deb8 d1f8 4029 86bd 6aa0def380b4" type="video/mp4" </video Other Changes Astro Prettier Plugin Astro Prettier Plugin is installed out of the box in order to keep the project tidy and organized. Minor Style Changes The single line code block wrapping issue has been solved, making your code snippets look pristine. Update nav style CSS to allow adding more nav links to the navigation. Upgrade to AstroPaper v3 This section is only for those who want to upgrade AstroPaper v3 from the older versions. This section will help you migrate from AstroPaper v2 to AstroPaper v3. Before reading the rest of the section, you might also want to check this article for upgrading dependencies and AstroPaper. Option 1: Fresh Restart (recommended) In this release, a lot of changes have been made\ replacing old Astro APIs with newer APIs, bug fixes, new features etc. Thus, if you are someone who didn''t make customization very much, you should follow this approach. Step 1: Keep all your updated files It''s important to keep all the files which have been already updated. These files include /src/config.ts (didn''t touch in v3) /src/styles/base.css (minor changes in v3; mentioned below) /src/assets/ (didn''t touch in v3) /public/assets/ (didn''t touch in v3) /content/blog/ (it''s your blog content directory 🤷🏻‍♂️) Any other customizations you''ve made. Step 1: Replace everything else with AstroPaper v3 In this step, replace everything\ except above files/directories (plus your customized files/directories)\ with AstroPaper v3. Step 3: Schema Updates Keep in mind that /src/content/ schemas.ts has been replaced with /src/content/config.ts. Besides, there is no longer BlogFrontmatter type exported from /src/content/config.ts. Therefore, all the BlogFrontmatter type inside files need to be updated with CollectionEntry<"blog" ["data"]. For example: src/components/Card.tsx Option 2: Upgrade using Git This approach is not recommended for most users. You should do the "Option 1" if you can. Only do this if you know how to resolve merge conflicts and you know what you''re doing. Actually, I''ve already written a blog post for this case and you can check out here. Outro Ready to explore the exciting new features and improvements in AstroPaper v3? Start using AstroPaper now. For other bug fixes and integration updates, check out the release notes to learn more. If you encounter any bugs or face difficulties during the upgrade process, please feel free to open an issue or start a discussion on GitHub.' WHERE slug = 'astro-paper-v3';
UPDATE posts SET body_html = '<p>Hello everyone! Wishing you a happy New Year 🎉 and all the best for 2024! We''re excited to announce the release of AstroPaper v4, a significant update that introduces a range of new features, improvements, and bug fixes to elevate your blogging experience. A big thank you to all the contributors for their valuable input and efforts in making version 4 possible!</p>
<p><img src="@/assets/images/AstroPaper-v4.png" alt="AstroPaper v4"></p>
<h2 id="table-of-contents-2">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#major-changes">Major Changes</a>
<ul>
<li><a href="#upgrade-to-astro-v4-202">Upgrade to Astro v4 #202</a></li>
<li><a href="#replace-postslug-with-astro-content-slug-197">Replace <code>postSlug</code> with Astro Content <code>slug</code> #197</a></li>
</ul>
</li>
<li><a href="#new-features">New Features</a>
<ul>
<li><a href="#add-code-snippets-for-content-creation-206">Add code-snippets for content creation #206</a></li>
<li><a href="#add-modified-datetime-in-blog-posts-195">Add Modified Datetime in Blog Posts #195</a></li>
<li><a href="#implement-back-to-top-button-188">Implement Back-to-Top Button #188</a></li>
<li><a href="#add-pagination-in-tag-posts-201">Add Pagination in Tag Posts #201</a></li>
<li><a href="#dynamically-generate-robotstxt-130">Dynamically Generate robots.txt #130</a></li>
<li><a href="#add-docker-compose-file-174">Add Docker-Compose File #174</a></li>
</ul>
</li>
<li><a href="#refactoring--bug-fixes">Refactoring &#x26; Bug Fixes</a>
<ul>
<li><a href="#replace-slugified-title-with-unslugified-tag-name-198">Replace Slugified Title with Unslugified Tag Name #198</a></li>
<li><a href="#implement-100svh-for-min-height-79d569d">Implement 100svh for Min-Height (79d569d)</a></li>
<li><a href="#update-site-url-as-single-source-of-truth-143">Update Site URL as Single Source of Truth #143</a></li>
<li><a href="#solve-invisible-text-code-block-issue-in-light-mode-163">Solve Invisible Text Code Block Issue in Light Mode #163</a></li>
<li><a href="#decode-unicode-tag-characters-in-breadcrumb-175">Decode Unicode Tag Characters in Breadcrumb #175</a></li>
<li><a href="#update-locale-config-to-cover-overall-locales-cd02b04">Update LOCALE Config to Cover Overall Locales (cd02b04)</a></li>
</ul>
</li>
<li><a href="#outtro">Outtro</a></li>
</ul>
<p></p>
<h2 id="major-changes">Major Changes</h2>
<h3 id="upgrade-to-astro-v-4-202">Upgrade to Astro v4 <a href="https://github.com/satnaing/astro-paper/pull/202">#202</a></h3>
<p>AstroPaper now leverages the power and capabilities of Astro v4. However, it’s a subtle upgrade and won’t break most Astro users.</p>
<p><img src="https://astro.build/_astro/header-astro-4.YunweN9V_OmV0l.webp" alt="Astro v4"></p>
<h3 id="replace-post-slug-with-astro-content-slug-197">Replace <code>postSlug</code> with Astro Content <code>slug</code> <a href="https://github.com/satnaing/astro-paper/pull/197">#197</a></h3>
<p>The <code>postSlug</code> in the blog content schema is no longer available in AstroPaper v4. Initially Astro doesn''t have a <code>slug</code> mechanism and thus we have to figure it out on our own. Since Astro v3, it supports content collection and slug features. Now, we believe it''s time to adopt Astro''s out-of-the-box <code>slug</code> feature.</p>
<p><strong><em>file: src/content/blog/astro-paper-4.md</em></strong></p>
<pre><code class="language-bash">---
author: Sat Naing
pubDatetime: 2024-01-01T04:35:33.428Z
title: AstroPaper 4.0
slug: "astro-paper-v4" # if slug is not specified, it will be ''astro-paper-4'' (file name).
# slug: "" ❌ cannot be an empty string
---
</code></pre>
<p>The behavior of the <code>slug</code> is slightly different now. In the previous versions of AstroPaper, if the <code>postSlug</code> is not specified in a blog post (markdown file), the title of that blog post would be slugified and used as the <code>slug</code>. However, in AstroPaper v4, if the <code>slug</code> field is not specified, the markdown file name will be used as the <code>slug</code>. One thing to keep in mind is that the <code>slug</code> field can be omitted, but it cannot be an empty string (slug: "" ❌).</p>
<p>If you''re upgrading AstroPaper from v3 to v4, make sure to replace <code>postSlug</code> in your <code>src/content/blog/*.md</code> files with <code>slug</code>.</p>
<h2 id="new-features">New Features</h2>
<h3 id="add-code-snippets-for-content-creation-206">Add code-snippets for content creation <a href="https://github.com/satnaing/astro-paper/pull/206">#206</a></h3>
<p>AstroPaper now includes VSCode snippets for new blog posts, eliminating the need for manual copy/pasting of the frontmatter and content structure (table of contents, heading, excerpt, etc.).</p>
<p>Read more about VSCode Snippets <a href="https://code.visualstudio.com/docs/editor/userdefinedsnippets#:~:text=In%20Visual%20Studio%20Code%2C%20snippets,Snippet%20in%20the%20Command%20Palette">here</a>.</p>
<h3 id="add-modified-datetime-in-blog-posts-195">Add Modified Datetime in Blog Posts <a href="https://github.com/satnaing/astro-paper/pull/195">#195</a></h3>
<p>Keep readers informed about the latest updates by displaying the modified datetime in blog posts. This not only instills user trust in the freshness of the articles but also contributes to improved SEO for the blog.</p>
<p><img src="https://github.com/satnaing/astro-paper/assets/53733092/cc89585e-148e-444d-9da1-0d496e867175" alt="Last Modified Date feature in AstroPaper"></p>
<p>You can add a <code>modDatetime</code> to your blog post if you''ve made modifications. Now, the sorting behavior of the posts is slightly different. All posts are sorted by both <code>pubDatetime</code> and <code>modDatetime</code>. If a post has both a <code>pubDatetime</code> and <code>modDatetime</code>, its sorting position will be determined by the <code>modDatetime</code>. If not, only <code>pubDatetime</code> will be considered to determine the post''s sorting order.</p>
<h3 id="implement-back-to-top-button-188">Implement Back-to-Top Button <a href="https://github.com/satnaing/astro-paper/pull/188">#188</a></h3>
<p>Enhance user navigation on your blog detail post with the newly implemented back-to-top button.</p>
<p><img src="https://github.com/satnaing/astro-paper/assets/53733092/79854957-7877-4f19-936e-ad994b772074" alt="Back to top button in AstroPaper"></p>
<h3 id="add-pagination-in-tag-posts-201">Add Pagination in Tag Posts <a href="https://github.com/satnaing/astro-paper/pull/201">#201</a></h3>
<p>Improve content organization and navigation with the addition of pagination in tag posts, making it easier for users to explore related content. This ensures that if a tag has many posts, readers won''t be overwhelmed by all the tag-related posts.</p>
<h3 id="dynamically-generate-robots-txt-130">Dynamically Generate robots.txt <a href="https://github.com/satnaing/astro-paper/pull/130">#130</a></h3>
<p>AstroPaper v4 now dynamically generates the robots.txt file, giving you more control over search engine indexing and web crawling. Besides, sitemap URL will also be added inside <code>robot.txt</code> file.</p>
<h3 id="add-docker-compose-file-174">Add Docker-Compose File <a href="https://github.com/satnaing/astro-paper/pull/174">#174</a></h3>
<p>Managing your AstroPaper environment is now easier than ever with the addition of a Docker-Compose file, simplifying deployment and configuration.</p>
<h2 id="refactoring-bug-fixes">Refactoring &#x26; Bug Fixes</h2>
<h3 id="replace-slugified-title-with-unslugified-tag-name-198">Replace Slugified Title with Unslugified Tag Name <a href="https://github.com/satnaing/astro-paper/pull/198">#198</a></h3>
<p>To improve clarity, user experience and SEO, titles (<code>Tag: some-tag</code>) in tag page are no longer slugified (<code>Tag: Some Tag</code>).</p>
<p><img src="https://github.com/satnaing/astro-paper/assets/53733092/2fe90d6e-ec52-467b-9c44-95009b3ae0b7" alt="Unslugified Tag Names"></p>
<h3 id="implement-100-svh-for-min-height-79-d-569-d">Implement 100svh for Min-Height (<a href="https://github.com/satnaing/astro-paper/commit/79d569d053036f2113519f41b0d257523d035b76">79d569d</a>)</h3>
<p>We''ve updated the min-height on the body to use 100svh, offering a better UX for mobile users.</p>
<h3 id="update-site-url-as-single-source-of-truth-143">Update Site URL as Single Source of Truth <a href="https://github.com/satnaing/astro-paper/pull/143">#143</a></h3>
<p>The site URL is now a single source of truth, streamlining configuration and avoiding inconsistencies. Read more at this <a href="https://github.com/satnaing/astro-paper/pull/143">PR</a> and its related issue(s).</p>
<h3 id="solve-invisible-text-code-block-issue-in-light-mode-163">Solve Invisible Text Code Block Issue in Light Mode <a href="https://github.com/satnaing/astro-paper/pull/163">#163</a></h3>
<p>We''ve fixed the invisible text code block issue in light mode.</p>
<h3 id="decode-unicode-tag-characters-in-breadcrumb-175">Decode Unicode Tag Characters in Breadcrumb <a href="https://github.com/satnaing/astro-paper/pull/175">#175</a></h3>
<p>The last part of Tag in the breadcrumb is now decoded, making non-English Unicode characters display better.</p>
<h3 id="update-locale-config-to-cover-overall-locales-cd-02-b-04">Update LOCALE Config to Cover Overall Locales (<a href="https://github.com/satnaing/astro-paper/commit/cd02b047d2b5e3b4a2940c0ff30568cdebcec0b8">cd02b04</a>)</h3>
<p>The LOCALE configuration has been updated to cover a broader range of locales, catering to a more diverse audience.</p>
<h2 id="outtro">Outtro</h2>
<p>We believe these updates will significantly elevate your AstroPaper experience. Thank you to everyone who contributed, solved issues, and gave stars to AstroPaper. We look forward to seeing the amazing content you create with AstroPaper v4!</p>
<p>Happy Blogging!</p>
<p><a href="https://satnaing.dev">Sat Naing</a> 
Creator of AstroPaper</p>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"major-changes","text":"Major Changes"},{"depth":3,"slug":"upgrade-to-astro-v-4-202","text":"Upgrade to Astro v4 #202"},{"depth":3,"slug":"replace-post-slug-with-astro-content-slug-197","text":"Replace postSlug with Astro Content slug #197"},{"depth":2,"slug":"new-features","text":"New Features"},{"depth":3,"slug":"add-code-snippets-for-content-creation-206","text":"Add code-snippets for content creation #206"},{"depth":3,"slug":"add-modified-datetime-in-blog-posts-195","text":"Add Modified Datetime in Blog Posts #195"},{"depth":3,"slug":"implement-back-to-top-button-188","text":"Implement Back-to-Top Button #188"},{"depth":3,"slug":"add-pagination-in-tag-posts-201","text":"Add Pagination in Tag Posts #201"},{"depth":3,"slug":"dynamically-generate-robots-txt-130","text":"Dynamically Generate robots.txt #130"},{"depth":3,"slug":"add-docker-compose-file-174","text":"Add Docker-Compose File #174"},{"depth":2,"slug":"refactoring-bug-fixes","text":"Refactoring & Bug Fixes"},{"depth":3,"slug":"replace-slugified-title-with-unslugified-tag-name-198","text":"Replace Slugified Title with Unslugified Tag Name #198"},{"depth":3,"slug":"implement-100-svh-for-min-height-79-d-569-d","text":"Implement 100svh for Min-Height (79d569d)"},{"depth":3,"slug":"update-site-url-as-single-source-of-truth-143","text":"Update Site URL as Single Source of Truth #143"},{"depth":3,"slug":"solve-invisible-text-code-block-issue-in-light-mode-163","text":"Solve Invisible Text Code Block Issue in Light Mode #163"},{"depth":3,"slug":"decode-unicode-tag-characters-in-breadcrumb-175","text":"Decode Unicode Tag Characters in Breadcrumb #175"},{"depth":3,"slug":"update-locale-config-to-cover-overall-locales-cd-02-b-04","text":"Update LOCALE Config to Cover Overall Locales (cd02b04)"},{"depth":2,"slug":"outtro","text":"Outtro"}]', search_text = 'Hello everyone! Wishing you a happy New Year 🎉 and all the best for 2024! We''re excited to announce the release of AstroPaper v4, a significant update that introduces a range of new features, improvements, and bug fixes to elevate your blogging experience. A big thank you to all the contributors for their valuable input and efforts in making version 4 possible! AstroPaper v4 Table of contents Major Changes Upgrade to Astro v4 202 AstroPaper now leverages the power and capabilities of Astro v4. However, it’s a subtle upgrade and won’t break most Astro users. Astro v4 Replace postSlug with Astro Content slug 197 The postSlug in the blog content schema is no longer available in AstroPaper v4. Initially Astro doesn''t have a slug mechanism and thus we have to figure it out on our own. Since Astro v3, it supports content collection and slug features. Now, we believe it''s time to adopt Astro''s out of the box slug feature. file: src/content/blog/astro paper 4.md The behavior of the slug is slightly different now. In the previous versions of AstroPaper, if the postSlug is not specified in a blog post (markdown file), the title of that blog post would be slugified and used as the slug. However, in AstroPaper v4, if the slug field is not specified, the markdown file name will be used as the slug. One thing to keep in mind is that the slug field can be omitted, but it cannot be an empty string (slug: "" ❌). If you''re upgrading AstroPaper from v3 to v4, make sure to replace postSlug in your src/content/blog/ .md files with slug. New Features Add code snippets for content creation 206 AstroPaper now includes VSCode snippets for new blog posts, eliminating the need for manual copy/pasting of the frontmatter and content structure (table of contents, heading, excerpt, etc.). Read more about VSCode Snippets here. <video autoplay muted="muted" controls plays inline="true" class="border border skin line" <source src="https://github.com/satnaing/astro paper/assets/53733092/136f1903 bade 40a2 b6bb 285a3c726350" type="video/mp4" </video Add Modified Datetime in Blog Posts 195 Keep readers informed about the latest updates by displaying the modified datetime in blog posts. This not only instills user trust in the freshness of the articles but also contributes to improved SEO for the blog. Last Modified Date feature in AstroPaper You can add a modDatetime to your blog post if you''ve made modifications. Now, the sorting behavior of the posts is slightly different. All posts are sorted by both pubDatetime and modDatetime. If a post has both a pubDatetime and modDatetime, its sorting position will be determined by the modDatetime. If not, only pubDatetime will be considered to determine the post''s sorting order. Implement Back to Top Button 188 Enhance user navigation on your blog detail post with the newly implemented back to top button. Back to top button in AstroPaper Add Pagination in Tag Posts 201 Improve content organization and navigation with the addition of pagination in tag posts, making it easier for users to explore related content. This ensures that if a tag has many posts, readers won''t be overwhelmed by all the tag related posts. <video autoplay loop="loop" muted="muted" plays inline="true" class="border border skin line" <source src="https://github.com/satnaing/astro paper/assets/53733092/9bad87f5 dcf5 4b79 b67a d6c7244cd616" type="video/mp4" </video Dynamically Generate robots.txt 130 AstroPaper v4 now dynamically generates the robots.txt file, giving you more control over search engine indexing and web crawling. Besides, sitemap URL will also be added inside robot.txt file. Add Docker Compose File 174 Managing your AstroPaper environment is now easier than ever with the addition of a Docker Compose file, simplifying deployment and configuration. Refactoring & Bug Fixes Replace Slugified Title with Unslugified Tag Name 198 To improve clarity, user experience and SEO, titles (Tag: some tag) in tag page are no longer slugified (Tag: Some Tag). Unslugified Tag Names Implement 100svh for Min Height (79d569d) We''ve updated the min height on the body to use 100svh, offering a better UX for mobile users. Update Site URL as Single Source of Truth 143 The site URL is now a single source of truth, streamlining configuration and avoiding inconsistencies. Read more at this PR and its related issue(s). Solve Invisible Text Code Block Issue in Light Mode 163 We''ve fixed the invisible text code block issue in light mode. Decode Unicode Tag Characters in Breadcrumb 175 The last part of Tag in the breadcrumb is now decoded, making non English Unicode characters display better. Update LOCALE Config to Cover Overall Locales (cd02b04) The LOCALE configuration has been updated to cover a broader range of locales, catering to a more diverse audience. Outtro We believe these updates will significantly elevate your AstroPaper experience. Thank you to everyone who contributed, solved issues, and gave stars to AstroPaper. We look forward to seeing the amazing content you create with AstroPaper v4! Happy Blogging! Sat Naing <br/ Creator of AstroPaper' WHERE slug = 'astro-paper-v4';
UPDATE posts SET body_html = '<p>At last, the long-awaited AstroPaper v5 is finally here. AstroPaper v5 keeps the same minimal &#x26; clean look, but comes with significant updates under the hood.</p>
<p><img src="@/assets/images/AstroPaper-v5.png" alt="AstroPaper v5"></p>
<h2 id="table-of-contents-3">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#major-changes">Major Changes</a>
<ul>
<li><a href="#upgrade-to-astro-v5-455">Upgrade to Astro v5 #455</a></li>
<li><a href="#tailwind-v4">Tailwind v4</a></li>
<li><a href="#remove-react--fusejs-in-favor-of-pagefind-search">Remove React + Fuse.js in favor of Pagefind search</a></li>
<li><a href="#updated-import-alias">Updated import alias</a></li>
<li><a href="#move-to-pnpm">Move to <code>pnpm</code></a></li>
<li><a href="#replace-iconssvg-with-astros-svg-component">Replace icons/svg with Astro''s Svg Component</a></li>
<li><a href="#separate-constants-and-config">Separate Constants and Config</a></li>
</ul>
</li>
<li><a href="#other-notable-changes">Other notable changes</a></li>
<li><a href="#outtro">Outtro</a></li>
</ul>
<p></p>
<h2 id="major-changes-1">Major Changes</h2>
<h3 id="upgrade-to-astro-v-5-455">Upgrade to Astro v5 <a href="https://github.com/satnaing/astro-paper/pull/455">#455</a></h3>
<p>AstroPaper now comes with Astro v5, bringing all the new features and improvements that come with it.</p>
<h3 id="tailwind-v-4">Tailwind v4</h3>
<p>AstroPaper has been upgraded to Tailwind v4, which includes many style changes under the hood. The <code>tailwind.config.js</code> file has been removed, and now all the configuration is located within the <code>src/styles/global.css</code> file. Typography-related styles have been extracted and moved to <code>src/styles/typography.css</code>.</p>
<p>Due to the new behavior in TailwindCSS v4, styles inside <code>&#x3C;style></code> blocks within components have been removed and replaced with inline Tailwind classes.</p>
<p>Additionally, the color palette across the UI has been updated. The new palette now consists of only five colors:</p>
<pre><code class="language-css">:root,
html[data-theme="light"] {
  --background: #fdfdfd;
  --foreground: #282728;
  --accent: #006cac;
  --muted: #e6e6e6;
  --border: #ece9e9;
}

html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60bf;
  --border: #ab4b08;
}
</code></pre>
<h3 id="remove-react-fuse-js-in-favor-of-pagefind-search">Remove React + Fuse.js in favor of Pagefind search</h3>
<p>In previous versions, React.js and Fuse.js were used for search functionality and OG image generation. In AstroPaper v5, React.js has been removed and replaced with <a href="https://pagefind.app/">Pagefind</a>, a static site search tool.</p>
<p>The search experience is almost identical to previous versions, but now all contents, not just titles and descriptions, are indexed and searchable, thanks to Pagefind.</p>
<p>The idea of using Pagefind in dev mode was inspired by <a href="https://chrispennington.blog/blog/pagefind-static-search-for-astro-sites/">this blog post</a>.</p>
<h3 id="updated-import-alias">Updated import alias</h3>
<p>The import alias has been updated from <code>@directory</code> to <code>@/directory</code>, which means you now have to import like this:</p>
<pre><code class="language-astro">---
import { slugifyStr } from "@/utils/slugify";
import IconHash from "@/assets/icons/IconHash.svg";
---
</code></pre>
<h3 id="move-to-pnpm">Move to <code>pnpm</code></h3>
<p>AstroPaper has switched from <code>npm</code> to <code>pnpm</code>, which offers faster and more efficient package management.</p>
<h3 id="replace-icons-svg-with-astros-svg-component">Replace icons/svg with Astro''s Svg Component</h3>
<p>AstroPaper v5 replaces inline SVGs with Astro’s experimental <a href="https://docs.astro.build/en/reference/experimental-flags/svg/">SVG Component</a>. This update reduces the need for predefined SVG code in the <code>socialIcons</code> object, making the codebase cleaner and more maintainable.</p>
<h3 id="separate-constants-and-config">Separate Constants and Config</h3>
<p>The project structure has been reorganized. The <code>src/config.ts</code> file now only contains the <code>SITE</code> object, which holds the main configuration for the project. All constants, such as <code>LOCALE</code>, <code>SOCIALS</code>, and <code>SHARE_LINKS</code>, have been moved to the <code>src/constants.ts</code> file.</p>
<h2 id="other-notable-changes">Other notable changes</h2>
<ul>
<li>The blog posts directory has been updated from <code>src/content/blog/</code> to <code>src/data/blog/</code>.</li>
<li>Collection definitions file (<code>src/content/config.ts</code>) is now replaced with <code>src/content.config.ts</code>.</li>
<li>Various dependencies have been upgraded for improved performance and security.</li>
<li>Removed <code>IBM Plex Mono</code> font and switched to the default system mono font.</li>
<li>The <code>Go back</code> button logic has been updated. Now, instead of triggering the browser''s history API, AstroPaper v5 uses the browser session to temporarily store the back URL. If no back URL exists in the session, it will redirect to the homepage.</li>
<li>There are some minor styles and layout changes as well.</li>
</ul>
<h2 id="outtro-1">Outtro</h2>
<p>AstroPaper v5 brings many changes, but the core experience remains the same. Enjoy a smoother, more efficient blogging platform while keeping the clean and minimal design that AstroPaper is known for!</p>
<p>Feel free to explore the changes and share your thoughts. As always, thank you for your support!</p>
<p>If you enjoy this theme, please consider starring the repo. You can also support me via GitHub Sponsors or you can buy me a coffee if you''d like. However, of course, these actions are entirely optional and not required.</p>
<p>Enjoy!</p>
<p><a href="https://satnaing.dev/">Sat Naing</a></p>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"major-changes","text":"Major Changes"},{"depth":3,"slug":"upgrade-to-astro-v-5-455","text":"Upgrade to Astro v5 #455"},{"depth":3,"slug":"tailwind-v-4","text":"Tailwind v4"},{"depth":3,"slug":"remove-react-fuse-js-in-favor-of-pagefind-search","text":"Remove React + Fuse.js in favor of Pagefind search"},{"depth":3,"slug":"updated-import-alias","text":"Updated import alias"},{"depth":3,"slug":"move-to-pnpm","text":"Move to pnpm"},{"depth":3,"slug":"replace-icons-svg-with-astros-svg-component","text":"Replace icons/svg with Astro''s Svg Component"},{"depth":3,"slug":"separate-constants-and-config","text":"Separate Constants and Config"},{"depth":2,"slug":"other-notable-changes","text":"Other notable changes"},{"depth":2,"slug":"outtro","text":"Outtro"}]', search_text = 'At last, the long awaited AstroPaper v5 is finally here. AstroPaper v5 keeps the same minimal & clean look, but comes with significant updates under the hood. AstroPaper v5 Table of contents Major Changes Upgrade to Astro v5 455 AstroPaper now comes with Astro v5, bringing all the new features and improvements that come with it. Tailwind v4 AstroPaper has been upgraded to Tailwind v4, which includes many style changes under the hood. The tailwind.config.js file has been removed, and now all the configuration is located within the src/styles/global.css file. Typography related styles have been extracted and moved to src/styles/typography.css. Due to the new behavior in TailwindCSS v4, styles inside <style blocks within components have been removed and replaced with inline Tailwind classes. Additionally, the color palette across the UI has been updated. The new palette now consists of only five colors: Remove React + Fuse.js in favor of Pagefind search In previous versions, React.js and Fuse.js were used for search functionality and OG image generation. In AstroPaper v5, React.js has been removed and replaced with Pagefind, a static site search tool. The search experience is almost identical to previous versions, but now all contents, not just titles and descriptions, are indexed and searchable, thanks to Pagefind. The idea of using Pagefind in dev mode was inspired by this blog post. Updated import alias The import alias has been updated from @directory to @/directory, which means you now have to import like this: Move to pnpm AstroPaper has switched from npm to pnpm, which offers faster and more efficient package management. Replace icons/svg with Astro''s Svg Component AstroPaper v5 replaces inline SVGs with Astro’s experimental SVG Component. This update reduces the need for predefined SVG code in the socialIcons object, making the codebase cleaner and more maintainable. Separate Constants and Config The project structure has been reorganized. The src/config.ts file now only contains the SITE object, which holds the main configuration for the project. All constants, such as LOCALE, SOCIALS, and SHARE LINKS, have been moved to the src/constants.ts file. Other notable changes The blog posts directory has been updated from src/content/blog/ to src/data/blog/. Collection definitions file (src/content/config.ts) is now replaced with src/content.config.ts. Various dependencies have been upgraded for improved performance and security. Removed IBM Plex Mono font and switched to the default system mono font. The Go back button logic has been updated. Now, instead of triggering the browser''s history API, AstroPaper v5 uses the browser session to temporarily store the back URL. If no back URL exists in the session, it will redirect to the homepage. There are some minor styles and layout changes as well. Outtro AstroPaper v5 brings many changes, but the core experience remains the same. Enjoy a smoother, more efficient blogging platform while keeping the clean and minimal design that AstroPaper is known for! Feel free to explore the changes and share your thoughts. As always, thank you for your support! If you enjoy this theme, please consider starring the repo. You can also support me via GitHub Sponsors or you can buy me a coffee if you''d like. However, of course, these actions are entirely optional and not required. Enjoy! Sat Naing' WHERE slug = 'astro-paper-v5';
UPDATE posts SET body_html = '<p>Here are some rules/recommendations, tips &#x26; ticks for creating new posts in AstroPaper blog theme.</p>
<h2 id="table-of-contents-4">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#creating-a-blog-post">Creating a Blog Post</a></li>
<li><a href="#frontmatter">Frontmatter</a>
<ul>
<li><a href="#sample-frontmatter">Sample Frontmatter</a></li>
</ul>
</li>
<li><a href="#adding-table-of-contents">Adding table of contents</a></li>
<li><a href="#headings">Headings</a></li>
<li><a href="#syntax-highlighting">Syntax Highlighting</a></li>
<li><a href="#storing-images-for-blog-content">Storing Images for Blog Content</a>
<ul>
<li><a href="#inside-srcassets-directory-recommended">Inside <code>src/assets/</code> directory (recommended)</a></li>
<li><a href="#inside-public-directory">Inside <code>public</code> directory</a></li>
</ul>
</li>
<li><a href="#bonus">Bonus</a>
<ul>
<li><a href="#image-compression">Image compression</a></li>
<li><a href="#og-image">OG Image</a></li>
</ul>
</li>
</ul>
<p></p>
<h2 id="creating-a-blog-post">Creating a Blog Post</h2>
<p>To write a new blog post, create a markdown file inside the <code>src/data/blog/</code> directory.</p>
<blockquote>
<p>Prior to AstroPaper v5.1.0, all blog posts had to be in <code>src/data/blog/</code>, meaning you couldn''t organize them into subdirectories.</p>
</blockquote>
<p>Starting from AstroPaper v5.1.0, you can now organize blog posts into subdirectories, making it easier to manage your content.</p>
<p>For example, if you want to group posts under <code>2025</code>, you can place them in <code>src/data/blog/2025/</code>. This also affects the post URL, so <code>src/data/blog/2025/example-post.md</code> will be available at <code>/posts/2025/example-post</code>.</p>
<p>If you don’t want subdirectories to affect the post URL, just prefix the folder name with an underscore <code>_</code>.</p>
<pre><code class="language-bash"># Example: blog post structure and URLs
src/data/blog/very-first-post.md          -> mysite.com/posts/very-first-post
src/data/blog/2025/example-post.md        -> mysite.com/posts/2025/example-post
src/data/blog/_2026/another-post.md       -> mysite.com/posts/another-post
src/data/blog/docs/_legacy/how-to.md      -> mysite.com/posts/docs/how-to
src/data/blog/Example Dir/Dummy Post.md   -> mysite.com/posts/example-dir/dummy-post
</code></pre>
<blockquote>
<p>💡 Tip: You can override a blog post’s slug in the frontmatter as well. See the next section for more details.</p>
</blockquote>
<p>If the subdirectory URL doesn’t appear in the build output, remove node_modules, reinstall packages, and then rebuild.</p>
<h2 id="frontmatter">Frontmatter</h2>
<p>Frontmatter is the main place to store some important information about the blog post (article). Frontmatter lies at the top of the article and is written in YAML format. Read more about frontmatter and its usage in <a href="https://docs.astro.build/en/guides/markdown-content/">astro documentation</a>.</p>
<p>Here is the list of frontmatter property for each post.</p>
<p>| Property           | Description                                                                                                                           | Remark                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| <strong><em>title</em></strong>        | Title of the post. (h1)                                                                                                               | required*                          |
| <strong><em>description</em></strong>  | Description of the post. Used in post excerpt and site description of the post.                                                       | required*                          |
| <strong><em>pubDatetime</em></strong>  | Published datetime in ISO 8601 format.                                                                                                | required*                          |
| <strong><em>modDatetime</em></strong>  | Modified datetime in ISO 8601 format. (only add this property when a blog post is modified)                                           | optional                                       |
| <strong><em>author</em></strong>       | Author of the post.                                                                                                                   | default = SITE.author                          |
| <strong><em>slug</em></strong>         | Slug for the post. This field is optional.                                                                                            | default = slugified file name                  |
| <strong><em>featured</em></strong>     | Whether or not display this post in featured section of home page                                                                     | default = false                                |
| <strong><em>draft</em></strong>        | Mark this post ''unpublished''.                                                                                                         | default = false                                |
| <strong><em>tags</em></strong>         | Related keywords for this post. Written in array yaml format.                                                                         | default = others                               |
| <strong><em>ogImage</em></strong>      | OG image of the post. Useful for social media sharing and SEO. This can be a remote URL or an image path relative to current folder.  | default = <code>SITE.ogImage</code> or generated OG image |
| <strong><em>canonicalURL</em></strong> | Canonical URL (absolute), in case the article already exists on other source.                                                         | default = <code>Astro.site</code> + <code>Astro.url.pathname</code>  |
| <strong><em>hideEditPost</em></strong> | Hide editPost button under blog title. This applies only to the current blog post.                                                    | default = false                                |
| <strong><em>timezone</em></strong>     | Specify a timezone in IANA format for the current blog post. This will override the <code>SITE.timezone</code> config for the current blog post. | default = <code>SITE.timezone</code>                      |</p>
<blockquote>
<p>Tip! You can get ISO 8601 datetime by running <code>new Date().toISOString()</code> in the console. Make sure you remove quotes though.</p>
</blockquote>
<p>Only <code>title</code>, <code>description</code> and <code>pubDatetime</code> fields in frontmatter must be specified.</p>
<p>Title and description (excerpt) are important for search engine optimization (SEO) and thus AstroPaper encourages to include these in blog posts.</p>
<p><code>slug</code> is the unique identifier of the url. Thus, <code>slug</code> must be unique and different from other posts. The whitespace of <code>slug</code> should to be separated with <code>-</code> or <code>_</code> but <code>-</code> is recommended. Slug is automatically generated using the blog post file name. However, you can define your <code>slug</code> as a frontmatter in your blog post.</p>
<p>For example, if the blog file name is <code>adding-new-post.md</code> and you don''t specify the slug in your frontmatter, Astro will automatically create a slug for the blog post using the file name. Thus, the slug will be <code>adding-new-post</code>. But if you specify the <code>slug</code> in the frontmatter, this will override the default slug. You can read more about this in <a href="https://docs.astro.build/en/guides/content-collections/#defining-custom-slugs">Astro Docs</a>.</p>
<p>If you omit <code>tags</code> in a blog post (in other words, if no tag is specified), the default tag <code>others</code> will be used as a tag for that post. You can set the default tag in the <code>content.config.ts</code> file.</p>
<pre><code class="language-ts">export const blogSchema = z.object({
  // ...
  draft: z.boolean().optional(),
  // [!code highlight:1]
  tags: z.array(z.string()).default(["others"]), // replace "others" with whatever you want
  // ...
});
</code></pre>
<h3 id="sample-frontmatter">Sample Frontmatter</h3>
<p>Here is the sample frontmatter for a post.</p>
<pre><code class="language-yaml">---
title: The title of the post
author: your name
pubDatetime: 2022-09-21T05:17:19Z
slug: the-title-of-the-post
featured: true
draft: false
tags:
  - some
  - example
  - tags
ogImage: ../../assets/images/example.png # src/assets/images/example.png
# ogImage: "https://example.org/remote-image.png" # remote URL
description: This is the example description of the example post.
canonicalURL: https://example.org/my-article-was-already-posted-here
---
</code></pre>
<h2 id="adding-table-of-contents">Adding table of contents</h2>
<p>By default, a post (article) does not include any table of contents (toc). To include toc, you have to specify it in a specific way.</p>
<p>Write <code>Table of contents</code> in h2 format (## in markdown) and place it where you want it to be appeared on the post.</p>
<p>For instance, if you want to place your table of contents just under the intro paragraph (like I usually do), you can do that in the following way.</p>
<pre><code class="language-md">---
# frontmatter
---

Here are some recommendations, tips &#x26; ticks for creating new posts in AstroPaper blog theme.

&#x3C;!-- [!code ++] -->
## Table of contents

&#x3C;!-- the rest of the post -->
</code></pre>
<h2 id="headings">Headings</h2>
<p>There''s one thing to note about headings. The AstroPaper blog posts use title (title in the frontmatter) as the main heading of the post. Therefore, the rest of the heading in the post should be using h2 ~ h6.</p>
<p>This rule is not mandatory, but highly recommended for visual, accessibility and SEO purposes.</p>
<h2 id="syntax-highlighting">Syntax Highlighting</h2>
<p>AstroPaper uses <a href="https://shiki.style/">Shiki</a> as the default syntax highlighting. Starting from AstroPaper v5.4, <a href="https://shiki.style/packages/transformers">@shikijs/transformers</a> is used to enhance better fenced code blocks. If you don''t want to use it, you can simply remove it like this</p>
<pre><code class="language-bash">pnpm remove @shikijs/transformers
</code></pre>
<pre><code class="language-js">// ...
// [!code --:5]
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";

export default defineConfig({
  // ...
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName(),
      // [!code --:3]
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  // ...
}
</code></pre>
<h2 id="storing-images-for-blog-content">Storing Images for Blog Content</h2>
<p>Here are two methods for storing images and displaying them inside a markdown file.</p>
<blockquote>
<p>Note! If it''s a requirement to style optimized images in markdown you should <a href="https://docs.astro.build/en/guides/images/#images-in-mdx-files">use MDX</a>.</p>
</blockquote>
<h3 id="inside-src-assets-directory-recommended">Inside <code>src/assets/</code> directory (recommended)</h3>
<p>You can store images inside <code>src/assets/</code> directory. These images will be automatically optimized by Astro through <a href="https://docs.astro.build/en/reference/image-service-reference/">Image Service API</a>.</p>
<p>You can use relative path or alias path (<code>@/assets/</code>) to serve these images.</p>
<p>Example: Suppose you want to display <code>example.jpg</code> whose path is <code>/src/assets/images/example.jpg</code>.</p>
<pre><code class="language-md">![something](@/assets/images/example.jpg)

&#x3C;!-- OR -->

![something](../../assets/images/example.jpg)

&#x3C;!-- Using img tag or Image component won''t work ❌ -->
&#x3C;img src="@/assets/images/example.jpg" alt="something">
&#x3C;!-- ^^ This is wrong -->
</code></pre>
<blockquote>
<p>Technically, you can store images inside any directory under <code>src</code>. In here, <code>src/assets</code> is just a recommendation.</p>
</blockquote>
<h3 id="inside-public-directory">Inside <code>public</code> directory</h3>
<p>You can store images inside the <code>public</code> directory. Keep in mind that images stored in the <code>public</code> directory remain untouched by Astro, meaning they will be unoptimized and you need to handle image optimization by yourself.</p>
<p>For these images, you should use an absolute path; and these images can be displayed using <a href="https://www.markdownguide.org/basic-syntax/#images-1">markdown annotation</a> or <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img">HTML img tag</a>.</p>
<p>Example: Assume <code>example.jpg</code> is located at <code>/public/assets/images/example.jpg</code>.</p>
<pre><code class="language-md">![something](/assets/images/example.jpg)

&#x3C;!-- OR -->

&#x3C;img src="/assets/images/example.jpg" alt="something">
</code></pre>
<h2 id="bonus">Bonus</h2>
<h3 id="image-compression">Image compression</h3>
<p>When you put images in the blog post (especially for images under <code>public</code> directory), it is recommended that the image is compressed. This will affect the overall performance of the website.</p>
<p>My recommendation for image compression sites.</p>
<ul>
<li><a href="https://tinypng.com/">TinyPng</a></li>
<li><a href="https://tinyjpg.com/">TinyJPG</a></li>
</ul>
<h3 id="og-image">OG Image</h3>
<p>The default OG image will be placed if a post does not specify the OG image. Though not required, OG image related to the post should be specify in the frontmatter. The recommended size for OG image is <strong><em>1200 X 640</em></strong> px.</p>
<blockquote>
<p>Since AstroPaper v1.4.0, OG images will be generated automatically if not specified. Check out <a href="https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/">the announcement</a>.</p>
</blockquote>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"creating-a-blog-post","text":"Creating a Blog Post"},{"depth":2,"slug":"frontmatter","text":"Frontmatter"},{"depth":3,"slug":"sample-frontmatter","text":"Sample Frontmatter"},{"depth":2,"slug":"adding-table-of-contents","text":"Adding table of contents"},{"depth":2,"slug":"table-of-contents-1","text":"Table of contents"},{"depth":2,"slug":"headings","text":"Headings"},{"depth":2,"slug":"syntax-highlighting","text":"Syntax Highlighting"},{"depth":2,"slug":"storing-images-for-blog-content","text":"Storing Images for Blog Content"},{"depth":3,"slug":"inside-src-assets-directory-recommended","text":"Inside src/assets/ directory (recommended)"},{"depth":3,"slug":"inside-public-directory","text":"Inside public directory"},{"depth":2,"slug":"bonus","text":"Bonus"},{"depth":3,"slug":"image-compression","text":"Image compression"},{"depth":3,"slug":"og-image","text":"OG Image"}]', search_text = 'Here are some rules/recommendations, tips & ticks for creating new posts in AstroPaper blog theme. <figure <img src="https://images.pexels.com/photos/159618/still life school retro ink 159618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Free Classic wooden desk with writing materials, vintage clock, and a leather bag. Stock Photo" / <figcaption class="text center" Photo by <a href="https://www.pexels.com/photo/brown wooden desk 159618/" Pixabay</a </figcaption </figure Table of contents Creating a Blog Post To write a new blog post, create a markdown file inside the src/data/blog/ directory. Prior to AstroPaper v5.1.0, all blog posts had to be in src/data/blog/, meaning you couldn''t organize them into subdirectories. Starting from AstroPaper v5.1.0, you can now organize blog posts into subdirectories, making it easier to manage your content. For example, if you want to group posts under 2025, you can place them in src/data/blog/2025/. This also affects the post URL, so src/data/blog/2025/example post.md will be available at /posts/2025/example post. If you don’t want subdirectories to affect the post URL, just prefix the folder name with an underscore . 💡 Tip: You can override a blog post’s slug in the frontmatter as well. See the next section for more details. If the subdirectory URL doesn’t appear in the build output, remove node modules, reinstall packages, and then rebuild. Frontmatter Frontmatter is the main place to store some important information about the blog post (article). Frontmatter lies at the top of the article and is written in YAML format. Read more about frontmatter and its usage in astro documentation. Here is the list of frontmatter property for each post. | Property | Description | Remark | | | | | | title | Title of the post. (h1) | required<sup \ </sup | | description | Description of the post. Used in post excerpt and site description of the post. | required<sup \ </sup | | pubDatetime | Published datetime in ISO 8601 format. | required<sup \ </sup | | modDatetime | Modified datetime in ISO 8601 format. (only add this property when a blog post is modified) | optional | | author | Author of the post. | default = SITE.author | | slug | Slug for the post. This field is optional. | default = slugified file name | | featured | Whether or not display this post in featured section of home page | default = false | | draft | Mark this post ''unpublished''. | default = false | | tags | Related keywords for this post. Written in array yaml format. | default = others | | ogImage | OG image of the post. Useful for social media sharing and SEO. This can be a remote URL or an image path relative to current folder. | default = SITE.ogImage or generated OG image | | canonicalURL | Canonical URL (absolute), in case the article already exists on other source. | default = Astro.site + Astro.url.pathname | | hideEditPost | Hide editPost button under blog title. This applies only to the current blog post. | default = false | | timezone | Specify a timezone in IANA format for the current blog post. This will override the SITE.timezone config for the current blog post. | default = SITE.timezone | Tip! You can get ISO 8601 datetime by running new Date().toISOString() in the console. Make sure you remove quotes though. Only title, description and pubDatetime fields in frontmatter must be specified. Title and description (excerpt) are important for search engine optimization (SEO) and thus AstroPaper encourages to include these in blog posts. slug is the unique identifier of the url. Thus, slug must be unique and different from other posts. The whitespace of slug should to be separated with or but is recommended. Slug is automatically generated using the blog post file name. However, you can define your slug as a frontmatter in your blog post. For example, if the blog file name is adding new post.md and you don''t specify the slug in your frontmatter, Astro will automatically create a slug for the blog post using the file name. Thus, the slug will be adding new post. But if you specify the slug in the frontmatter, this will override the default slug. You can read more about this in Astro Docs. If you omit tags in a blog post (in other words, if no tag is specified), the default tag others will be used as a tag for that post. You can set the default tag in the content.config.ts file. Sample Frontmatter Here is the sample frontmatter for a post. Adding table of contents By default, a post (article) does not include any table of contents (toc). To include toc, you have to specify it in a specific way. Write Table of contents in h2 format ( in markdown) and place it where you want it to be appeared on the post. For instance, if you want to place your table of contents just under the intro paragraph (like I usually do), you can do that in the following way. <! prettier ignore start <! prettier ignore end Headings There''s one thing to note about headings. The AstroPaper blog posts use title (title in the frontmatter) as the main heading of the post. Therefore, the rest of the heading in the post should be using h2 \ h6. This rule is not mandatory, but highly recommended for visual, accessibility and SEO purposes. Syntax Highlighting AstroPaper uses Shiki as the default syntax highlighting. Starting from AstroPaper v5.4, @shikijs/transformers is used to enhance better fenced code blocks. If you don''t want to use it, you can simply remove it like this Storing Images for Blog Content Here are two methods for storing images and displaying them inside a markdown file. Note! If it''s a requirement to style optimized images in markdown you should use MDX. Inside src/assets/ directory (recommended) You can store images inside src/assets/ directory. These images will be automatically optimized by Astro through Image Service API. You can use relative path or alias path (@/assets/) to serve these images. Example: Suppose you want to display example.jpg whose path is /src/assets/images/example.jpg. Technically, you can store images inside any directory under src. In here, src/assets is just a recommendation. Inside public directory You can store images inside the public directory. Keep in mind that images stored in the public directory remain untouched by Astro, meaning they will be unoptimized and you need to handle image optimization by yourself. For these images, you should use an absolute path; and these images can be displayed using markdown annotation or HTML img tag. Example: Assume example.jpg is located at /public/assets/images/example.jpg. Bonus Image compression When you put images in the blog post (especially for images under public directory), it is recommended that the image is compressed. This will affect the overall performance of the website. My recommendation for image compression sites. TinyPng TinyJPG OG Image The default OG image will be placed if a post does not specify the OG image. Though not required, OG image related to the post should be specify in the frontmatter. The recommended size for OG image is 1200 X 640 px. Since AstroPaper v1.4.0, OG images will be generated automatically if not specified. Check out the announcement.' WHERE slug = 'adding-new-posts-in-astropaper-theme';
UPDATE posts SET body_html = '<p>This post will explain how you can enable/disable light &#x26; dark mode for the website. Moreover, you''ll learn how you can customize color schemes of the entire website.</p>
<h2 id="table-of-contents-5">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#enabledisable-light--dark-mode">Enable/disable light &#x26; dark mode</a></li>
<li><a href="#choose-primary-color-scheme">Choose primary color scheme</a></li>
<li><a href="#customize-color-schemes">Customize color schemes</a></li>
</ul>
<p></p>
<h2 id="enable-disable-light-dark-mode">Enable/disable light &#x26; dark mode</h2>
<p>AstroPaper theme will include light and dark mode by default. In other words, there will be two color schemes_ one for light mode and another for dark mode. This default behavior can be disabled in <code>SITE</code> configuration object.</p>
<pre><code class="language-js">export const SITE = {
  website: "https://astro-paper.pages.dev/", // replace this with your deployed domain
  author: "Sat Naing",
  profile: "https://satnaing.dev/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "AstroPaper",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true, // [!code highlight]
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
</code></pre>
<p>To disable <code>light &#x26; dark mode</code> set <code>SITE.lightAndDarkMode</code> to <code>false</code>.</p>
<h2 id="choose-primary-color-scheme">Choose primary color scheme</h2>
<p>By default, if we disable <code>SITE.lightAndDarkMode</code>, we will only get system''s prefers-color-scheme.</p>
<p>Thus, to choose primary color scheme instead of prefers-color-scheme, we have to set color scheme in the <code>primaryColorScheme</code> variable inside <code>toggle-theme.js</code>.</p>
<pre><code class="language-js">const primaryColorScheme = ""; // "light" | "dark" // [!code hl]

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");

// ...
</code></pre>
<p>The <strong>primaryColorScheme</strong> variable can hold two values_ <code>"light"</code>, <code>"dark"</code>. You can leave the empty string (default) if you don''t want to specify the primary color scheme.</p>
<ul>
<li><code>""</code> - system''s prefers-color-scheme. (default)</li>
<li><code>"light"</code> - use light mode as primary color scheme.</li>
<li><code>"dark"</code> - use dark mode as primary color scheme.</li>
</ul>
<h2 id="customize-color-schemes">Customize color schemes</h2>
<p>Both light &#x26; dark color schemes of AstroPaper theme can be customized in the <code>global.css</code> file.</p>
<pre><code class="language-css">@import "tailwindcss";
@import "./typography.css";

@custom-variant dark (&#x26;:where([data-theme=dark], [data-theme=dark] *));

:root,
html[data-theme="light"] {
  --background: #fdfdfd;
  --foreground: #282728;
  --accent: #006cac;
  --muted: #e6e6e6;
  --border: #ece9e9;
}

html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60bf;
  --border: #ab4b08;
}
/* ... */
</code></pre>
<p>In the AstroPaper theme, the <code>:root</code> and <code>html[data-theme="light"]</code> selectors define the light color scheme, while <code>html[data-theme="dark"]</code> defines the dark color scheme.</p>
<p>To customize your own color scheme, specify your light colors inside <code>:root, html[data-theme="light"]</code>, and your dark colors inside <code>html[data-theme="dark"]</code>.</p>
<p>Here is the detail explanation of color properties.</p>
<p>| Color Property | Definition &#x26; Usage                                         |
| -------------- | ---------------------------------------------------------- |
| <code>--background</code> | Primary color of the website. Usually the main background. |
| <code>--foreground</code> | Secondary color of the website. Usually the text color.    |
| <code>--accent</code>     | Accent color of the website. Link color, hover color etc.  |
| <code>--muted</code>      | Card and scrollbar background color for hover state etc.   |
| <code>--border</code>     | Border color. Especially used in horizontal row (hr)       |</p>
<p>Here is an example of changing the light color scheme.</p>
<pre><code class="language-css">/* ... */
:root,
html[data-theme="light"] {
  --background: #f6eee1;
  --foreground: #012c56;
  --accent: #e14a39;
  --muted: #efd8b0;
  --border: #dc9891;
}
/* ... */
</code></pre>
<blockquote>
<p>Check out some <a href="https://astro-paper.pages.dev/posts/predefined-color-schemes/">predefined color schemes</a> AstroPaper has already crafted for you.</p>
</blockquote>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"enable-disable-light-dark-mode","text":"Enable/disable light & dark mode"},{"depth":2,"slug":"choose-primary-color-scheme","text":"Choose primary color scheme"},{"depth":2,"slug":"customize-color-schemes","text":"Customize color schemes"}]', search_text = 'This post will explain how you can enable/disable light & dark mode for the website. Moreover, you''ll learn how you can customize color schemes of the entire website. Table of contents Enable/disable light & dark mode AstroPaper theme will include light and dark mode by default. In other words, there will be two color schemes\ one for light mode and another for dark mode. This default behavior can be disabled in SITE configuration object. To disable light & dark mode set SITE.lightAndDarkMode to false. Choose primary color scheme By default, if we disable SITE.lightAndDarkMode, we will only get system''s prefers color scheme. Thus, to choose primary color scheme instead of prefers color scheme, we have to set color scheme in the primaryColorScheme variable inside toggle theme.js. The primaryColorScheme variable can hold two values\ "light", "dark". You can leave the empty string (default) if you don''t want to specify the primary color scheme. "" system''s prefers color scheme. (default) "light" use light mode as primary color scheme. "dark" use dark mode as primary color scheme. <details <summary Why primaryColorScheme'' is not inside config.ts?</summary To avoid color flickering on page reload, we have to place the toggle switch JavaScript codes as early as possible when the page loads. It solves the problem of flickering, but as a trade off, we cannot use ESM imports anymore. </details Customize color schemes Both light & dark color schemes of AstroPaper theme can be customized in the global.css file. In the AstroPaper theme, the :root and html[data theme="light"] selectors define the light color scheme, while html[data theme="dark"] defines the dark color scheme. To customize your own color scheme, specify your light colors inside :root, html[data theme="light"], and your dark colors inside html[data theme="dark"]. Here is the detail explanation of color properties. | Color Property | Definition & Usage | | | | | background | Primary color of the website. Usually the main background. | | foreground | Secondary color of the website. Usually the text color. | | accent | Accent color of the website. Link color, hover color etc. | | muted | Card and scrollbar background color for hover state etc. | | border | Border color. Especially used in horizontal row (hr) | Here is an example of changing the light color scheme. Check out some predefined color schemes AstroPaper has already crafted for you.' WHERE slug = 'customizing-astropaper-theme-color-schemes';
UPDATE posts SET body_html = '<p>Here are some rules/recommendations, tips &#x26; ticks for creating new posts in AstroPaper blog theme.</p>
<h2 id="table-of-contents-6">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#%E4%BB%80%E4%B9%88%E6%98%AF-dokploy">什么是 Dokploy</a></li>
<li><a href="#%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%87%86%E5%A4%87%E4%B8%8E-dokploy-%E5%AE%89%E8%A3%85">服务器准备与 Dokploy 安装</a></li>
<li><a href="#%E9%85%8D%E7%BD%AE%E6%9C%8D%E5%8A%A1%E5%99%A8">配置服务器</a></li>
<li><a href="#%E9%85%8D%E7%BD%AE-dokploy">配置 Dokploy</a></li>
</ul>
<p></p>
<h2 id="什么是-dokploy">什么是 Dokploy</h2>
<p>Dokploy 是一个开源的自托管 PaaS（Platform as a Service）平台，可作为 Vercel、Netlify、Railway、Zeabur 等服务的开源替代方案。
<img src="/wp-content/uploads/2025/11/123-300%C3%97190.webp" alt="123">{.alignnone}</p>
<h2 id="服务器准备与-dokploy-安装">服务器准备与 Dokploy 安装</h2>
<p>使用 Dokploy 需要自行购买服务器。如果你不确定选择哪家服务商，可以考虑 hostinger。对于项目初期，2核8G 的 VPS 就足够使用，月费仅需 $6.49。</p>
<h2 id="配置服务器">配置服务器</h2>
<p>完成付款后，按照页面提示完成 VPS 设置。配置完成后，控制台会显示 VPS 已启动。
接下来需要配置防火墙规则。Hostinger 默认没有防火墙规则，这意味着所有端口都处于开放状态，存在安全风险。我们需要创建防火墙规则，开放 22、80、443、3000 端口的访问权限。</p>
<ol>
<li>80,443是作为网站的访问端口，当然我们可以部署多个网站以docker的形式在dokploy中部署，然后dokploy会用内置的反向代理，把你的域名分别反向代理到不同的docker容器。</li>
<li>3000端口是安装dokploy是需要对外访问的端口，当然当我们部署结束后也可以关闭这个端口。</li>
<li>22端口远程登录使用。</li>
</ol>
<p><img src="https://s.web.cafe/image/d6de15bd202143fd945b8f5d65fee5c2.webp" alt="123">{.alignnone}{.alignnone}
<strong>提醒VPS最好安装ubuntu的操作系统，对于dokploy部署会更加容易</strong></p>
<p>使用 SSH 登录 VPS，执行 Dokploy 安装命令：
curl -sSL https://dokploy.com/install.sh | sh
提示下图就是已经安装成功了
<img src="https://s.web.cafe/image/7cca013ced5643d9845506f327b1cc8c.webp" alt="123">{.alignnone}
访问VPS:3000则可以进入Dokploy的管理页面</p>
<h2 id="配置-dokploy">配置 Dokploy</h2>
<p>注册并登录后，首先为管理后台设置自定义域名：
<strong>注意这里增加的域名是Dokploy的后台管理域名，你可以取dokploy.xxx.com等等都可以，配置结束后需将对应的DNS 的A记录指向VPS的IP即可实现访问</strong>
这里有很多小伙伴遇到访问域名404的情况，如果遇到说明DNS配置正常了，多因为如下几种情况。</p>
<ol>
<li>Dokploy配置的域名要确定是http还是https，和浏览器访问要保持一致。</li>
<li>Dokploy 反向代理生效延迟，你可以去web server查看反向代理的日志，或者重启Dokploy。
<img src="https://s.web.cafe/image/74e34d37ad66438a9104d08baa65a3cd.webp" alt="123"></li>
</ol>
<p>然后在域名解析平台（以 CloudFlare 为例）添加该自定义域名的解析记录，选择 A 类型解析，IP 地址填写服务器地址。</p>
<p><img src="https://s.web.cafe/image/54ef0491d8894a20adacf798defee1ad.webp" alt="123">
解析生效后，就可以通过自定义域名访问 Dokploy 管理后台了。
最后，绑定你的 Git 账号，如下图所示：</p>
<p><img src="https://s.web.cafe/image/db68cd445e7340edac70e1b16361deab.webp" alt="123"></p>
<p>部署方案一：直接部署
Dokploy 提供了类似 Vercel 的可视化部署界面，但在性能较弱的服务器上容易因资源不足导致服务器崩溃或重启。因此，直接部署方式仅适合小型项目。
创建 Project，然后创建 Service：
<img src="https://s.web.cafe/image/dab787a7494b4b2bac1aeb991e002b15.webp" alt="123">
进入 Service 页面，设置 Provider，依次选择 Github Account、Repository、Branch，然后点击 Save：
<img src="https://s.web.cafe/image/388d58e4dfa54399998e9d84520d5bb3.webp" alt="123"></p>
<p>接着点击上方的 Deploy 按钮：
<img src="https://s.web.cafe/image/1110296c14e54c6dba53da60ef7a4fbd.webp" alt="123">
设置环境变量，每次修改后需要重新部署项目：
<img src="https://s.web.cafe/image/5e8c7279171a4333b58040df410db22c.webp" alt="123">
配置自定义域名
**这里注意两个点一个是HTTP还是HTTPS，浏览器访问的时候要保持一致。
**
<strong>这里的端口信息是填写docker内部应用的端口，不是对外映射的端口</strong>
<img src="https://s.web.cafe/image/ec0612499b4b42de8943776c6576009d.webp" alt="123">
创建完成后，需要在 Cloudflare 设置 DNS：
<img src="https://s.web.cafe/image/6eca01f152044a59acaf4b303681d774.webp" alt="123"></p>
<p>A 记录：
your-domain.com -> 你的服务器 IP
开启 Proxy</p>
<p>CNAME 记录：
www.your-domain.com -> 你的服务器 IP
开启 Proxy</p>
<p>然后打开 SSL/TLS 设置，选择 Full 或 Flexible：
<img src="https://s.web.cafe/image/c44f3ca8546b437594fb47fabf7b879e.webp" alt="123">
设置重定向，进入 Advanced – Redirects
<img src="https://s.web.cafe/image/8d57fc1069fb46659b939457968f367c.webp" alt="123"></p>
<p><img src="https://s.web.cafe/image/14d8bfa1c3ed480b9417e4959071f24b.webp" alt="123">
我习惯将 www 域名重定向到不带 www 的域名，所以选择了 Redirect to non-www
<img src="https://s.web.cafe/image/72aaa81f4a1f4193baa102c7fbf4d0af.webp" alt="123">
完成以上配置后，项目就可以在 Dokploy 上成功运行了。之后每次提交代码都会自动触发部署。</p>
<blockquote>
<p>Since AstroPaper v1.4.0, OG images will be generated automatically if not specified. Check out <a href="https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/">the announcement</a>.</p>
</blockquote>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"什么是-dokploy","text":"什么是 Dokploy"},{"depth":2,"slug":"服务器准备与-dokploy-安装","text":"服务器准备与 Dokploy 安装"},{"depth":2,"slug":"配置服务器","text":"配置服务器"},{"depth":2,"slug":"配置-dokploy","text":"配置 Dokploy"}]', search_text = 'Here are some rules/recommendations, tips & ticks for creating new posts in AstroPaper blog theme. <figure <img src="https://images.pexels.com/photos/159618/still life school retro ink 159618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Free Classic wooden desk with writing materials, vintage clock, and a leather bag. Stock Photo" / <figcaption class="text center" Photo by <a href="https://www.pexels.com/photo/brown wooden desk 159618/" Pixabay</a </figcaption </figure Table of contents 什么是 Dokploy Dokploy 是一个开源的自托管 PaaS（Platform as a Service）平台，可作为 Vercel、Netlify、Railway、Zeabur 等服务的开源替代方案。 123{.alignnone} 服务器准备与 Dokploy 安装 使用 Dokploy 需要自行购买服务器。如果你不确定选择哪家服务商，可以考虑 hostinger。对于项目初期，2核8G 的 VPS 就足够使用，月费仅需 $6.49。 配置服务器 完成付款后，按照页面提示完成 VPS 设置。配置完成后，控制台会显示 VPS 已启动。 接下来需要配置防火墙规则。Hostinger 默认没有防火墙规则，这意味着所有端口都处于开放状态，存在安全风险。我们需要创建防火墙规则，开放 22、80、443、3000 端口的访问权限。 1. 80,443是作为网站的访问端口，当然我们可以部署多个网站以docker的形式在dokploy中部署，然后dokploy会用内置的反向代理，把你的域名分别反向代理到不同的docker容器。 1. 3000端口是安装dokploy是需要对外访问的端口，当然当我们部署结束后也可以关闭这个端口。 2. 22端口远程登录使用。 123{.alignnone}{.alignnone} 提醒VPS最好安装ubuntu的操作系统，对于dokploy部署会更加容易 使用 SSH 登录 VPS，执行 Dokploy 安装命令： curl sSL https://dokploy.com/install.sh | sh 提示下图就是已经安装成功了 123{.alignnone} 访问VPS:3000则可以进入Dokploy的管理页面 配置 Dokploy 注册并登录后，首先为管理后台设置自定义域名： 注意这里增加的域名是Dokploy的后台管理域名，你可以取dokploy.xxx.com等等都可以，配置结束后需将对应的DNS 的A记录指向VPS的IP即可实现访问 这里有很多小伙伴遇到访问域名404的情况，如果遇到说明DNS配置正常了，多因为如下几种情况。 1. Dokploy配置的域名要确定是http还是https，和浏览器访问要保持一致。 2. Dokploy 反向代理生效延迟，你可以去web server查看反向代理的日志，或者重启Dokploy。 123 然后在域名解析平台（以 CloudFlare 为例）添加该自定义域名的解析记录，选择 A 类型解析，IP 地址填写服务器地址。 123 解析生效后，就可以通过自定义域名访问 Dokploy 管理后台了。 最后，绑定你的 Git 账号，如下图所示： 123 部署方案一：直接部署 Dokploy 提供了类似 Vercel 的可视化部署界面，但在性能较弱的服务器上容易因资源不足导致服务器崩溃或重启。因此，直接部署方式仅适合小型项目。 创建 Project，然后创建 Service： 123 进入 Service 页面，设置 Provider，依次选择 Github Account、Repository、Branch，然后点击 Save： 123 接着点击上方的 Deploy 按钮： 123 设置环境变量，每次修改后需要重新部署项目： 123 配置自定义域名 这里注意两个点一个是HTTP还是HTTPS，浏览器访问的时候要保持一致。 这里的端口信息是填写docker内部应用的端口，不是对外映射的端口 123 创建完成后，需要在 Cloudflare 设置 DNS： 123 A 记录： your domain.com 你的服务器 IP 开启 Proxy CNAME 记录： www.your domain.com 你的服务器 IP 开启 Proxy 然后打开 SSL/TLS 设置，选择 Full 或 Flexible： 123 设置重定向，进入 Advanced – Redirects 123 123 我习惯将 www 域名重定向到不带 www 的域名，所以选择了 Redirect to non www 123 完成以上配置后，项目就可以在 Dokploy 上成功运行了。之后每次提交代码都会自动触发部署。 Since AstroPaper v1.4.0, OG images will be generated automatically if not specified. Check out the announcement.' WHERE slug = 'Dokploy';
UPDATE posts SET body_html = '<p>New feature in AstroPaper v1.4.0, introducing dynamic OG image generation for blog posts.</p>
<h2 id="table-of-contents-7">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#intro">Intro</a></li>
<li><a href="#defaultstatic-og-image-the-old-way">Default/Static OG image (the old way)</a></li>
<li><a href="#dynamic-og-image">Dynamic OG Image</a></li>
<li><a href="#anatomy-of-astropaper-dynamic-og-image">Anatomy of AstroPaper dynamic OG image</a>
<ul>
<li><a href="#issue-non-latin-characters">Issue Non-Latin Characters</a></li>
</ul>
</li>
<li><a href="#trade-off">Trade-off</a></li>
<li><a href="#limitations">Limitations</a></li>
</ul>
<p></p>
<h2 id="intro">Intro</h2>
<p>OG images (aka Social Images) play an important role in social media engagements. In case you don''t know what OG image means, it is an image displayed whenever we share our website URL on social media such as Facebook, Discord etc.</p>
<blockquote>
<p>The Social Image used for Twitter is technically not called OG image. However, in this post, I''ll be using the term OG image for all types of Social Images.</p>
</blockquote>
<h2 id="default-static-og-image-the-old-way">Default/Static OG image (the old way)</h2>
<p>AstroPaper already provided a way to add an OG image to a blog post. The author can specify the OG image in the frontmatter <code>ogImage</code>. Even when the author doesn''t define the OG image in the frontmatter, the default OG image will be used as a fallback (in this case <code>public/astropaper-og.jpg</code>). But the problem is that the default OG image is static, which means every blog post that does not include an OG image in the frontmatter will always use the same default OG image despite each post title/content being different from others.</p>
<h2 id="dynamic-og-image">Dynamic OG Image</h2>
<p>Generating a dynamic OG image for each post allows the author to avoid specifying an OG image for every single blog post. Besides, this will prevent the fallback OG image from being identical to all blog posts.</p>
<p>In AstroPaper v1.4.0, Vercel''s <a href="https://github.com/vercel/satori">Satori</a> package is used for dynamic OG image generation.</p>
<p>Dynamic OG images will be generated at build time for blog posts that</p>
<ul>
<li>don''t include OG image in the frontmatter</li>
<li>are not marked as draft.</li>
</ul>
<h2 id="anatomy-of-astro-paper-dynamic-og-image">Anatomy of AstroPaper dynamic OG image</h2>
<p>Dynamic OG image of AstroPaper includes <em>the blog post title</em>, <em>author name</em> and <em>site title</em>. Author name and site title will be retrieved via <code>SITE.author</code> and <code>SITE.title</code> of <strong>"src/config.ts"</strong> file. The title is generated from the blog post frontmatter <code>title</code>.<br>
<img src="https://user-images.githubusercontent.com/53733092/209704501-e9c2236a-3f4d-4c67-bab3-025aebd63382.png" alt="Example Dynamic OG Image link"></p>
<h3 id="issue-non-latin-characters">Issue Non-Latin Characters</h3>
<p>Titles with non-latin characters won''t display properly out of the box. To resolve this, we have to replace <code>fontsConfig</code> inside <code>loadGoogleFont.ts</code> with your preferred font.</p>
<pre><code class="language-ts">async function loadGoogleFonts(
  text: string
): Promise&#x3C;
  Array&#x3C;{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "Noto Sans JP",
      font: "Noto+Sans+JP",
      weight: 400,
      style: "normal",
    },
    {
      name: "Noto Sans JP",
      font: "Noto+Sans+JP:wght@700",
      weight: 700,
      style: "normal",
    },
    { name: "Noto Sans", font: "Noto+Sans", weight: 400, style: "normal" },
    {
      name: "Noto Sans",
      font: "Noto+Sans:wght@700",
      weight: 700,
      style: "normal",
    },
  ];
  // ...
}
</code></pre>
<blockquote>
<p>Check out <a href="https://github.com/satnaing/astro-paper/pull/318">this PR</a> for more info.</p>
</blockquote>
<h2 id="trade-off">Trade-off</h2>
<p>While this is a nice feature to have, there''s a trade-off. Each OG image takes roughly one second to generate. This might not be noticeable at first, but as the number of blog posts grows, you might want to disable this feature. Since every OG image takes time to generate, having many of them will increase the build time linearly.</p>
<p>For example: If one OG image takes one second to generate, then 60 images will take around one minute, and 600 images will take approximately 10 minutes. This can significantly impact build times as your content scales.</p>
<p>Related issue: <a href="https://github.com/satnaing/astro-paper/issues/428">#428</a></p>
<h2 id="limitations">Limitations</h2>
<p>At the time of writing this, <a href="https://github.com/vercel/satori">Satori</a> is fairly new and has not reached major release yet. So, there are still some limitations to this dynamic OG image feature.</p>
<ul>
<li>Besides, RTL languages are not supported yet.</li>
<li><a href="https://github.com/vercel/satori#emojis">Using emoji</a> in the title might be a little bit tricky.</li>
</ul>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"intro","text":"Intro"},{"depth":2,"slug":"default-static-og-image-the-old-way","text":"Default/Static OG image (the old way)"},{"depth":2,"slug":"dynamic-og-image","text":"Dynamic OG Image"},{"depth":2,"slug":"anatomy-of-astro-paper-dynamic-og-image","text":"Anatomy of AstroPaper dynamic OG image"},{"depth":3,"slug":"issue-non-latin-characters","text":"Issue Non-Latin Characters"},{"depth":2,"slug":"trade-off","text":"Trade-off"},{"depth":2,"slug":"limitations","text":"Limitations"}]', search_text = 'New feature in AstroPaper v1.4.0, introducing dynamic OG image generation for blog posts. Table of contents Intro OG images (aka Social Images) play an important role in social media engagements. In case you don''t know what OG image means, it is an image displayed whenever we share our website URL on social media such as Facebook, Discord etc. The Social Image used for Twitter is technically not called OG image. However, in this post, I''ll be using the term OG image for all types of Social Images. Default/Static OG image (the old way) AstroPaper already provided a way to add an OG image to a blog post. The author can specify the OG image in the frontmatter ogImage. Even when the author doesn''t define the OG image in the frontmatter, the default OG image will be used as a fallback (in this case public/astropaper og.jpg). But the problem is that the default OG image is static, which means every blog post that does not include an OG image in the frontmatter will always use the same default OG image despite each post title/content being different from others. Dynamic OG Image Generating a dynamic OG image for each post allows the author to avoid specifying an OG image for every single blog post. Besides, this will prevent the fallback OG image from being identical to all blog posts. In AstroPaper v1.4.0, Vercel''s Satori package is used for dynamic OG image generation. Dynamic OG images will be generated at build time for blog posts that don''t include OG image in the frontmatter are not marked as draft. Anatomy of AstroPaper dynamic OG image Dynamic OG image of AstroPaper includes the blog post title , author name and site title . Author name and site title will be retrieved via SITE.author and SITE.title of "src/config.ts" file. The title is generated from the blog post frontmatter title. Example Dynamic OG Image link Issue Non Latin Characters Titles with non latin characters won''t display properly out of the box. To resolve this, we have to replace fontsConfig inside loadGoogleFont.ts with your preferred font. Check out this PR for more info. Trade off While this is a nice feature to have, there''s a trade off. Each OG image takes roughly one second to generate. This might not be noticeable at first, but as the number of blog posts grows, you might want to disable this feature. Since every OG image takes time to generate, having many of them will increase the build time linearly. For example: If one OG image takes one second to generate, then 60 images will take around one minute, and 600 images will take approximately 10 minutes. This can significantly impact build times as your content scales. Related issue: 428 Limitations At the time of writing this, Satori is fairly new and has not reached major release yet. So, there are still some limitations to this dynamic OG image feature. Besides, RTL languages are not supported yet. Using emoji in the title might be a little bit tricky.' WHERE slug = 'dynamic-og-image-generation-in-astropaper-blog-posts';
UPDATE posts SET body_html = '<p>Users cannot see this post because it is in draft.</p>
<h2 id="motivation">Motivation</h2>
<p>rec 1</p>', headings = '[{"depth":2,"slug":"motivation","text":"Motivation"}]', search_text = 'Users cannot see this post because it is in draft. Motivation rec 1' WHERE slug = 'example-draft-post';
UPDATE posts SET body_html = '<blockquote>
<p>This article is originally from my <a href="https://satnaing.dev/blog/posts/how-do-i-develop-my-portfolio-and-blog">blog post</a>. I put this article to demonstrate how you can write blog posts/articles using AstroPaper theme.</p>
</blockquote>
<p>My experience about developing my first portfolio website and a blog using NextJS and a headless CMS.</p>
<p><img src="https://satnaing.dev/_ipx/w_2048,q_75/https%3A%2F%2Fres.cloudinary.com%2Fnoezectz%2Fimage%2Fupload%2Fv1653050141%2FSatNaing%2Fblog_at_cafe_ei1wf4.jpg?url=https%3A%2F%2Fres.cloudinary.com%2Fnoezectz%2Fimage%2Fupload%2Fv1653050141%2FSatNaing%2Fblog_at_cafe_ei1wf4.jpg&#x26;w=2048&#x26;q=75" alt="Building portfolio"></p>
<h2 id="motivation-1">Motivation</h2>
<p>I''ve been always thinking about launching my own website with my custom domain name (<strong>satnaing.dev</strong>) since my college student life. But that never happened until this project. I''ve done several projects and works about web application development but I didn''t make an effort to do this.</p>
<p>So, "what about blog?" you may ask. Yeah, blog also has been in my project list for some time. I always wanted to make a blog project using some of the latest technologies. However, I''ve been busy with my works and other projects so that blog project has never been started.</p>
<p>In these days, I tend to develop my own projects with the focus in good quality rather than quantity. After the project is done, I usually put a proper readme file in the GitHub repo. But GitHub repo readme is only suitable for technical aspects (this is just my thought). I want to write down my experiences and challenges. Thus, I decided to make my own blog. Plus, at this point, I have decent experiences and confidence to develop this project.</p>
<h2 id="tech-stack">Tech Stack</h2>
<p>For the front-end, I wanted to use <a href="https://reactjs.org/" title="React Official Website">React</a>. But React alone is not good enough for SEO; and I did have to consider many factors like routing, image optimization etc. So, I chose <a href="https://nextjs.org/" title="NextJS Official Website">NextJS</a> as my main front-end stack. And of course TypeScript for type checking. (It''s said that you''ll love TypeScript when you''re used to it 😉)</p>
<p>For styling, I use <a href="https://tailwindcss.com/" title="Tailwind CSS Official Website">TailwindCSS</a>. This is because I love developer experience that Tailwind gives and it has a lot of flexibilities compared to other component UI libraries like MUI or React Bootstrap.</p>
<p>All contents of this project reside within the GitHub repository. All my blog posts (including this one) are written in Markdown file format since I''m very used to with this. But to write Markdown along with its frontmatter effortlessly, I use <a href="https://forestry.io/" title="Forestry Official Website">Forestry</a> headless CMS. It is a git-based CMS that can serve Markdown and other contents. Because of this, I can write my contents either using Markdown or wysiwyg editor. Besides, writing frontmatters with this is a breeze.</p>
<p>Images and assets are uploaded and stored in <a href="https://cloudinary.com/" title="Cloudinary Official Website">Cloudinary</a>. I connect Cloudinary via Forestry and manage them directly in the dashboard.</p>
<p>In conclusion, these are the tech stack I''ve used for this project.</p>
<ul>
<li>Front-end: NextJS (TypeScript)</li>
<li>Styling: TailwindCSS</li>
<li>Animations: GSAP</li>
<li>CMS: Forestry Headless CMS</li>
<li>Deployment: Vercel</li>
</ul>
<h2 id="features">Features</h2>
<p>The following are certain features of my portfolio and blog</p>
<h3 id="seo-friendly">SEO Friendly</h3>
<p>The entire project is developed with SEO focus in mind. I''ve used proper meta tags, descriptions and heading alignments. This website is now indexed by Google.</p>
<blockquote>
<p>You can search this website on google by using keywords like ''sat naing dev''</p>
</blockquote>
<p><img src="https://res.cloudinary.com/noezectz/image/upload/v1648231400/SatNaing/satnaing-on-google_asflq6.png" alt="searching satnaing.dev on google" title="satnaing.dev is indexed"></p>
<p>Moreover, this website will be displayed well when shared to social media due to properly used meta tags.</p>
<p><img src="https://res.cloudinary.com/noezectz/image/upload/v1653106955/SatNaing/satnaing-dev-share-on-facebook_1_zjoehx.png" alt="satnaing.dev card layout when shared to Facebook" title="Card layout when shared to Facebook"></p>
<h3 id="dynamic-sitemap">Dynamic Sitemap</h3>
<p>Sitemap plays an important part in SEO. Because of this, every single page of this site should be included in sitemap.xml. I made an auto generated sitemap in my website whenever I create a new content or tags or categories.</p>
<h3 id="light-dark-themes">Light &#x26; Dark Themes</h3>
<p>Due to dark theme trend in recent years, many websites include dark theme out of the box nowadays. Certainly, my website also supports light &#x26; dark themes.</p>
<h3 id="fully-accessible">Fully Accessible</h3>
<p>This website is fully accessible. You can navigate around by only using keyboard. I put all a11y enhancement best practices like including alt text in all images, no skipping headings, using semantic HTML tags, using aria-attributes properly.</p>
<h3 id="search-box-categories-tags">Search box, Categories &#x26; Tags</h3>
<p>All blog contents can be searched by search box. Moreover, contents can be filtered by categories and tags. In this way, blog readers can search and read what they really want.</p>
<h3 id="performance-and-lighthouse-score">Performance and Lighthouse Score</h3>
<p>This website got very good performance and lighthouse score thanks to proper development and best practices. Here''s the lighthouse score for this website.</p>
<p><img src="https://user-images.githubusercontent.com/53733092/159957822-7082e459-11e9-4616-8f1e-49d0881f7cbb.png" alt="satnaing.dev Lighthouse score" title="satnaing.dev Lighthouse score"></p>
<h3 id="animations">Animations</h3>
<p>Initially I used <a href="https://www.framer.com/motion/" title="Framer Motion">Framer Motion</a> to add animations and micro interactions for this website. However, when I tried to use some complex animations and parallax effects, I found it inconvenient to integrate with Framer Motion (Maybe I''m not very good at and used to working with it). Hence, I decided to use <a href="https://greensock.com/" title="GSAP Animation Library">GSAP</a> for all of my animations. It is one of the most popular animation library and it is capable of doing complex and advanced animations. You can see animations and micro interactions on pretty much every page of this website.</p>
<p><img src="https://res.cloudinary.com/noezectz/image/upload/v1653108324/SatNaing/ezgif.com-gif-maker_2_hehtlm.gif" alt="animations at satnaing.dev" title="satnaing.dev website"></p>
<h2 id="outro-1">Outro</h2>
<p>In conclusion, this project gives me a lot of experience and confidence about developing blog site (SSG). Now, I have gained knowledge of git-based CMS and how it interacts with NextJS. I''ve also learned about SEO, dynamic sitemap generation and indexing Google procedures. I will make better projects in the future. So, stay tuned! ✌🏻</p>
<p>And... last but not least, I would like to say ''thanks'' to my friend <a href="https://www.facebook.com/bon.zai.3910" title="Swann Fevian Kyaw&#x27;s Facebook Account">Swann Fevian Kyaw</a> (@<a href="https://www.facebook.com/ToonHa-102639465752883" title="ToonHa Facebook Page">ToonHa</a>) who has drawn a beautiful illustration for my hero section of the website.</p>
<h2 id="project-links">Project Links</h2>
<ul>
<li>Website: <a href="https://satnaing.dev/" title="https://satnaing.dev/">https://satnaing.dev/</a></li>
<li>Blog: <a href="https://satnaing.dev/blog" title="https://satnaing.dev/blog">https://satnaing.dev/blog</a></li>
<li>Repo: <a href="https://github.com/satnaing/my-portfolio" title="https://github.com/satnaing/my-portfolio">https://github.com/satnaing/my-portfolio</a></li>
</ul>', headings = '[{"depth":2,"slug":"motivation","text":"Motivation"},{"depth":2,"slug":"tech-stack","text":"Tech Stack"},{"depth":2,"slug":"features","text":"Features"},{"depth":3,"slug":"seo-friendly","text":"SEO Friendly"},{"depth":3,"slug":"dynamic-sitemap","text":"Dynamic Sitemap"},{"depth":3,"slug":"light-dark-themes","text":"Light & Dark Themes"},{"depth":3,"slug":"fully-accessible","text":"Fully Accessible"},{"depth":3,"slug":"search-box-categories-tags","text":"Search box, Categories & Tags"},{"depth":3,"slug":"performance-and-lighthouse-score","text":"Performance and Lighthouse Score"},{"depth":3,"slug":"animations","text":"Animations"},{"depth":2,"slug":"outro","text":"Outro"},{"depth":2,"slug":"project-links","text":"Project Links"}]', search_text = 'This article is originally from my blog post. I put this article to demonstrate how you can write blog posts/articles using AstroPaper theme. My experience about developing my first portfolio website and a blog using NextJS and a headless CMS. Building portfolio Motivation I''ve been always thinking about launching my own website with my custom domain name ( satnaing.dev ) since my college student life. But that never happened until this project. I''ve done several projects and works about web application development but I didn''t make an effort to do this. So, "what about blog?" you may ask. Yeah, blog also has been in my project list for some time. I always wanted to make a blog project using some of the latest technologies. However, I''ve been busy with my works and other projects so that blog project has never been started. In these days, I tend to develop my own projects with the focus in good quality rather than quantity. After the project is done, I usually put a proper readme file in the GitHub repo. But GitHub repo readme is only suitable for technical aspects (this is just my thought). I want to write down my experiences and challenges. Thus, I decided to make my own blog. Plus, at this point, I have decent experiences and confidence to develop this project. Tech Stack For the front end, I wanted to use React. But React alone is not good enough for SEO; and I did have to consider many factors like routing, image optimization etc. So, I chose NextJS as my main front end stack. And of course TypeScript for type checking. (It''s said that you''ll love TypeScript when you''re used to it 😉) For styling, I use TailwindCSS. This is because I love developer experience that Tailwind gives and it has a lot of flexibilities compared to other component UI libraries like MUI or React Bootstrap. All contents of this project reside within the GitHub repository. All my blog posts (including this one) are written in Markdown file format since I''m very used to with this. But to write Markdown along with its frontmatter effortlessly, I use Forestry headless CMS. It is a git based CMS that can serve Markdown and other contents. Because of this, I can write my contents either using Markdown or wysiwyg editor. Besides, writing frontmatters with this is a breeze. Images and assets are uploaded and stored in Cloudinary. I connect Cloudinary via Forestry and manage them directly in the dashboard. In conclusion, these are the tech stack I''ve used for this project. Front end: NextJS (TypeScript) Styling: TailwindCSS Animations: GSAP CMS: Forestry Headless CMS Deployment: Vercel Features The following are certain features of my portfolio and blog SEO Friendly The entire project is developed with SEO focus in mind. I''ve used proper meta tags, descriptions and heading alignments. This website is now indexed by Google. You can search this website on google by using keywords like ''sat naing dev'' searching satnaing.dev on google Moreover, this website will be displayed well when shared to social media due to properly used meta tags. satnaing.dev card layout when shared to Facebook Dynamic Sitemap Sitemap plays an important part in SEO. Because of this, every single page of this site should be included in sitemap.xml. I made an auto generated sitemap in my website whenever I create a new content or tags or categories. Light & Dark Themes Due to dark theme trend in recent years, many websites include dark theme out of the box nowadays. Certainly, my website also supports light & dark themes. Fully Accessible This website is fully accessible. You can navigate around by only using keyboard. I put all a11y enhancement best practices like including alt text in all images, no skipping headings, using semantic HTML tags, using aria attributes properly. Search box, Categories & Tags All blog contents can be searched by search box. Moreover, contents can be filtered by categories and tags. In this way, blog readers can search and read what they really want. Performance and Lighthouse Score This website got very good performance and lighthouse score thanks to proper development and best practices. Here''s the lighthouse score for this website. satnaing.dev Lighthouse score Animations Initially I used Framer Motion to add animations and micro interactions for this website. However, when I tried to use some complex animations and parallax effects, I found it inconvenient to integrate with Framer Motion (Maybe I''m not very good at and used to working with it). Hence, I decided to use GSAP for all of my animations. It is one of the most popular animation library and it is capable of doing complex and advanced animations. You can see animations and micro interactions on pretty much every page of this website. animations at satnaing.dev Outro In conclusion, this project gives me a lot of experience and confidence about developing blog site (SSG). Now, I have gained knowledge of git based CMS and how it interacts with NextJS. I''ve also learned about SEO, dynamic sitemap generation and indexing Google procedures. I will make better projects in the future. So, stay tuned! ✌🏻 And... last but not least, I would like to say ''thanks'' to my friend Swann Fevian Kyaw (@ToonHa) who has drawn a beautiful illustration for my hero section of the website. Project Links Website: https://satnaing.dev/ Blog: https://satnaing.dev/blog Repo: https://github.com/satnaing/my portfolio' WHERE slug = 'how-do-i-develop-my-portfolio-and-blog';
UPDATE posts SET body_html = '<blockquote>
<p>This article is from <a href="https://tailwindcss-typography.vercel.app/">TailwindLabs</a>. I put this article to demonstrate how you can write blog posts/articles using AstroPaper theme.</p>
</blockquote>
<p>By default, Tailwind removes all of the default browser styling from paragraphs, headings, lists and more. This ends up being really useful for building application UIs because you spend less time undoing user-agent styles, but when you <em>really are</em> just trying to style some content that came from a rich-text editor in a CMS or a markdown file, it can be surprising and unintuitive.</p>
<p>We get lots of complaints about it actually, with people regularly asking us things like:</p>
<blockquote>
<p>Why is Tailwind removing the default styles on my <code>h1</code> elements? How do I disable this? What do you mean I lose all the other base styles too?
We hear you, but we''re not convinced that simply disabling our base styles is what you really want. You don''t want to have to remove annoying margins every time you use a <code>p</code> element in a piece of your dashboard UI. And I doubt you really want your blog posts to use the user-agent styles either — you want them to look <em>awesome</em>, not awful.</p>
</blockquote>
<p>The <code>@tailwindcss/typography</code> plugin is our attempt to give you what you <em>actually</em> want, without any of the downsides of doing something stupid like disabling our base styles.</p>
<p>It adds a new <code>prose</code> class that you can slap on any block of vanilla HTML content and turn it into a beautiful, well-formatted document:</p>
<pre><code class="language-html">&#x3C;article class="prose">
  &#x3C;h1>Garlic bread with cheese: What the science tells us&#x3C;/h1>
  &#x3C;p>
    For years parents have espoused the health benefits of eating garlic bread
    with cheese to their children, with the food earning such an iconic status
    in our culture that kids will often dress up as warm, cheesy loaf for
    Halloween.
  &#x3C;/p>
  &#x3C;p>
    But a recent study shows that the celebrated appetizer may be linked to a
    series of rabies cases springing up around the country.
  &#x3C;/p>
  &#x3C;!-- ... -->
&#x3C;/article>
</code></pre>
<p>For more information about how to use the plugin and the features it includes, <a href="https://github.com/tailwindcss/typography/blob/master/README.md">read the documentation</a>.</p>
<hr>
<h2 id="what-to-expect-from-here-on-out">What to expect from here on out</h2>
<p>What follows from here is just a bunch of absolute nonsense I''ve written to dogfood the plugin itself. It includes every sensible typographic element I could think of, like <strong>bold text</strong>, unordered lists, ordered lists, code blocks, block quotes, <em>and even italics</em>.</p>
<p>It''s important to cover all of these use cases for a few reasons:</p>
<ol>
<li>We want everything to look good out of the box.</li>
<li>Really just the first reason, that''s the whole point of the plugin.</li>
<li>Here''s a third pretend reason though a list with three items looks more realistic than a list with two items.</li>
</ol>
<p>Now we''re going to try out another header style.</p>
<h3 id="typography-should-be-easy">Typography should be easy</h3>
<p>So that''s a header for you — with any luck if we''ve done our job correctly that will look pretty reasonable.</p>
<p>Something a wise person once told me about typography is:</p>
<blockquote>
<p>Typography is pretty important if you don''t want your stuff to look like trash. Make it good then it won''t be bad.
It''s probably important that images look okay here by default as well:</p>
</blockquote>
<p>Now I''m going to show you an example of an unordered list to make sure that looks good, too:</p>
<ul>
<li>So here is the first item in this list.</li>
<li>In this example we''re keeping the items short.</li>
<li>Later, we''ll use longer, more complex list items.</li>
</ul>
<p>And that''s the end of this section.</p>
<h2 id="what-if-we-stack-headings">What if we stack headings?</h2>
<h3 id="we-should-make-sure-that-looks-good-too">We should make sure that looks good, too.</h3>
<p>Sometimes you have headings directly underneath each other. In those cases you often have to undo the top margin on the second heading because it usually looks better for the headings to be closer together than a paragraph followed by a heading should be.</p>
<h3 id="when-a-heading-comes-after-a-paragraph">When a heading comes after a paragraph …</h3>
<p>When a heading comes after a paragraph, we need a bit more space, like I already mentioned above. Now let''s see what a more complex list would look like.</p>
<ul>
<li>
<p><strong>I often do this thing where list items have headings.</strong></p>
<p>For some reason I think this looks cool which is unfortunate because it''s pretty annoying to get the styles right.</p>
<p>I often have two or three paragraphs in these list items, too, so the hard part is getting the spacing between the paragraphs, list item heading, and separate list items to all make sense. Pretty tough honestly, you could make a strong argument that you just shouldn''t write this way.</p>
</li>
<li>
<p><strong>Since this is a list, I need at least two items.</strong></p>
<p>I explained what I''m doing already in the previous list item, but a list wouldn''t be a list if it only had one item, and we really want this to look realistic. That''s why I''ve added this second list item so I actually have something to look at when writing the styles.</p>
</li>
<li>
<p><strong>It''s not a bad idea to add a third item either.</strong></p>
<p>I think it probably would''ve been fine to just use two items but three is definitely not worse, and since I seem to be having no trouble making up arbitrary things to type, I might as well include it.</p>
</li>
</ul>
<p>After this sort of list I usually have a closing statement or paragraph, because it kinda looks weird jumping right to a heading.</p>
<h2 id="code-should-look-okay-by-default">Code should look okay by default.</h2>
<p>I think most people are going to use <a href="https://highlightjs.org/">highlight.js</a> or <a href="https://prismjs.com/">Prism</a> or something if they want to style their code blocks but it wouldn''t hurt to make them look <em>okay</em> out of the box, even with no syntax highlighting.</p>
<p>Here''s what a default <code>tailwind.config.js</code> file looks like at the time of writing:</p>
<pre><code class="language-js">module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
</code></pre>
<p>Hopefully that looks good enough to you.</p>
<h3 id="what-about-nested-lists">What about nested lists?</h3>
<p>Nested lists basically always look bad which is why editors like Medium don''t even let you do it, but I guess since some of you goofballs are going to do it we have to carry the burden of at least making it work.</p>
<ol>
<li><strong>Nested lists are rarely a good idea.</strong>
<ul>
<li>You might feel like you are being really "organized" or something but you are just creating a gross shape on the screen that is hard to read.</li>
<li>Nested navigation in UIs is a bad idea too, keep things as flat as possible.</li>
<li>Nesting tons of folders in your source code is also not helpful.</li>
</ul>
</li>
<li><strong>Since we need to have more items, here''s another one.</strong>
<ul>
<li>I''m not sure if we''ll bother styling more than two levels deep.</li>
<li>Two is already too much, three is guaranteed to be a bad idea.</li>
<li>If you nest four levels deep you belong in prison.</li>
</ul>
</li>
<li><strong>Two items isn''t really a list, three is good though.</strong>
<ul>
<li>Again please don''t nest lists if you want people to actually read your content.</li>
<li>Nobody wants to look at this.</li>
<li>I''m upset that we even have to bother styling this.</li>
</ul>
</li>
</ol>
<p>The most annoying thing about lists in Markdown is that <code>&#x3C;li></code> elements aren''t given a child <code>&#x3C;p></code> tag unless there are multiple paragraphs in the list item. That means I have to worry about styling that annoying situation too.</p>
<ul>
<li>
<p><strong>For example, here''s another nested list.</strong></p>
<p>But this time with a second paragraph.</p>
<ul>
<li>These list items won''t have <code>&#x3C;p></code> tags</li>
<li>Because they are only one line each</li>
</ul>
</li>
<li>
<p><strong>But in this second top-level list item, they will.</strong></p>
<p>This is especially annoying because of the spacing on this paragraph.</p>
<ul>
<li>
<p>As you can see here, because I''ve added a second line, this list item now has a <code>&#x3C;p></code> tag.</p>
<p>This is the second line I''m talking about by the way.</p>
</li>
<li>
<p>Finally here''s another list item so it''s more like a list.</p>
</li>
</ul>
</li>
<li>
<p>A closing list item, but with no nested list, because why not?</p>
</li>
</ul>
<p>And finally a sentence to close off this section.</p>
<h2 id="there-are-other-elements-we-need-to-style">There are other elements we need to style</h2>
<p>I almost forgot to mention links, like <a href="https://tailwindcss.com">this link to the Tailwind CSS website</a>. We almost made them blue but that''s so yesterday, so we went with dark gray, feels edgier.</p>
<p>We even included table styles, check it out:</p>
<p>| Wrestler                | Origin       | Finisher           |
| ----------------------- | ------------ | ------------------ |
| Bret "The Hitman" Hart  | Calgary, AB  | Sharpshooter       |
| Stone Cold Steve Austin | Austin, TX   | Stone Cold Stunner |
| Randy Savage            | Sarasota, FL | Elbow Drop         |
| Vader                   | Boulder, CO  | Vader Bomb         |
| Razor Ramon             | Chuluota, FL | Razor''s Edge       |</p>
<p>We also need to make sure inline code looks good, like if I wanted to talk about <code>&#x3C;span></code> elements or tell you the good news about <code>@tailwindcss/typography</code>.</p>
<h3 id="sometimes-i-even-use-code-in-headings">Sometimes I even use <code>code</code> in headings</h3>
<p>Even though it''s probably a bad idea, and historically I''ve had a hard time making it look good. This <em>"wrap the code blocks in backticks"</em> trick works pretty well though really.</p>
<p>Another thing I''ve done in the past is put a <code>code</code> tag inside of a link, like if I wanted to tell you about the <a href="https://github.com/tailwindcss/docs"><code>tailwindcss/docs</code></a> repository. I don''t love that there is an underline below the backticks but it is absolutely not worth the madness it would require to avoid it.</p>
<h4 id="we-havent-used-an-h-4-yet">We haven''t used an <code>h4</code> yet</h4>
<p>But now we have. Please don''t use <code>h5</code> or <code>h6</code> in your content, Medium only supports two heading levels for a reason, you animals. I honestly considered using a <code>before</code> pseudo-element to scream at you if you use an <code>h5</code> or <code>h6</code>.</p>
<p>We don''t style them at all out of the box because <code>h4</code> elements are already so small that they are the same size as the body copy. What are we supposed to do with an <code>h5</code>, make it <em>smaller</em> than the body copy? No thanks.</p>
<h3 id="we-still-need-to-think-about-stacked-headings-though">We still need to think about stacked headings though.</h3>
<h4 id="lets-make-sure-we-dont-screw-that-up-with-h-4-elements-either">Let''s make sure we don''t screw that up with <code>h4</code> elements, either.</h4>
<p>Phew, with any luck we have styled the headings above this text and they look pretty good.</p>
<p>Let''s add a closing paragraph here so things end with a decently sized block of text. I can''t explain why I want things to end that way but I have to assume it''s because I think things will look weird or unbalanced if there is a heading too close to the end of the document.</p>
<p>What I''ve written here is probably long enough, but adding this final sentence can''t hurt.</p>', headings = '[{"depth":2,"slug":"what-to-expect-from-here-on-out","text":"What to expect from here on out"},{"depth":3,"slug":"typography-should-be-easy","text":"Typography should be easy"},{"depth":2,"slug":"what-if-we-stack-headings","text":"What if we stack headings?"},{"depth":3,"slug":"we-should-make-sure-that-looks-good-too","text":"We should make sure that looks good, too."},{"depth":3,"slug":"when-a-heading-comes-after-a-paragraph","text":"When a heading comes after a paragraph …"},{"depth":2,"slug":"code-should-look-okay-by-default","text":"Code should look okay by default."},{"depth":3,"slug":"what-about-nested-lists","text":"What about nested lists?"},{"depth":2,"slug":"there-are-other-elements-we-need-to-style","text":"There are other elements we need to style"},{"depth":3,"slug":"sometimes-i-even-use-code-in-headings","text":"Sometimes I even use code in headings"},{"depth":4,"slug":"we-havent-used-an-h-4-yet","text":"We haven''t used an h4 yet"},{"depth":3,"slug":"we-still-need-to-think-about-stacked-headings-though","text":"We still need to think about stacked headings though."},{"depth":4,"slug":"lets-make-sure-we-dont-screw-that-up-with-h-4-elements-either","text":"Let''s make sure we don''t screw that up with h4 elements, either."}]', search_text = 'This article is from TailwindLabs. I put this article to demonstrate how you can write blog posts/articles using AstroPaper theme. By default, Tailwind removes all of the default browser styling from paragraphs, headings, lists and more. This ends up being really useful for building application UIs because you spend less time undoing user agent styles, but when you really are just trying to style some content that came from a rich text editor in a CMS or a markdown file, it can be surprising and unintuitive. We get lots of complaints about it actually, with people regularly asking us things like: Why is Tailwind removing the default styles on my h1 elements? How do I disable this? What do you mean I lose all the other base styles too? We hear you, but we''re not convinced that simply disabling our base styles is what you really want. You don''t want to have to remove annoying margins every time you use a p element in a piece of your dashboard UI. And I doubt you really want your blog posts to use the user agent styles either — you want them to look awesome , not awful. The @tailwindcss/typography plugin is our attempt to give you what you actually want, without any of the downsides of doing something stupid like disabling our base styles. It adds a new prose class that you can slap on any block of vanilla HTML content and turn it into a beautiful, well formatted document: For more information about how to use the plugin and the features it includes, read the documentation. What to expect from here on out What follows from here is just a bunch of absolute nonsense I''ve written to dogfood the plugin itself. It includes every sensible typographic element I could think of, like bold text , unordered lists, ordered lists, code blocks, block quotes, and even italics . It''s important to cover all of these use cases for a few reasons: 1. We want everything to look good out of the box. 2. Really just the first reason, that''s the whole point of the plugin. 3. Here''s a third pretend reason though a list with three items looks more realistic than a list with two items. Now we''re going to try out another header style. Typography should be easy So that''s a header for you — with any luck if we''ve done our job correctly that will look pretty reasonable. Something a wise person once told me about typography is: Typography is pretty important if you don''t want your stuff to look like trash. Make it good then it won''t be bad. It''s probably important that images look okay here by default as well: <figure <img src="https://images.unsplash.com/photo 1556740758 90de374c12ad?ixlib=rb 1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80" alt="" / <figcaption Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. </figcaption </figure Now I''m going to show you an example of an unordered list to make sure that looks good, too: So here is the first item in this list. In this example we''re keeping the items short. Later, we''ll use longer, more complex list items. And that''s the end of this section. What if we stack headings? We should make sure that looks good, too. Sometimes you have headings directly underneath each other. In those cases you often have to undo the top margin on the second heading because it usually looks better for the headings to be closer together than a paragraph followed by a heading should be. When a heading comes after a paragraph … When a heading comes after a paragraph, we need a bit more space, like I already mentioned above. Now let''s see what a more complex list would look like. I often do this thing where list items have headings. For some reason I think this looks cool which is unfortunate because it''s pretty annoying to get the styles right. I often have two or three paragraphs in these list items, too, so the hard part is getting the spacing between the paragraphs, list item heading, and separate list items to all make sense. Pretty tough honestly, you could make a strong argument that you just shouldn''t write this way. Since this is a list, I need at least two items. I explained what I''m doing already in the previous list item, but a list wouldn''t be a list if it only had one item, and we really want this to look realistic. That''s why I''ve added this second list item so I actually have something to look at when writing the styles. It''s not a bad idea to add a third item either. I think it probably would''ve been fine to just use two items but three is definitely not worse, and since I seem to be having no trouble making up arbitrary things to type, I might as well include it. After this sort of list I usually have a closing statement or paragraph, because it kinda looks weird jumping right to a heading. Code should look okay by default. I think most people are going to use highlight.js or Prism or something if they want to style their code blocks but it wouldn''t hurt to make them look okay out of the box, even with no syntax highlighting. Here''s what a default tailwind.config.js file looks like at the time of writing: Hopefully that looks good enough to you. What about nested lists? Nested lists basically always look bad which is why editors like Medium don''t even let you do it, but I guess since some of you goofballs are going to do it we have to carry the burden of at least making it work. 1. Nested lists are rarely a good idea. You might feel like you are being really "organized" or something but you are just creating a gross shape on the screen that is hard to read. Nested navigation in UIs is a bad idea too, keep things as flat as possible. Nesting tons of folders in your source code is also not helpful. 2. Since we need to have more items, here''s another one. I''m not sure if we''ll bother styling more than two levels deep. Two is already too much, three is guaranteed to be a bad idea. If you nest four levels deep you belong in prison. 3. Two items isn''t really a list, three is good though. Again please don''t nest lists if you want people to actually read your content. Nobody wants to look at this. I''m upset that we even have to bother styling this. The most annoying thing about lists in Markdown is that <li elements aren''t given a child <p tag unless there are multiple paragraphs in the list item. That means I have to worry about styling that annoying situation too. For example, here''s another nested list. But this time with a second paragraph. These list items won''t have <p tags Because they are only one line each But in this second top level list item, they will. This is especially annoying because of the spacing on this paragraph. As you can see here, because I''ve added a second line, this list item now has a <p tag. This is the second line I''m talking about by the way. Finally here''s another list item so it''s more like a list. A closing list item, but with no nested list, because why not? And finally a sentence to close off this section. There are other elements we need to style I almost forgot to mention links, like this link to the Tailwind CSS website. We almost made them blue but that''s so yesterday, so we went with dark gray, feels edgier. We even included table styles, check it out: | Wrestler | Origin | Finisher | | | | | | Bret "The Hitman" Hart | Calgary, AB | Sharpshooter | | Stone Cold Steve Austin | Austin, TX | Stone Cold Stunner | | Randy Savage | Sarasota, FL | Elbow Drop | | Vader | Boulder, CO | Vader Bomb | | Razor Ramon | Chuluota, FL | Razor''s Edge | We also need to make sure inline code looks good, like if I wanted to talk about <span elements or tell you the good news about @tailwindcss/typography. Sometimes I even use code in headings Even though it''s probably a bad idea, and historically I''ve had a hard time making it look good. This "wrap the code blocks in backticks" trick works pretty well though really. Another thing I''ve done in the past is put a code tag inside of a link, like if I wanted to tell you about the tailwindcss/docs repository. I don''t love that there is an underline below the backticks but it is absolutely not worth the madness it would require to avoid it. We haven''t used an h4 yet But now we have. Please don''t use h5 or h6 in your content, Medium only supports two heading levels for a reason, you animals. I honestly considered using a before pseudo element to scream at you if you use an h5 or h6. We don''t style them at all out of the box because h4 elements are already so small that they are the same size as the body copy. What are we supposed to do with an h5, make it smaller than the body copy? No thanks. We still need to think about stacked headings though. Let''s make sure we don''t screw that up with h4 elements, either. Phew, with any luck we have styled the headings above this text and they look pretty good. Let''s add a closing paragraph here so things end with a decently sized block of text. I can''t explain why I want things to end that way but I have to assume it''s because I think things will look weird or unbalanced if there is a heading too close to the end of the document. What I''ve written here is probably long enough, but adding this final sentence can''t hurt.' WHERE slug = 'tailwind-typography';
UPDATE posts SET body_html = '<blockquote>
<p>This article is originally from my <a href="https://satnaing.dev/blog/posts/how-do-i-develop-my-terminal-portfolio-website-with-react">blog post</a>. I put this article to demonstrate how you can write blog posts/articles using AstroPaper theme.</p>
</blockquote>
<p>Developing a terminal-like website using ReactJS, TypeScript and Styled-Components. Includes features like autocomplete, multiple themes, command hints etc.</p>
<p><img src="https://satnaing.dev/_ipx/w_2048,q_75/https%3A%2F%2Fres.cloudinary.com%2Fnoezectz%2Fimage%2Fupload%2Fv1654754125%2FSatNaing%2Fterminal-screenshot_gu3kkc.png?url=https%3A%2F%2Fres.cloudinary.com%2Fnoezectz%2Fimage%2Fupload%2Fv1654754125%2FSatNaing%2Fterminal-screenshot_gu3kkc.png&#x26;w=2048&#x26;q=75" alt="Sat Naing&#x27;s Terminal Portfolio"></p>
<h2 id="table-of-contents-8">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#intro">Intro</a></li>
<li><a href="#tech-stack">Tech Stack</a></li>
<li><a href="#features">Features</a>
<ul>
<li><a href="#multiple-themes">Multiple Themes</a></li>
<li><a href="#command-line-completion">Command-line Completion</a></li>
<li><a href="#previous-commands">Previous Commands</a></li>
<li><a href="#viewclear-command-history">View/Clear Command History</a></li>
</ul>
</li>
<li><a href="#outro">Outro</a></li>
<li><a href="#project-links">Project Links</a></li>
</ul>
<p></p>
<h2 id="intro-1">Intro</h2>
<p>Recently, I''ve developed and published my portfolio + a blog. I’m glad I got some good feedback for it. Today, I want to introduce my new terminal-like portfolio website. It is developed using ReactJS, TypeScript. I got this idea from CodePen and YouTube.</p>
<h2 id="tech-stack-1">Tech Stack</h2>
<p>This project is a frontend project without any backend codes. The UI/UX part is designed in Figma. For the frontend user-interface, I chose React over pain JavaScript and NextJS. Why?</p>
<ul>
<li>Firstly, I want to write declarative code. Managing HTML DOM using JavaScript imperatively is really tedious.</li>
<li>Secondly, because it is React!!! It is fast, and reliable.</li>
<li>Lastly, I don’t need much of the SEO features, routing and image optimization provided by NextJS.</li>
</ul>
<p>And of course there''s TypeScript for type checking.</p>
<p>For styling, I took a different approach than what I usually do. Instead of choosing Pure CSS, Sass, or Utility CSS Framework like TailwindCSS, I chose the CSS-in-JS way (Styled-Components). Although I’ve known about Styled-Components for some time, I’ve never tried it out. So, the writing style and structures of Styled-Components in this project may not be very organized or very good.</p>
<p>This project doesn’t need very complex state management. I just use ContextAPI in this project for multiple theming and to avoid prop drilling.</p>
<p>Here’s a quick recap for the tech stack.</p>
<ul>
<li>Frontend: <a href="https://reactjs.org/" title="React Website">ReactJS</a>, <a href="https://www.typescriptlang.org/" title="TypeScript Website">TypeScript</a></li>
<li>Styling: <a href="https://styled-components.com/" title="Styled-Components Website">Styled-Components</a></li>
<li>UI/UX: <a href="https://figma.com/" title="Figma Website">Figma</a></li>
<li>State Management: <a href="https://reactjs.org/docs/context.html" title="React ContextAPI">ContextAPI</a></li>
<li>Deployment: <a href="https://www.netlify.com/" title="Netlify Website">Netlify</a></li>
</ul>
<h2 id="features-1">Features</h2>
<p>Here are some features of the project.</p>
<h3 id="multiple-themes">Multiple Themes</h3>
<p>Users can change multiple themes. At the time of writing this post, there are 5 themes; and more themes will probably be added in the future. The selected theme is saved in local storage so that the theme won’t change on page refresh.</p>
<p><img src="https://i.ibb.co/fSTCnWB/terminal-portfolio-multiple-themes.gif" alt="Setting different theme"></p>
<h3 id="command-line-completion">Command-line Completion</h3>
<p>To look and feel as close to the actual terminal as possible, I put a command-line completion feature which auto fills in partially typed commands by simply pressing ‘Tab’ or ‘Ctrl + i’.</p>
<p><img src="https://i.ibb.co/CQTGGLF/terminal-autocomplete.gif" alt="Demonstrating command-line completion"></p>
<h3 id="previous-commands">Previous Commands</h3>
<p>Users can go back to the previous commands or navigate the previously typed commands by pressing Up &#x26; Down Arrows.</p>
<p><img src="https://i.ibb.co/vD1pSRv/terminal-up-down.gif" alt="Going back to previous commands with UP Arrow"></p>
<h3 id="view-clear-command-history">View/Clear Command History</h3>
<p>previously typed commands can be viewed by typing ‘history’ in the command line. All the command history and terminal screen can be wiped out by typing ‘clear’ or pressing ‘Ctrl + l’.</p>
<p><img src="https://i.ibb.co/SJBy8Rr/terminal-clear.gif" alt="Clearing the terminal with &#x27;clear&#x27; or &#x27;Ctrl + L&#x27; command"></p>
<h2 id="outro-2">Outro</h2>
<p>This is a really fun project, and one special part of this project is I had to focus on logic rather than user-interface (even though this is kind of a frontend project).</p>
<h2 id="project-links-1">Project Links</h2>
<ul>
<li>Website: <a href="https://terminal.satnaing.dev/" title="https://terminal.satnaing.dev/">https://terminal.satnaing.dev/</a></li>
<li>Repo: <a href="https://github.com/satnaing/terminal-portfolio" title="https://github.com/satnaing/terminal-portfolio">https://github.com/satnaing/terminal-portfolio</a></li>
</ul>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"intro","text":"Intro"},{"depth":2,"slug":"tech-stack","text":"Tech Stack"},{"depth":2,"slug":"features","text":"Features"},{"depth":3,"slug":"multiple-themes","text":"Multiple Themes"},{"depth":3,"slug":"command-line-completion","text":"Command-line Completion"},{"depth":3,"slug":"previous-commands","text":"Previous Commands"},{"depth":3,"slug":"view-clear-command-history","text":"View/Clear Command History"},{"depth":2,"slug":"outro","text":"Outro"},{"depth":2,"slug":"project-links","text":"Project Links"}]', search_text = 'This article is originally from my blog post. I put this article to demonstrate how you can write blog posts/articles using AstroPaper theme. Developing a terminal like website using ReactJS, TypeScript and Styled Components. Includes features like autocomplete, multiple themes, command hints etc. Sat Naing''s Terminal Portfolio Table of contents Intro Recently, I''ve developed and published my portfolio + a blog. I’m glad I got some good feedback for it. Today, I want to introduce my new terminal like portfolio website. It is developed using ReactJS, TypeScript. I got this idea from CodePen and YouTube. Tech Stack This project is a frontend project without any backend codes. The UI/UX part is designed in Figma. For the frontend user interface, I chose React over pain JavaScript and NextJS. Why? Firstly, I want to write declarative code. Managing HTML DOM using JavaScript imperatively is really tedious. Secondly, because it is React!!! It is fast, and reliable. Lastly, I don’t need much of the SEO features, routing and image optimization provided by NextJS. And of course there''s TypeScript for type checking. For styling, I took a different approach than what I usually do. Instead of choosing Pure CSS, Sass, or Utility CSS Framework like TailwindCSS, I chose the CSS in JS way (Styled Components). Although I’ve known about Styled Components for some time, I’ve never tried it out. So, the writing style and structures of Styled Components in this project may not be very organized or very good. This project doesn’t need very complex state management. I just use ContextAPI in this project for multiple theming and to avoid prop drilling. Here’s a quick recap for the tech stack. Frontend: ReactJS, TypeScript Styling: Styled Components UI/UX: Figma State Management: ContextAPI Deployment: Netlify Features Here are some features of the project. Multiple Themes Users can change multiple themes. At the time of writing this post, there are 5 themes; and more themes will probably be added in the future. The selected theme is saved in local storage so that the theme won’t change on page refresh. Setting different theme Command line Completion To look and feel as close to the actual terminal as possible, I put a command line completion feature which auto fills in partially typed commands by simply pressing ‘Tab’ or ‘Ctrl + i’. Demonstrating command line completion Previous Commands Users can go back to the previous commands or navigate the previously typed commands by pressing Up & Down Arrows. Going back to previous commands with UP Arrow View/Clear Command History previously typed commands can be viewed by typing ‘history’ in the command line. All the command history and terminal screen can be wiped out by typing ‘clear’ or pressing ‘Ctrl + l’. Clearing the terminal with ''clear'' or ''Ctrl + L'' command Outro This is a really fun project, and one special part of this project is I had to focus on logic rather than user interface (even though this is kind of a frontend project). Project Links Website: https://terminal.satnaing.dev/ Repo: https://github.com/satnaing/terminal portfolio' WHERE slug = 'how-do-i-develop-my-terminal-portfolio-website-with-react';
UPDATE posts SET body_html = '<p>This document demonstrates how to use LaTeX equations in your Markdown files for AstroPaper. LaTeX is a powerful typesetting system often used for mathematical and scientific documents.</p>
<h2 id="table-of-contents-9">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#instructions">Instructions</a></li>
<li><a href="#inline-equations">Inline Equations</a></li>
<li><a href="#block-equations">Block Equations</a></li>
<li><a href="#using-mathematical-symbols">Using Mathematical Symbols</a></li>
</ul>
<p></p>
<h2 id="instructions">Instructions</h2>
<p>In this section, you will find instructions on how to add support for LaTeX in your Markdown files for AstroPaper.</p>
<ol>
<li>
<p>Install the necessary remark and rehype plugins by running:</p>
<pre><code class="language-bash">pnpm install rehype-katex remark-math katex
</code></pre>
</li>
<li>
<p>Update the Astro configuration to use the these plugins:</p>
<pre><code class="language-ts">// ...
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  // ...
  markdown: {
    remarkPlugins: [
      remarkMath, // [!code ++]
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [rehypeKatex], // [!code ++]
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: false,
    },
  },
  // ...
});
</code></pre>
</li>
<li>
<p>Import KaTeX CSS in the main layout file</p>
<pre><code class="language-astro">---
import { SITE } from "@config";

// astro code
---

&#x3C;!doctype html>
&#x3C;!-- others... -->
&#x3C;script is:inline src="/toggle-theme.js">&#x3C;/script>

&#x3C;!-- [!code highlight:4] -->
&#x3C;link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
/>

&#x3C;body>
  &#x3C;slot />
&#x3C;/body>
</code></pre>
</li>
<li>
<p>As the last step, add a text-color for <code>katex</code> in <code>typography.css</code>.</p>
<pre><code class="language-css">@plugin ''@tailwindcss/typography'';

@layer base {
  /* other classes */

  /* Katex text color */
  /* [!code highlight:3] */
  .prose .katex-display {
    @apply text-foreground;
  }

  /* ===== Code Blocks &#x26; Syntax Highlighting ===== */
  /* other classes */
}
</code></pre>
</li>
</ol>
<p>And <em>voilà</em>, this setup allows you to write LaTeX equations in your Markdown files, which will be rendered properly when the site is built. Once you do it, the rest of the document will appear rendered correctly.</p>
<hr>
<h2 id="inline-equations">Inline Equations</h2>
<p>Inline equations are written between single dollar signs <code>$...$</code>. Here are some examples:</p>
<ol>
<li>The famous mass-energy equivalence formula: <code>$E = mc^2$</code></li>
<li>The quadratic formula: <code>$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$</code></li>
<li>Euler''s identity: <code>$e^{i\pi} + 1 = 0$</code></li>
</ol>
<hr>
<h2 id="block-equations">Block Equations</h2>
<p>For more complex equations or when you want the equation to be displayed on its own line, use double dollar signs <code>$$...$$</code>:</p>
<p>The Gaussian integral:</p>
<pre><code class="language-bash">$$ \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi} $$
</code></pre>
<p>The definition of the Riemann zeta function:</p>
<pre><code class="language-bash">$$ \zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} $$
</code></pre>
<p>Maxwell''s equations in differential form:</p>
<pre><code class="language-bash">$$
\begin{aligned}
\nabla \cdot \mathbf{E} &#x26;= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &#x26;= 0 \\
\nabla \times \mathbf{E} &#x26;= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &#x26;= \mu_0\left(\mathbf{J} + \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}\right)
\end{aligned}
$$
</code></pre>
<hr>
<h2 id="using-mathematical-symbols">Using Mathematical Symbols</h2>
<p>LaTeX provides a wide range of mathematical symbols:</p>
<ul>
<li>Greek letters: <code>$\alpha$</code>, <code>$\beta$</code>, <code>$\gamma$</code>, <code>$\delta$</code>, <code>$\epsilon$</code>, <code>$\pi$</code></li>
<li>Operators: <code>$\sum$</code>, <code>$\prod$</code>, <code>$\int$</code>, <code>$\partial$</code>, <code>$\nabla$</code></li>
<li>Relations: <code>$\leq$</code>, <code>$\geq$</code>, <code>$\approx$</code>, <code>$\sim$</code>, <code>$\propto$</code></li>
<li>Logical symbols: <code>$\forall$</code>, <code>$\exists$</code>, <code>$\neg$</code>, <code>$\wedge$</code>, <code>$\vee$</code></li>
</ul>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"instructions","text":"Instructions"},{"depth":2,"slug":"inline-equations","text":"Inline Equations"},{"depth":2,"slug":"block-equations","text":"Block Equations"},{"depth":2,"slug":"using-mathematical-symbols","text":"Using Mathematical Symbols"}]', search_text = 'This document demonstrates how to use LaTeX equations in your Markdown files for AstroPaper. LaTeX is a powerful typesetting system often used for mathematical and scientific documents. <figure <img src="https://images.pexels.com/photos/22690748/pexels photo 22690748/free photo of close up of complicated equations written on a blackboard.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Free Close up of complex equations on a chalkboard, showcasing chemistry and math symbols. Stock Photo" / <figcaption class="text center" Photo by <a href="https://www.pexels.com/photo/close up of complicated equations written on a blackboard 22690748/" Vitaly Gariev</a </figcaption </figure Table of contents Instructions In this section, you will find instructions on how to add support for LaTeX in your Markdown files for AstroPaper. 1. Install the necessary remark and rehype plugins by running: 2. Update the Astro configuration to use the these plugins: 3. Import KaTeX CSS in the main layout file 4. As the last step, add a text color for katex in typography.css. And voilà , this setup allows you to write LaTeX equations in your Markdown files, which will be rendered properly when the site is built. Once you do it, the rest of the document will appear rendered correctly. Inline Equations Inline equations are written between single dollar signs $...$. Here are some examples: 1. The famous mass energy equivalence formula: $E = mc^2$ 2. The quadratic formula: $x = \frac{ b \pm \sqrt{b^2 4ac}}{2a}$ 3. Euler''s identity: $e^{i\pi} + 1 = 0$ Block Equations For more complex equations or when you want the equation to be displayed on its own line, use double dollar signs $$...$$: The Gaussian integral: The definition of the Riemann zeta function: Maxwell''s equations in differential form: Using Mathematical Symbols LaTeX provides a wide range of mathematical symbols: Greek letters: $\alpha$, $\beta$, $\gamma$, $\delta$, $\epsilon$, $\pi$ Operators: $\sum$, $\prod$, $\int$, $\partial$, $\nabla$ Relations: $\leq$, $\geq$, $\approx$, $\sim$, $\propto$ Logical symbols: $\forall$, $\exists$, $\neg$, $\wedge$, $\vee$' WHERE slug = 'how-to-add-latex-equations-in-blog-posts';
UPDATE posts SET body_html = '<p>AstroPaper is a highly customizable Astro blog theme. With AstroPaper, you can customize everything according to your personal taste. This article will explain how you can make some customizations easily in the config file.</p>
<h2 id="table-of-contents-10">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#configuring-site">Configuring SITE</a></li>
<li><a href="#update-layout-width">Update layout width</a></li>
<li><a href="#configuring-logo-or-title">Configuring logo or title</a>
<ul>
<li><a href="#option-1-site-title-text">Option 1: SITE title text</a></li>
<li><a href="#option-2-astros-svg-component">Option 2: Astro''s SVG component</a></li>
<li><a href="#option-3-astros-image-component">Option 3: Astro''s Image component</a></li>
</ul>
</li>
<li><a href="#configuring-social-links">Configuring social links</a></li>
<li><a href="#configuring-share-links">Configuring share links</a></li>
<li><a href="#conclusion">Conclusion</a></li>
</ul>
<p></p>
<h2 id="configuring-site">Configuring SITE</h2>
<p>The important configurations resides in <code>src/config.ts</code> file. Within that file, you''ll see the <code>SITE</code> object where you can specify your website''s main configurations.</p>
<p>During development, it''s okay to leave <code>SITE.website</code> empty. But in production mode, you should specify your deployed url in <code>SITE.website</code> option since this will be used for canonical URL, social card URL etc.. which are important for SEO.</p>
<pre><code class="language-js">export const SITE = {
  website: "https://astro-paper.pages.dev/", // replace this with your deployed domain
  author: "Sat Naing",
  profile: "https://satnaing.dev/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "AstroPaper",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true, // enable automatic dynamic og-image generation
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
</code></pre>
<p>Here are SITE configuration options</p>
<p>| Options               | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>website</code>             | Your deployed website URL                                                                                                                                                                                                                                                                                                                                                                                                         |
| <code>author</code>              | Your name                                                                                                                                                                                                                                                                                                                                                                                                                         |
| <code>profile</code>             | Your personal/portfolio website URL which is used for better SEO. Put <code>null</code> or empty string <code>""</code> if you don''t have any.                                                                                                                                                                                                                                                                                                          |
| <code>desc</code>                | Your site description. Useful for SEO and social media sharing.                                                                                                                                                                                                                                                                                                                                                                   |
| <code>title</code>               | Your site name                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <code>ogImage</code>             | Your default OG image for the site. Useful for social media sharing. OG images can be an external image URL or they can be placed under <code>/public</code> directory.                                                                                                                                                                                                                                                                      |
| <code>lightAndDarkMode</code>    | Enable or disable <code>light &#x26; dark mode</code> for the website. If disabled, primary color scheme will be used. This option is enabled by default.                                                                                                                                                                                                                                                                                         |
| <code>postPerIndex</code>        | The number of posts to be displayed at the home page under <code>Recent</code> section.                                                                                                                                                                                                                                                                                                                                                      |
| <code>postPerPage</code>         | You can specify how many posts will be displayed in each posts page. (eg: if you set <code>SITE.postPerPage</code> to 3, each page will only show 3 posts per page)                                                                                                                                                                                                                                                                          |
| <code>scheduledPostMargin</code> | In Production mode, posts with a future <code>pubDatetime</code> will not be visible. However, if a post''s <code>pubDatetime</code> is within the next 15 minutes, it will be visible. You can set <code>scheduledPostMargin</code> if you don''t like the default 15 minutes margin.                                                                                                                                                                               |
| <code>showArchives</code>        | Determines whether to display the <code>Archives</code> menu (positioned between the <code>About</code> and <code>Search</code> menus) and its corresponding page on the site. This option is set to <code>true</code> by default.                                                                                                                                                                                                                                            |
| <code>showBackButton</code>      | Determines whether to display the <code>Go back</code> button in each blog post.                                                                                                                                                                                                                                                                                                                                                             |
| <code>editPost</code>            | This option allows users to suggest changes to a blog post by providing an edit link under blog post titles. This feature can be disabled by setting <code>SITE.editPost.enabled</code> to <code>false</code>.                                                                                                                                                                                                                                          |
| <code>dynamicOgImage</code>      | This option controls whether to <a href="https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/">generate dynamic og-image</a> if no <code>ogImage</code> is specified in the blog post frontmatter. If you have many blog posts, you might want to disable this feature. See the <a href="https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/#trade-off">trade-off</a> for more details. |
| <code>dir</code>                 | Specifies the text direction of the entire blog. Used as <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir">HTML dir attribute</a> in <code>&#x3C;html dir="ltr"></code>. Supported values: <code>ltr</code> | <code>rtl</code> | <code>auto</code>                                                                                                                                                                                                |
| <code>lang</code>                | Used as HTML ISO Language code in <code>&#x3C;html lang"en"></code>. Default is <code>en</code>.                                                                                                                                                                                                                                                                                                                                                             |
| <code>timezone</code>            | This option allows you to specify your timezone using the <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">IANA format</a>. Setting this ensures consistent timestamps across your localhost and deployed site, eliminating time differences.                                                                                                                                                                          |</p>
<h2 id="update-layout-width">Update layout width</h2>
<p>The default <code>max-width</code> for the entire blog is <code>768px</code> (<code>max-w-3xl</code>). If you''d like to change it, you can easily update the <code>max-w-app</code> utility in your <code>global.css</code>. For instance:</p>
<pre><code class="language-css">@utility max-w-app {
  /* [!code --:1] */
  @apply max-w-3xl;
  /* [!code ++:1] */
  @apply max-w-4xl xl:max-w-5xl;
}
</code></pre>
<p>You can explore more <code>max-width</code> values in the <a href="https://tailwindcss.com/docs/max-width">Tailwind CSS docs</a>.</p>
<h2 id="configuring-logo-or-title">Configuring logo or title</h2>
<p>Prior to AstroPaper v5, you can update your site name/logo in <code>LOGO_IMAGE</code> object inside <code>src/config.ts</code> file. However, in AstroPaper v5, this option has been removed in favor of Astro''s built-in SVG and Image components.</p>
<p><img src="https://res.cloudinary.com/noezectz/v1663911318/astro-paper/AstroPaper-logo-config_goff5l.png" alt="An arrow pointing at the website logo"></p>
<p>There are 3 options you can do:</p>
<h3 id="option-1-site-title-text">Option 1: SITE title text</h3>
<p>This is the easiest option. You just have to update <code>SITE.title</code> in <code>src/config.ts</code> file.</p>
<h3 id="option-2-astros-svg-component">Option 2: Astro''s SVG component</h3>
<p>You might want to use this option if you want to use an SVG logo.</p>
<ul>
<li>
<p>First add an SVG inside <code>src/assets</code> directory. (eg: <code>src/assets/dummy-logo.svg</code>)</p>
</li>
<li>
<p>Then import that SVG inside <code>Header.astro</code></p>
<pre><code class="language-astro">---
// ...
import DummyLogo from "@/assets/dummy-logo.svg";
---
</code></pre>
</li>
<li>
<p>Finally, replace <code>{SITE.title}</code> with imported logo.</p>
<pre><code class="language-html">&#x3C;a
  href="/"
  class="absolute py-1 text-left text-2xl leading-7 font-semibold whitespace-nowrap sm:static"
>
  &#x3C;DummyLogo class="scale-75 dark:invert" />
  &#x3C;!-- {SITE.title} -->
&#x3C;/a>
</code></pre>
</li>
</ul>
<p>The best part of this approach is that you can customize your SVG styles as needed. In the example above, you can see how the SVG logo color can be inverted in dark mode.</p>
<h3 id="option-3-astros-image-component">Option 3: Astro''s Image component</h3>
<p>If your logo is an image but not SVG, you can use Astro''s Image component.</p>
<ul>
<li>
<p>Add your logo inside <code>src/assets</code> directory. (eg: <code>src/assets/dummy-logo.png</code>)</p>
</li>
<li>
<p>Import <code>Image</code> and your logo in <code>Header.astro</code></p>
<pre><code class="language-astro">---
// ...
import { Image } from "astro:assets";
import dummyLogo from "@/assets/dummy-logo.png";
---
</code></pre>
</li>
<li>
<p>Then, replace <code>{SITE.title}</code> with imported logo.</p>
<pre><code class="language-html">&#x3C;a
  href="/"
  class="absolute py-1 text-left text-2xl leading-7 font-semibold whitespace-nowrap sm:static"
>
  &#x3C;image src="{dummyLogo}" alt="Dummy Blog" class="dark:invert" />
  &#x3C;!-- {SITE.title} -->
&#x3C;/a>
</code></pre>
</li>
</ul>
<p>With this approach, you can still adjust your image''s appearance using CSS classes. However, this might not always fit what you want. If you need to display different logo images based on light or dark mode, check how light/dark icons are handled inside the <code>Header.astro</code> component.</p>
<h2 id="configuring-social-links">Configuring social links</h2>
<p><img src="https://github.com/user-attachments/assets/8b895400-d088-442f-881b-02d2443e00cf" alt="An arrow pointing at social link icons"></p>
<p>You can configure social links in <code>SOCIALS</code> object inside <code>constants.ts</code>.</p>
<pre><code class="language-ts">export const SOCIALS = [
  {
    name: "GitHub",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: ` ${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "X",
    href: "https://x.com/username",
    linkTitle: `${SITE.title} on X`,
    icon: IconBrandX,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/username/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
] as const;
</code></pre>
<h2 id="configuring-share-links">Configuring share links</h2>
<p>You can configure share links in <code>SHARE_LINKS</code> object inside <code>src/constants.ts</code>.</p>
<p><img src="https://github.com/user-attachments/assets/4f930b68-b625-45df-8c41-e076dd2b838e" alt="An arrow pointing at share link icons"></p>
<h2 id="conclusion">Conclusion</h2>
<p>This is the brief specification of how you can customize this theme. You can customize more if you know some coding. For customizing styles, please read <a href="https://astro-paper.pages.dev/posts/customizing-astropaper-theme-color-schemes/">this article</a>. Thanks for reading.✌🏻</p>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"configuring-site","text":"Configuring SITE"},{"depth":2,"slug":"update-layout-width","text":"Update layout width"},{"depth":2,"slug":"configuring-logo-or-title","text":"Configuring logo or title"},{"depth":3,"slug":"option-1-site-title-text","text":"Option 1: SITE title text"},{"depth":3,"slug":"option-2-astros-svg-component","text":"Option 2: Astro''s SVG component"},{"depth":3,"slug":"option-3-astros-image-component","text":"Option 3: Astro''s Image component"},{"depth":2,"slug":"configuring-social-links","text":"Configuring social links"},{"depth":2,"slug":"configuring-share-links","text":"Configuring share links"},{"depth":2,"slug":"conclusion","text":"Conclusion"}]', search_text = 'AstroPaper is a highly customizable Astro blog theme. With AstroPaper, you can customize everything according to your personal taste. This article will explain how you can make some customizations easily in the config file. Table of contents Configuring SITE The important configurations resides in src/config.ts file. Within that file, you''ll see the SITE object where you can specify your website''s main configurations. During development, it''s okay to leave SITE.website empty. But in production mode, you should specify your deployed url in SITE.website option since this will be used for canonical URL, social card URL etc.. which are important for SEO. Here are SITE configuration options | Options | Description | | | | | website | Your deployed website URL | | author | Your name | | profile | Your personal/portfolio website URL which is used for better SEO. Put null or empty string "" if you don''t have any. | | desc | Your site description. Useful for SEO and social media sharing. | | title | Your site name | | ogImage | Your default OG image for the site. Useful for social media sharing. OG images can be an external image URL or they can be placed under /public directory. | | lightAndDarkMode | Enable or disable light & dark mode for the website. If disabled, primary color scheme will be used. This option is enabled by default. | | postPerIndex | The number of posts to be displayed at the home page under Recent section. | | postPerPage | You can specify how many posts will be displayed in each posts page. (eg: if you set SITE.postPerPage to 3, each page will only show 3 posts per page) | | scheduledPostMargin | In Production mode, posts with a future pubDatetime will not be visible. However, if a post''s pubDatetime is within the next 15 minutes, it will be visible. You can set scheduledPostMargin if you don''t like the default 15 minutes margin. | | showArchives | Determines whether to display the Archives menu (positioned between the About and Search menus) and its corresponding page on the site. This option is set to true by default. | | showBackButton | Determines whether to display the Go back button in each blog post. | | editPost | This option allows users to suggest changes to a blog post by providing an edit link under blog post titles. This feature can be disabled by setting SITE.editPost.enabled to false. | | dynamicOgImage | This option controls whether to generate dynamic og image if no ogImage is specified in the blog post frontmatter. If you have many blog posts, you might want to disable this feature. See the trade off for more details. | | dir | Specifies the text direction of the entire blog. Used as HTML dir attribute in <html dir="ltr" . Supported values: ltr \| rtl \| auto | | lang | Used as HTML ISO Language code in <html lang"en" . Default is en. | | timezone | This option allows you to specify your timezone using the IANA format. Setting this ensures consistent timestamps across your localhost and deployed site, eliminating time differences. | Update layout width The default max width for the entire blog is 768px (max w 3xl). If you''d like to change it, you can easily update the max w app utility in your global.css. For instance: You can explore more max width values in the Tailwind CSS docs. Configuring logo or title Prior to AstroPaper v5, you can update your site name/logo in LOGO IMAGE object inside src/config.ts file. However, in AstroPaper v5, this option has been removed in favor of Astro''s built in SVG and Image components. An arrow pointing at the website logo There are 3 options you can do: Option 1: SITE title text This is the easiest option. You just have to update SITE.title in src/config.ts file. Option 2: Astro''s SVG component You might want to use this option if you want to use an SVG logo. First add an SVG inside src/assets directory. (eg: src/assets/dummy logo.svg) Then import that SVG inside Header.astro Finally, replace {SITE.title} with imported logo. The best part of this approach is that you can customize your SVG styles as needed. In the example above, you can see how the SVG logo color can be inverted in dark mode. Option 3: Astro''s Image component If your logo is an image but not SVG, you can use Astro''s Image component. Add your logo inside src/assets directory. (eg: src/assets/dummy logo.png) Import Image and your logo in Header.astro Then, replace {SITE.title} with imported logo. With this approach, you can still adjust your image''s appearance using CSS classes. However, this might not always fit what you want. If you need to display different logo images based on light or dark mode, check how light/dark icons are handled inside the Header.astro component. Configuring social links An arrow pointing at social link icons You can configure social links in SOCIALS object inside constants.ts. Configuring share links You can configure share links in SHARE LINKS object inside src/constants.ts. An arrow pointing at share link icons Conclusion This is the brief specification of how you can customize this theme. You can customize more if you know some coding. For customizing styles, please read this article. Thanks for reading.✌🏻' WHERE slug = 'how-to-configure-astropaper-theme';
UPDATE posts SET body_html = '<p>Hosting a thin static blog on a platform like <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site">GitHub Pages</a> has numerous advantages, but also takes away some interactivity. Fortunately, <a href="https://giscus.app/">Giscus</a> exists and offers a way to embed user comments on static sites.</p>
<h2 id="table-of-contents-11">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#how-giscus-works">How <em>Giscus</em> works</a></li>
<li><a href="#setting-up-giscus">Setting up <em>Giscus</em></a>
<ul>
<li><a href="#prerequisites">Prerequisites</a></li>
<li><a href="#configuring-giscus">Configuring <em>Giscus</em></a></li>
</ul>
</li>
<li><a href="#simple-script-tag">Simple script tag</a></li>
<li><a href="#react-component-with-lightdark-theme">React component with light/dark theme</a></li>
</ul>
<p></p>
<h2 id="how-giscus-works">How <em>Giscus</em> works</h2>
<p><a href="https://github.com/giscus/giscus?tab=readme-ov-file#how-it-works">Giscus uses the GitHub API</a> to read and store comments made by <em>GitHub</em> users in the <code>Discussions</code> associated with a repository.</p>
<p>Embed the <em>Giscus</em> client-side script bundle on your site, configure it with the correct repository URL, and users can view and write comments (when logged into <em>GitHub</em>).</p>
<p>The approach is serverless, as the comments are stored on <em>GitHub</em> and dynamically loaded from there on client side, hence perfect for a static blog, like <em>AstroPaper</em>.</p>
<h2 id="setting-up-giscus">Setting up <em>Giscus</em></h2>
<p><em>Giscus</em> can be set up easily on <a href="https://giscus.app/">giscus.app</a>, but I will outline the process shortly still.</p>
<h3 id="prerequisites">Prerequisites</h3>
<p>Prerequisites to get <em>Giscus</em> working are</p>
<ul>
<li>the repository is <a href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility#making-a-repository-public">public</a></li>
<li>the <a href="https://github.com/apps/giscus">Giscus app</a> is installed</li>
<li>the <a href="https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository">Discussions</a> feature is turned on for your repository</li>
</ul>
<p>If any of these conditions cannot be fulfilled for any reason, unfortunately, <em>Giscus</em> cannot be integrated.</p>
<h3 id="configuring-giscus">Configuring <em>Giscus</em></h3>
<p>Next, configuring <em>Giscus</em> is necessary. In most cases, the preselected defaults are suitable, and you should only modify them if you have a specific reason and know what you are doing. Don''t worry too much about making the wrong choices; you can always adjust the configuration later on.</p>
<p>However you need to</p>
<ul>
<li>select the right language for the UI</li>
<li>specify the <em>GitHub</em> repository you want to connect, typically the repository containing your statically hosted <em>AstroPaper</em> blog on <em>GitHub Pages</em></li>
<li>create and set an <code>Announcement</code> type discussion on <em>GitHub</em> if you want to ensure nobody can create random comments directly on <em>GitHub</em></li>
<li>define the color scheme</li>
</ul>
<p>After configuring the settings, <em>Giscus</em> provides you with a generated <code>&#x3C;script></code> tag, which you will need in the next steps.</p>
<h2 id="simple-script-tag">Simple script tag</h2>
<p>You should now have a script tag that looks like this:</p>
<pre><code class="language-html">&#x3C;script
  src="https://giscus.app/client.js"
  data-repo="[ENTER REPO HERE]"
  data-repo-id="[ENTER REPO ID HERE]"
  data-category="[ENTER CATEGORY NAME HERE]"
  data-category-id="[ENTER CATEGORY ID HERE]"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="en"
  crossorigin="anonymous"
  async
>&#x3C;/script>
</code></pre>
<p>Simply add that to the source code of the site. Most likely, if you''re using <em>AstroPaper</em> and want to enable comments on posts, navigate to <code>PostDetails.astro</code> and paste it into the desired location where you want the comments to appear, perhaps underneath the <code>Share this post on:</code> buttons.</p>
<pre><code class="language-astro">&#x3C;Layout {...layoutProps}>
  &#x3C;main>
    &#x3C;ShareLinks />

    &#x3C;!-- [!code ++:6] -->
    &#x3C;script
      src="https://giscus.app/client.js"
      data-repo="[ENTER REPO HERE]"
      data-repo-id="[ENTER REPO ID HERE]"
      data-category="[ENTER CATEGORY NAME HERE]"
      data-category-id="[ENTER CATEGORY ID HERE]">&#x3C;/script>
  &#x3C;/main>
  &#x3C;Footer />
&#x3C;/Layout>
</code></pre>
<p>And it''s done! You have successfully integrated comments in <em>AstroPaper</em>!</p>
<h2 id="react-component-with-light-dark-theme">React component with light/dark theme</h2>
<p>The embedded script tag in the layout is quite static, with the <em>Giscus</em> configuration, including <code>theme</code>, hardcoded into the layout. Given that <em>AstroPaper</em> features a light/dark theme toggle, it would be nice for the comments to seamlessly transition between light and dark themes along with the rest of the site. To achieve this, a more sophisticated approach to embedding <em>Giscus</em> is required.</p>
<p>Firstly, we are going to install the <a href="https://www.npmjs.com/package/@giscus/react">React component</a> for <em>Giscus</em>:</p>
<pre><code class="language-bash">npm i @giscus/react &#x26;&#x26; npx astro add react
</code></pre>
<p>Then we create a new <code>Comments.tsx</code> React component in <code>src/components</code>:</p>
<pre><code class="language-tsx">import Giscus, { type Theme } from "@giscus/react";
import { GISCUS } from "@/constants";
import { useEffect, useState } from "react";

interface CommentsProps {
  lightTheme?: Theme;
  darkTheme?: Theme;
}

export default function Comments({
  lightTheme = "light",
  darkTheme = "dark",
}: CommentsProps) {
  const [theme, setTheme] = useState(() => {
    const currentTheme = localStorage.getItem("theme");
    const browserTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return currentTheme || browserTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setTheme(matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const themeButton = document.querySelector("#theme-btn");
    const handleClick = () => {
      setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    };

    themeButton?.addEventListener("click", handleClick);

    return () => themeButton?.removeEventListener("click", handleClick);
  }, []);

  return (
    &#x3C;div className="mt-8">
      &#x3C;Giscus theme={theme === "light" ? lightTheme : darkTheme} {...GISCUS} />
    &#x3C;/div>
  );
}
</code></pre>
<p>This <em>React</em> component not only wraps the native <em>Giscus</em> component, but also introduces additional props, namely <code>lightTheme</code> and <code>darkTheme</code>. Leveraging two event listeners, the <em>Giscus</em> comments will align with the site''s theme, dynamically switching between dark and light themes whenever the site or browser theme is changed.</p>
<p>We also need to define the <code>GISCUS</code> config, for which the optimal location is in <code>constants.ts</code>:</p>
<pre><code class="language-ts">import type { GiscusProps } from "@giscus/react";

...

export const GISCUS: GiscusProps = {
  repo: "[ENTER REPO HERE]",
  repoId: "[ENTER REPO ID HERE]",
  category: "[ENTER CATEGORY NAME HERE]",
  categoryId: "[ENTER CATEGORY ID HERE]",
  mapping: "pathname",
  reactionsEnabled: "0",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
  loading: "lazy",
};
</code></pre>
<p>Note that specifying a <code>theme</code> here will override the <code>lightTheme</code> and <code>darkTheme</code> props, resulting in a static theme setting, similar to the previous approach of embedding <em>Giscus</em> with the <code>&#x3C;script></code> tag.</p>
<p>To complete the process, add the new Comments component to <code>PostDetails.astro</code> (replacing the <code>script</code> tag from the previous step).</p>
<pre><code class="language-jsx">// [!code ++:1]
import Comments from "@/components/Comments";

&#x3C;ShareLinks />

// [!code ++:1]
&#x3C;Comments client:only="react" />

&#x3C;hr class="my-6 border-dashed" />

&#x3C;Footer />
</code></pre>
<p>And that''s it!</p>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"how-giscus-works","text":"How Giscus works"},{"depth":2,"slug":"setting-up-giscus","text":"Setting up Giscus"},{"depth":3,"slug":"prerequisites","text":"Prerequisites"},{"depth":3,"slug":"configuring-giscus","text":"Configuring Giscus"},{"depth":2,"slug":"simple-script-tag","text":"Simple script tag"},{"depth":2,"slug":"react-component-with-light-dark-theme","text":"React component with light/dark theme"}]', search_text = 'Hosting a thin static blog on a platform like GitHub Pages has numerous advantages, but also takes away some interactivity. Fortunately, Giscus exists and offers a way to embed user comments on static sites. Table of contents How Giscus works Giscus uses the GitHub API to read and store comments made by GitHub users in the Discussions associated with a repository. Embed the Giscus client side script bundle on your site, configure it with the correct repository URL, and users can view and write comments (when logged into GitHub ). The approach is serverless, as the comments are stored on GitHub and dynamically loaded from there on client side, hence perfect for a static blog, like AstroPaper . Setting up Giscus Giscus can be set up easily on giscus.app, but I will outline the process shortly still. Prerequisites Prerequisites to get Giscus working are the repository is public the Giscus app is installed the Discussions feature is turned on for your repository If any of these conditions cannot be fulfilled for any reason, unfortunately, Giscus cannot be integrated. Configuring Giscus Next, configuring Giscus is necessary. In most cases, the preselected defaults are suitable, and you should only modify them if you have a specific reason and know what you are doing. Don''t worry too much about making the wrong choices; you can always adjust the configuration later on. However you need to select the right language for the UI specify the GitHub repository you want to connect, typically the repository containing your statically hosted AstroPaper blog on GitHub Pages create and set an Announcement type discussion on GitHub if you want to ensure nobody can create random comments directly on GitHub define the color scheme After configuring the settings, Giscus provides you with a generated <script tag, which you will need in the next steps. Simple script tag You should now have a script tag that looks like this: Simply add that to the source code of the site. Most likely, if you''re using AstroPaper and want to enable comments on posts, navigate to PostDetails.astro and paste it into the desired location where you want the comments to appear, perhaps underneath the Share this post on: buttons. And it''s done! You have successfully integrated comments in AstroPaper ! React component with light/dark theme The embedded script tag in the layout is quite static, with the Giscus configuration, including theme, hardcoded into the layout. Given that AstroPaper features a light/dark theme toggle, it would be nice for the comments to seamlessly transition between light and dark themes along with the rest of the site. To achieve this, a more sophisticated approach to embedding Giscus is required. Firstly, we are going to install the React component for Giscus : Then we create a new Comments.tsx React component in src/components: This React component not only wraps the native Giscus component, but also introduces additional props, namely lightTheme and darkTheme. Leveraging two event listeners, the Giscus comments will align with the site''s theme, dynamically switching between dark and light themes whenever the site or browser theme is changed. We also need to define the GISCUS config, for which the optimal location is in constants.ts: Note that specifying a theme here will override the lightTheme and darkTheme props, resulting in a static theme setting, similar to the previous approach of embedding Giscus with the <script tag. To complete the process, add the new Comments component to PostDetails.astro (replacing the script tag from the previous step). And that''s it!' WHERE slug = 'how-to-integrate-giscus-comments';
UPDATE posts SET body_html = '<p>Updating the dependencies of a project can be tedious. However, neglecting to update project dependencies is not a good idea either 😬. In this post, I will share how I usually update my projects, focusing on AstroPaper as an example. Nonetheless, these steps can be applied to other js/node projects as well.</p>
<p><img src="@/assets/images/forrest-gump-quote.png" alt="Forrest Gump Fake Quote"></p>
<h2 id="table-of-contents-12">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#updating-package-dependencies">Updating Package Dependencies</a></li>
<li><a href="#updating-astropaper-template">Updating AstroPaper template</a>
<ul>
<li><a href="#files-and-directories-to-keep-in-mind">Files and Directories to keep in mind</a></li>
<li><a href="#updating-astropaper-using-git">Updating AstroPaper using Git</a></li>
</ul>
</li>
<li><a href="#conclusion">Conclusion</a></li>
</ul>
<p></p>
<h2 id="updating-package-dependencies">Updating Package Dependencies</h2>
<p>There are several ways to update dependencies, and I''ve tried various methods to find the easiest path. One way to do it is by manually updating each package using <code>npm install package-name@latest</code>. This method is the most straightforward way of updating. However, it may not be the most efficient option.</p>
<p>My recommended way of updating dependencies is by using the <a href="https://www.npmjs.com/package/npm-check-updates">npm-check-updates package</a>. There''s a good <a href="https://www.freecodecamp.org/news/how-to-update-npm-dependencies/">article</a> from freeCodeCamp about that, so I won''t be explaining the details of what it is and how to use that package. Instead, I''ll show you my typical approach.</p>
<p>First, install <code>npm-check-updates</code> package globally.</p>
<pre><code class="language-bash">npm install -g npm-check-updates
</code></pre>
<p>Before making any updates, it’s a good idea to check all new dependencies that can be updated.</p>
<pre><code class="language-bash">ncu
</code></pre>
<p>Most of the time, patch dependencies can be updated without affecting the project at all. So, I usually update patch dependencies by running either <code>ncu -i --target patch</code> or <code>ncu -u --target patch</code>. The difference is that <code>ncu -u --target patch</code> will update all the patches, while <code>ncu -i --target patch</code> will give an option to toggle which package to update. It’s up to you to decide which approach to take.</p>
<p>The next part involves updating minor dependencies. Minor package updates usually won''t break the project, but it is always good to check the release notes of the respective packages. These minor updates often include some cool features that can be applied to our projects.</p>
<pre><code class="language-bash">ncu -i --target minor
</code></pre>
<p>Last but not least, there might be some major package updates in the dependencies. So, check the rest of the dependency updates by running</p>
<pre><code class="language-bash">ncu -i
</code></pre>
<p>If there are any major updates (or some updates you still have to make), the above command will output those remaining packages. If the package is a major version update, you have to be very careful since this will likely break the whole project. Therefore, please read the respective release note (or) docs very carefully and make changes accordingly.</p>
<p>If you run <code>ncu -i</code> and found no more packages to be updated, <em><strong>Congrats!!!</strong></em> you have successfully updated all the dependencies in your project.</p>
<h2 id="updating-astro-paper-template">Updating AstroPaper template</h2>
<p>Like other open-source projects, AstroPaper is evolving with bug fixes, feature updates, and so on. So if you’re someone who is using AstroPaper as a template, you might also want to update the template when there’s a new release.</p>
<p>The thing is, you might already have updated the template according to your flavor. Therefore, I can’t exactly show <strong>"the one-size-fits-all perfect way"</strong> to update the template to the most recent release. However, here are some tips to update the template without breaking your repo. Keep in mind that, most of the time, updating the package dependencies might be sufficient for you.</p>
<h3 id="files-and-directories-to-keep-in-mind">Files and Directories to keep in mind</h3>
<p>In most cases, the files and directories you might not want to override (as you''ve likely updated those files) are <code>src/content/blog/</code>, <code>src/config.ts</code>, <code>src/pages/about.md</code>, and other assets &#x26; styles like <code>public/</code> and <code>src/styles/base.css</code>.</p>
<p>If you’re someone who only updates the bare minimum of the template, it should be okay to replace everything with the latest AstroPaper except the above files and directories. It’s like pure Android OS and other vendor-specific OSes like OneUI. The less you modify the base, the less you have to update.</p>
<p>You can manually replace every file one by one, or you can use the magic of git to update everything. I won’t show you the manual replacement process since it is very straightforward. If you’re not interested in that straightforward and inefficient method, bear with me 🐻.</p>
<h3 id="updating-astro-paper-using-git">Updating AstroPaper using Git</h3>
<p><strong>IMPORTANT!!!</strong></p>
<blockquote>
<p>Only do the following if you know how to resolve merge conflicts. Otherwise, you’d better replace files manually or update dependencies only.</p>
</blockquote>
<p>First, add astro-paper as the remote in your project.</p>
<pre><code class="language-bash">git remote add astro-paper https://github.com/satnaing/astro-paper.git
</code></pre>
<p>Checkout to a new branch in order to update the template. If you know what you’re doing and you’re confident with your git skill, you can omit this step.</p>
<pre><code class="language-bash">git checkout -b build/update-astro-paper
</code></pre>
<p>Then, pull the changes from astro-paper by running</p>
<pre><code class="language-bash">git pull astro-paper main
</code></pre>
<p>If you face <code>fatal: refusing to merge unrelated histories</code> error, you can resolve that by running the following command</p>
<pre><code class="language-bash">git pull astro-paper main --allow-unrelated-histories
</code></pre>
<p>After running the above command, you’re likely to encounter conflicts in your project. You''ll need to resolve these conflicts manually and make the necessary adjustments according to your needs.</p>
<p>After resolving the conflicts, test your blog thoroughly to ensure everything is working as expected. Check your articles, components, and any customizations you made.</p>
<p>Once you''re satisfied with the result, it''s time to merge the update branch into your main branch (only if you are updating the template in another branch). Congratulations! You''ve successfully updated your template to the latest version. Your blog is now up-to-date and ready to shine! 🎉</p>
<h2 id="conclusion-1">Conclusion</h2>
<p>In this article, I''ve shared some of my insights and processes for updating dependencies and the AstroPaper template. I genuinely hope this article proves valuable and assists you in managing your projects more efficiently.</p>
<p>If you have any alternative or improved approaches for updating dependencies/AstroPaper, I would love to hear from you. Thus, don''t hesitate to start a discussion in the repository, email me, or open an issue. Your input and ideas are highly appreciated!</p>
<p>Please understand that my schedule is quite busy these days, and I may not be able to respond quickly. However, I promise to get back to you as soon as possible. 😬</p>
<p>Thank you for taking the time to read this article, and I wish you all the best with your projects!</p>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"updating-package-dependencies","text":"Updating Package Dependencies"},{"depth":2,"slug":"updating-astro-paper-template","text":"Updating AstroPaper template"},{"depth":3,"slug":"files-and-directories-to-keep-in-mind","text":"Files and Directories to keep in mind"},{"depth":3,"slug":"updating-astro-paper-using-git","text":"Updating AstroPaper using Git"},{"depth":2,"slug":"conclusion","text":"Conclusion"}]', search_text = 'Updating the dependencies of a project can be tedious. However, neglecting to update project dependencies is not a good idea either 😬. In this post, I will share how I usually update my projects, focusing on AstroPaper as an example. Nonetheless, these steps can be applied to other js/node projects as well. Forrest Gump Fake Quote Table of contents Updating Package Dependencies There are several ways to update dependencies, and I''ve tried various methods to find the easiest path. One way to do it is by manually updating each package using npm install package name@latest. This method is the most straightforward way of updating. However, it may not be the most efficient option. My recommended way of updating dependencies is by using the npm check updates package. There''s a good article from freeCodeCamp about that, so I won''t be explaining the details of what it is and how to use that package. Instead, I''ll show you my typical approach. First, install npm check updates package globally. Before making any updates, it’s a good idea to check all new dependencies that can be updated. Most of the time, patch dependencies can be updated without affecting the project at all. So, I usually update patch dependencies by running either ncu i target patch or ncu u target patch. The difference is that ncu u target patch will update all the patches, while ncu i target patch will give an option to toggle which package to update. It’s up to you to decide which approach to take. The next part involves updating minor dependencies. Minor package updates usually won''t break the project, but it is always good to check the release notes of the respective packages. These minor updates often include some cool features that can be applied to our projects. Last but not least, there might be some major package updates in the dependencies. So, check the rest of the dependency updates by running If there are any major updates (or some updates you still have to make), the above command will output those remaining packages. If the package is a major version update, you have to be very careful since this will likely break the whole project. Therefore, please read the respective release note (or) docs very carefully and make changes accordingly. If you run ncu i and found no more packages to be updated, Congrats!!! you have successfully updated all the dependencies in your project. Updating AstroPaper template Like other open source projects, AstroPaper is evolving with bug fixes, feature updates, and so on. So if you’re someone who is using AstroPaper as a template, you might also want to update the template when there’s a new release. The thing is, you might already have updated the template according to your flavor. Therefore, I can’t exactly show "the one size fits all perfect way" to update the template to the most recent release. However, here are some tips to update the template without breaking your repo. Keep in mind that, most of the time, updating the package dependencies might be sufficient for you. Files and Directories to keep in mind In most cases, the files and directories you might not want to override (as you''ve likely updated those files) are src/content/blog/, src/config.ts, src/pages/about.md, and other assets & styles like public/ and src/styles/base.css. If you’re someone who only updates the bare minimum of the template, it should be okay to replace everything with the latest AstroPaper except the above files and directories. It’s like pure Android OS and other vendor specific OSes like OneUI. The less you modify the base, the less you have to update. You can manually replace every file one by one, or you can use the magic of git to update everything. I won’t show you the manual replacement process since it is very straightforward. If you’re not interested in that straightforward and inefficient method, bear with me 🐻. Updating AstroPaper using Git IMPORTANT!!! Only do the following if you know how to resolve merge conflicts. Otherwise, you’d better replace files manually or update dependencies only. First, add astro paper as the remote in your project. Checkout to a new branch in order to update the template. If you know what you’re doing and you’re confident with your git skill, you can omit this step. Then, pull the changes from astro paper by running If you face fatal: refusing to merge unrelated histories error, you can resolve that by running the following command After running the above command, you’re likely to encounter conflicts in your project. You''ll need to resolve these conflicts manually and make the necessary adjustments according to your needs. After resolving the conflicts, test your blog thoroughly to ensure everything is working as expected. Check your articles, components, and any customizations you made. Once you''re satisfied with the result, it''s time to merge the update branch into your main branch (only if you are updating the template in another branch). Congratulations! You''ve successfully updated your template to the latest version. Your blog is now up to date and ready to shine! 🎉 Conclusion In this article, I''ve shared some of my insights and processes for updating dependencies and the AstroPaper template. I genuinely hope this article proves valuable and assists you in managing your projects more efficiently. If you have any alternative or improved approaches for updating dependencies/AstroPaper, I would love to hear from you. Thus, don''t hesitate to start a discussion in the repository, email me, or open an issue. Your input and ideas are highly appreciated! Please understand that my schedule is quite busy these days, and I may not be able to respond quickly. However, I promise to get back to you as soon as possible. 😬 Thank you for taking the time to read this article, and I wish you all the best with your projects!' WHERE slug = 'how-to-update-dependencies';
UPDATE posts SET body_html = '<p>I''ve crafted some predefined color schemes for this AstroPaper blog theme. You can replace these color schemes with the original ones.</p>
<p>If you don''t know how you can configure color schemes, check <a href="https://astro-paper.pages.dev/posts/customizing-astropaper-theme-color-schemes/">this blog post</a>.</p>
<h2 id="table-of-contents-13">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#light-color-schemes">Light color schemes</a>
<ul>
<li><a href="#lobster">Lobster</a></li>
<li><a href="#leaf-blue">Leaf Blue</a></li>
<li><a href="#pinky-light">Pinky light</a></li>
</ul>
</li>
<li><a href="#dark-color-schemes">Dark color schemes</a>
<ul>
<li><a href="#astropaper-1-original-dark-theme">AstroPaper 1 original Dark Theme</a></li>
<li><a href="#deep-oyster">Deep Oyster</a></li>
<li><a href="#pikky-dark">Pikky dark</a></li>
<li><a href="#astro-dark-high-contrast">Astro dark (High Contrast)</a></li>
<li><a href="#astro-dark-new-default-dark-theme-in-astropaper-2">Astro dark (New default dark theme in AstroPaper 2)</a></li>
<li><a href="#astro-deep-purple-new-dark-theme-in-astropaper-3">Astro Deep Purple (New dark theme in AstroPaper 3)</a></li>
<li><a href="#astropaper-v4-special-new-dark-theme-in-astropaper-4">AstroPaper v4 Special (New dark theme in AstroPaper 4)</a></li>
</ul>
</li>
</ul>
<p></p>
<h2 id="light-color-schemes">Light color schemes</h2>
<p>Light color scheme has to be defined using the css selector <code>:root</code> and <code>html[data-theme="light"]</code>.</p>
<h3 id="lobster">Lobster</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/192282447-1d222faf-a3ce-44a9-9cfe-ac873155e5a9.png" alt="lobster-color-scheme"></p>
<pre><code class="language-css">:root,
html[data-theme="light"] {
  --background: #f6eee1;
  --foreground: #012c56;
  --accent: #e14a39;
  --muted: #efd8b0;
  --border: #dc9891;
}
</code></pre>
<h3 id="leaf-blue">Leaf Blue</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/192318782-e80e3c39-54b5-423e-8f4b-9ae60402fc8d.png" alt="leaf-blue-color-scheme"></p>
<pre><code class="language-css">:root,
html[data-theme="light"] {
  --background: #f2f5ec;
  --foreground: #353538;
  --accent: #1158d1;
  --muted: #bbc789;
  --border: #7cadff;
}
</code></pre>
<h3 id="pinky-light">Pinky light</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/192286510-892d0042-2d6d-471e-bb72-954221ae2d17.png" alt="pinky-color-scheme"></p>
<pre><code class="language-css">:root,
html[data-theme="light"] {
  --background: #fafcfc;
  --foreground: #222e36;
  --accent: #d3006a;
  --muted: #f1bad4;
  --border: #e3a9c6;
}
</code></pre>
<h2 id="dark-color-schemes">Dark color schemes</h2>
<p>Dark color scheme has to be defined as <code>html[data-theme="dark"]</code>.</p>
<h3 id="astro-paper-1-original-dark-theme">AstroPaper 1 original Dark Theme</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/215769153-13b0ad8d-5ba2-44b1-af06-e5ae61293f62.png" alt="AstroPaper 1 default dark theme"></p>
<pre><code class="language-css">html[data-theme="dark"] {
  --background: #2f3741;
  --foreground: #e6e6e6;
  --accent: #1ad9d9;
  --muted: #596b81;
  --border: #3b4655;
}
</code></pre>
<h3 id="deep-oyster">Deep Oyster</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/192314524-45ec5904-3d8f-450a-9edf-1e32c5e11d6c.png" alt="deep-oyster-color-scheme"></p>
<pre><code class="language-css">html[data-theme="dark"] {
  --background: #21233d;
  --foreground: #f4f7f5;
  --accent: #ff5256;
  --muted: #4a4e86;
  --border: #b12f32;
}
</code></pre>
<h3 id="pikky-dark">Pikky dark</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/192307050-fbd55326-911c-4001-87c6-a8ad9378ac2e.png" alt="pinky-dark-color-scheme"></p>
<pre><code class="language-css">html[data-theme="dark"] {
  --background: #353640;
  --foreground: #e9edf1;
  --accent: #ff78c8;
  --muted: #715566;
  --border: #86436b;
}
</code></pre>
<h3 id="astro-dark-high-contrast">Astro dark (High Contrast)</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/215680520-59427bb0-f4cb-48c0-bccc-f182a428d72d.svg" alt="astro-dark-color-scheme"></p>
<pre><code class="language-css">html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #8a3302;
  --border: #ab4b08;
}
</code></pre>
<h3 id="astro-dark-new-default-dark-theme-in-astro-paper-2">Astro dark (New default dark theme in AstroPaper 2)</h3>
<p><img src="https://user-images.githubusercontent.com/53733092/215772856-d5b7ae35-ddaa-4ed6-b0bf-3fa5dbcf834c.png" alt="new dark color scheme - low contrast"></p>
<pre><code class="language-css">html[data-theme="dark"] {
  --background: #212737; /* lower contrast background */
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #8a3302;
  --border: #ab4b08;
}
</code></pre>
<h3 id="astro-deep-purple-new-dark-theme-in-astro-paper-3">Astro Deep Purple (New dark theme in AstroPaper 3)</h3>
<p><img src="https://github.com/satnaing/astro-paper/assets/53733092/c8b5d7e1-a3bc-4852-a5ad-4abf7b3cec79" alt="AstroPaper v3 new theme"></p>
<pre><code class="language-css">html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #eb3fd3;
  --muted: #7d4f7c;
  --border: #642451;
}
</code></pre>
<h3 id="astro-paper-v-4-special-new-dark-theme-in-astro-paper-4">AstroPaper v4 Special (New dark theme in AstroPaper 4)</h3>
<p><img src="https://github.com/satnaing/astro-paper/assets/53733092/66eb74dc-7a0e-4f2e-982d-25f5c443b25a" alt="AstroPaper v4 new theme"></p>
<pre><code class="language-css">html[data-theme="dark"] {
  --background: #000123;
  --accent: #617bff;
  --foreground: #eaedf3;
  --muted: #0c0e4f;
  --border: #303f8a;
}
</code></pre>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"light-color-schemes","text":"Light color schemes"},{"depth":3,"slug":"lobster","text":"Lobster"},{"depth":3,"slug":"leaf-blue","text":"Leaf Blue"},{"depth":3,"slug":"pinky-light","text":"Pinky light"},{"depth":2,"slug":"dark-color-schemes","text":"Dark color schemes"},{"depth":3,"slug":"astro-paper-1-original-dark-theme","text":"AstroPaper 1 original Dark Theme"},{"depth":3,"slug":"deep-oyster","text":"Deep Oyster"},{"depth":3,"slug":"pikky-dark","text":"Pikky dark"},{"depth":3,"slug":"astro-dark-high-contrast","text":"Astro dark (High Contrast)"},{"depth":3,"slug":"astro-dark-new-default-dark-theme-in-astro-paper-2","text":"Astro dark (New default dark theme in AstroPaper 2)"},{"depth":3,"slug":"astro-deep-purple-new-dark-theme-in-astro-paper-3","text":"Astro Deep Purple (New dark theme in AstroPaper 3)"},{"depth":3,"slug":"astro-paper-v-4-special-new-dark-theme-in-astro-paper-4","text":"AstroPaper v4 Special (New dark theme in AstroPaper 4)"}]', search_text = 'I''ve crafted some predefined color schemes for this AstroPaper blog theme. You can replace these color schemes with the original ones. If you don''t know how you can configure color schemes, check this blog post. Table of contents Light color schemes Light color scheme has to be defined using the css selector :root and html[data theme="light"]. Lobster lobster color scheme Leaf Blue leaf blue color scheme Pinky light pinky color scheme Dark color schemes Dark color scheme has to be defined as html[data theme="dark"]. AstroPaper 1 original Dark Theme AstroPaper 1 default dark theme Deep Oyster deep oyster color scheme Pikky dark pinky dark color scheme Astro dark (High Contrast) astro dark color scheme Astro dark (New default dark theme in AstroPaper 2) new dark color scheme low contrast Astro Deep Purple (New dark theme in AstroPaper 3) AstroPaper v3 new theme AstroPaper v4 Special (New dark theme in AstroPaper 4) AstroPaper v4 new theme' WHERE slug = 'predefined-color-schemes';
UPDATE posts SET body_html = '<p>In this post I will explain how to use the pre-commit Git hook to automate the input of the created (<code>pubDatetime</code>) and modified (<code>modDatetime</code>) in the AstroPaper blog theme frontmatter</p>
<h2 id="table-of-contents-14">Table of contents</h2>
<p>Open Table of contents</p>
<ul>
<li><a href="#have-them-everywhere">Have them Everywhere</a></li>
<li><a href="#the-hook">The Hook</a>
<ul>
<li><a href="#updating-the-modified-date-when-a-file-is-edited">Updating the modified date when a file is edited</a>
<ul>
<li><a href="#improvement---more-explicit">Improvement - More Explicit</a></li>
<li><a href="#note">NOTE</a></li>
</ul>
</li>
<li><a href="#adding-the-date-for-new-files">Adding the Date for new files</a>
<ul>
<li><a href="#improvement---only-loop-once">Improvement - Only Loop Once</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#populating-the-frontmatter">Populating the frontmatter</a></li>
<li><a href="#empty-moddatetime-changes">Empty <code>modDatetime</code> changes</a></li>
</ul>
<p></p>
<h2 id="have-them-everywhere">Have them Everywhere</h2>
<p><a href="https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks">Git hooks</a> are great for automating tasks like <a href="https://gist.github.com/SSmale/3b380e5bbed3233159fb7031451726ea">adding</a> or <a href="https://itnext.io/using-git-hooks-to-enforce-branch-naming-policy-ffd81fa01e5e">checking</a> the branch name to your commit messages or <a href="https://gist.github.com/SSmale/367deee757a9b2e119d241e120249000">stopping you committing plain text secrets</a>. Their biggest flaw is that client-side hooks are per machine.</p>
<p>You can get around this by having a <code>hooks</code> directory and manually copy them to the <code>.git/hooks</code> directory or set up a symlink, but this all requires you to remember to set it up, and that is not something I am good at doing.</p>
<p>As this project uses npm, we are able to make use of a package called <a href="https://typicode.github.io/husky/">Husky</a> (this is already installed in AstroPaper) to automatically install the hooks for us.</p>
<blockquote>
<p>Update! In AstroPaper <a href="https://github.com/satnaing/astro-paper/releases/tag/v4.3.0">v4.3.0</a>, the pre-commit hook has been removed in favor of GitHub Actions. However, you can easily <a href="https://typicode.github.io/husky/get-started.html">install Husky</a> yourself.</p>
</blockquote>
<h2 id="the-hook">The Hook</h2>
<p>As we want this hook to run as we commit the code to update the dates and then have that as part of our change we are going to use the <code>pre-commit</code> hook. This has already been set up by this AstroPaper project, but if it hadn''t, you would run <code>npx husky add .husky/pre-commit ''echo "This is our new pre-commit hook"''</code>.</p>
<p>Navigating to the <code>hooks/pre-commit</code> file, we are going to add one or both of the following snippets.</p>
<h3 id="updating-the-modified-date-when-a-file-is-edited">Updating the modified date when a file is edited</h3>
<hr>
<p>UPDATE:</p>
<p>This section has been updated with a new version of the hook that is smarter. It will now not increment the <code>modDatetime</code> until the post is published. On the first publish, set the draft status to <code>first</code> and watch the magic happen.</p>
<hr>
<pre><code class="language-shell"># Modified files, update the modDatetime
git diff --cached --name-status |
grep -i ''^M.*\.md$'' |
while read _ file; do
  filecontent=$(cat "$file")
  frontmatter=$(echo "$filecontent" | awk -v RS=''---'' ''NR==2{print}'')
  draft=$(echo "$frontmatter" | awk ''/^draft: /{print $2}'')
  if [ "$draft" = "false" ]; then
    echo "$file modDateTime updated"
    cat $file | sed "/---.*/,/---.*/s/^modDatetime:.*$/modDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/" > tmp
    mv tmp $file
    git add $file
  fi
  if [ "$draft" = "first" ]; then
    echo "First release of $file, draft set to false and modDateTime removed"
    cat $file | sed "/---.*/,/---.*/s/^modDatetime:.*$/modDatetime:/" | sed "/---.*/,/---.*/s/^draft:.*$/draft: false/" > tmp
    mv tmp $file
    git add $file
  fi
done
</code></pre>
<p><code>git diff --cached --name-status</code> gets the files from git that have been staged for committing. The output looks like:</p>
<pre><code class="language-shell">A       src/content/blog/setting-dates-via-git-hooks.md
</code></pre>
<p>The letter at the start denotes what action has been taken, in the above example the file has been added. Modified files have <code>M</code></p>
<p>We pipe that output into the grep command where we are looking at each line to find that have been modified. The line needs to start with <code>M</code> (<code>^(M)</code>), have any number of characters after that (<code>.*</code>) and end with the <code>.md</code> file extension (<code>.(md)$</code>).This is going to filter out the lines that are not modified markdown files <code>egrep -i "^(M).*\.(md)$"</code>.</p>
<hr>
<h4 id="improvement-more-explicit">Improvement - More Explicit</h4>
<p>This could be added to only look for files that we markdown files in the <code>blog</code> directory, as these are the only ones that will have the right frontmatter</p>
<hr>
<p>The regex will capture the two parts, the letter and the file path. We are going to pipe this list into a while loop to iterate over the matching lines and assign the letter to <code>a</code> and the path to <code>b</code>. We are going to ignore <code>a</code> for now.</p>
<p>To know the draft status of the file, we need its frontmatter. In the following code we are using <code>cat</code> to get the content of the file, then using <code>awk</code> to split the file on the frontmatter separator (<code>---</code>) and taking the second block (the fonmtmatter, the bit between the <code>---</code>). From here we are using <code>awk</code> again to find the draft key and print is value.</p>
<pre><code class="language-shell">  filecontent=$(cat "$file")
  frontmatter=$(echo "$filecontent" | awk -v RS=''---'' ''NR==2{print}'')
  draft=$(echo "$frontmatter" | awk ''/^draft: /{print $2}'')
</code></pre>
<p>Now we have the value for <code>draft</code> we are going to do 1 of 3 things, set the modDatetime to now (when draft is false <code>if [ "$draft" = "false" ]; then</code>), clear the modDatetime and set draft to false (when draft is set to first <code>if [ "$draft" = "first" ]; then</code>), or nothing (in any other case).</p>
<p>The next part with the sed command is a bit magical to me as I don''t often use it, it was copied from <a href="https://mademistakes.com/notes/adding-last-modified-timestamps-with-git/">another blog post on doing something similar</a>. In essence, it is looking inside the frontmatter tags (<code>---</code>) of the file to find the <code>pubDatetime:</code> key, getting the full line and replacing it with the <code>pubDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/"</code> same key again and the current datetime formatted correctly.</p>
<p>This replacement is in the context of the whole file so we put that into a temporary file (<code>> tmp</code>), then we move (<code>mv</code>) the new file into the location of the old file, overwriting it. This is then added to git ready to be committed as if we made the change ourselves.</p>
<hr>
<h4 id="note">NOTE</h4>
<p>For the <code>sed</code> to work the frontmatter needs to already have the <code>modDatetime</code> key in the frontmatter. There are some other changes you will need to make for the app to build with a blank date, see <a href="#empty-moddatetime-changes">further down</a></p>
<hr>
<h3 id="adding-the-date-for-new-files">Adding the Date for new files</h3>
<p>Adding the date for a new file is the same process as above, but this time we are looking for lines that have been added (<code>A</code>) and we are going to replace the <code>pubDatetime</code> value.</p>
<pre><code class="language-shell"># New files, add/update the pubDatetime
git diff --cached --name-status | egrep -i "^(A).*\.(md)$" | while read a b; do
  cat $b | sed "/---.*/,/---.*/s/^pubDatetime:.*$/pubDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/" > tmp
  mv tmp $b
  git add $b
done
</code></pre>
<hr>
<h4 id="improvement-only-loop-once">Improvement - Only Loop Once</h4>
<p>We could use the <code>a</code> variable to switch inside the loop and either update the <code>modDatetime</code> or add the <code>pubDatetime</code> in one loop.</p>
<hr>
<h2 id="populating-the-frontmatter">Populating the frontmatter</h2>
<p>If your IDE supports snippets then there is the option to create a custom snippet to populate the frontmatter.<a href="https://github.com/satnaing/astro-paper/pull/206">In AstroPaper v4 will come with one for VSCode by default.</a></p>
<h2 id="empty-mod-datetime-changes">Empty <code>modDatetime</code> changes</h2>
<p>To allow Astro to compile the markdown and do its thing, it needs to know what is expected in the frontmatter. It does this via the config in <code>src/content/config.ts</code></p>
<p>To allow the key to be there with no value we need to edit line 10 to add the <code>.nullable()</code> function.</p>
<pre><code class="language-ts">const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional(), // [!code --]
      modDatetime: z.date().optional().nullable(), // [!code ++]
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      readingTime: z.string().optional(),
    }),
});
</code></pre>
<p>To stop the IDE complaining in the blog engine files I have also done the following:</p>
<ol>
<li>
<p>added <code>| null</code> to line 15 in <code>src/layouts/Layout.astro</code> so that it looks like</p>
<pre><code class="language-typescript">export interface Props {
  title?: string;
  author?: string;
  description?: string;
  ogImage?: string;
  canonicalURL?: string;
  pubDatetime?: Date;
  modDatetime?: Date | null;
}
</code></pre>
</li>
<li>
<p>added <code>| null</code> to line 5 in <code>src/components/Datetime.tsx</code> so that it looks like</p>
<pre><code class="language-typescript">interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime: string | Date | undefined | null;
}
</code></pre>
</li>
</ol>', headings = '[{"depth":2,"slug":"table-of-contents","text":"Table of contents"},{"depth":2,"slug":"have-them-everywhere","text":"Have them Everywhere"},{"depth":2,"slug":"the-hook","text":"The Hook"},{"depth":3,"slug":"updating-the-modified-date-when-a-file-is-edited","text":"Updating the modified date when a file is edited"},{"depth":4,"slug":"improvement-more-explicit","text":"Improvement - More Explicit"},{"depth":4,"slug":"note","text":"NOTE"},{"depth":3,"slug":"adding-the-date-for-new-files","text":"Adding the Date for new files"},{"depth":4,"slug":"improvement-only-loop-once","text":"Improvement - Only Loop Once"},{"depth":2,"slug":"populating-the-frontmatter","text":"Populating the frontmatter"},{"depth":2,"slug":"empty-mod-datetime-changes","text":"Empty modDatetime changes"}]', search_text = 'In this post I will explain how to use the pre commit Git hook to automate the input of the created (pubDatetime) and modified (modDatetime) in the AstroPaper blog theme frontmatter Table of contents Have them Everywhere Git hooks are great for automating tasks like adding or checking the branch name to your commit messages or stopping you committing plain text secrets. Their biggest flaw is that client side hooks are per machine. You can get around this by having a hooks directory and manually copy them to the .git/hooks directory or set up a symlink, but this all requires you to remember to set it up, and that is not something I am good at doing. As this project uses npm, we are able to make use of a package called Husky (this is already installed in AstroPaper) to automatically install the hooks for us. Update! In AstroPaper v4.3.0, the pre commit hook has been removed in favor of GitHub Actions. However, you can easily install Husky yourself. The Hook As we want this hook to run as we commit the code to update the dates and then have that as part of our change we are going to use the pre commit hook. This has already been set up by this AstroPaper project, but if it hadn''t, you would run npx husky add .husky/pre commit ''echo "This is our new pre commit hook"''. Navigating to the hooks/pre commit file, we are going to add one or both of the following snippets. Updating the modified date when a file is edited UPDATE: This section has been updated with a new version of the hook that is smarter. It will now not increment the modDatetime until the post is published. On the first publish, set the draft status to first and watch the magic happen. git diff cached name status gets the files from git that have been staged for committing. The output looks like: The letter at the start denotes what action has been taken, in the above example the file has been added. Modified files have M We pipe that output into the grep command where we are looking at each line to find that have been modified. The line needs to start with M (^(M)), have any number of characters after that (. ) and end with the .md file extension (.(md)$).This is going to filter out the lines that are not modified markdown files egrep i "^(M). \.(md)$". Improvement More Explicit This could be added to only look for files that we markdown files in the blog directory, as these are the only ones that will have the right frontmatter The regex will capture the two parts, the letter and the file path. We are going to pipe this list into a while loop to iterate over the matching lines and assign the letter to a and the path to b. We are going to ignore a for now. To know the draft status of the file, we need its frontmatter. In the following code we are using cat to get the content of the file, then using awk to split the file on the frontmatter separator ( ) and taking the second block (the fonmtmatter, the bit between the ). From here we are using awk again to find the draft key and print is value. Now we have the value for draft we are going to do 1 of 3 things, set the modDatetime to now (when draft is false if [ "$draft" = "false" ]; then), clear the modDatetime and set draft to false (when draft is set to first if [ "$draft" = "first" ]; then), or nothing (in any other case). The next part with the sed command is a bit magical to me as I don''t often use it, it was copied from another blog post on doing something similar. In essence, it is looking inside the frontmatter tags ( ) of the file to find the pubDatetime: key, getting the full line and replacing it with the pubDatetime: $(date u "+%Y %m %dT%H:%M:%SZ")/" same key again and the current datetime formatted correctly. This replacement is in the context of the whole file so we put that into a temporary file ( tmp), then we move (mv) the new file into the location of the old file, overwriting it. This is then added to git ready to be committed as if we made the change ourselves. NOTE For the sed to work the frontmatter needs to already have the modDatetime key in the frontmatter. There are some other changes you will need to make for the app to build with a blank date, see further down Adding the Date for new files Adding the date for a new file is the same process as above, but this time we are looking for lines that have been added (A) and we are going to replace the pubDatetime value. Improvement Only Loop Once We could use the a variable to switch inside the loop and either update the modDatetime or add the pubDatetime in one loop. Populating the frontmatter If your IDE supports snippets then there is the option to create a custom snippet to populate the frontmatter.In AstroPaper v4 will come with one for VSCode by default. <video autoplay muted="muted" controls plays inline="true" class="border border skin line" <source src="https://github.com/satnaing/astro paper/assets/17761689/e13babbc 2d78 405d 8758 ca31915e41b0" type="video/mp4" </video Empty modDatetime changes To allow Astro to compile the markdown and do its thing, it needs to know what is expected in the frontmatter. It does this via the config in src/content/config.ts To allow the key to be there with no value we need to edit line 10 to add the .nullable() function. To stop the IDE complaining in the blog engine files I have also done the following: 1. added | null to line 15 in src/layouts/Layout.astro so that it looks like 2. added | null to line 5 in src/components/Datetime.tsx so that it looks like' WHERE slug = 'setting-dates-via-git-hooks';
