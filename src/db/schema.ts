import { sqliteTable, text, integer, uniqueIndex, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  body: text("body").notNull().default(""),
  author: text("author").notNull().default(""),
  pubDatetime: text("pub_datetime").notNull(),
  modDatetime: text("mod_datetime"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  draft: integer("draft", { mode: "boolean" }).notNull().default(false),
  ogImage: text("og_image"),
  coverImage: text("cover_image"),
  canonicalUrl: text("canonical_url"),
  hideEditPost: integer("hide_edit_post", { mode: "boolean" }).notNull().default(false),
  timezone: text("timezone"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => [
  uniqueIndex("idx_posts_slug").on(table.slug),
  index("idx_posts_draft").on(table.draft),
  index("idx_posts_pub_datetime").on(table.pubDatetime),
]);

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const postsTags = sqliteTable("posts_tags", {
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

export const postsRelations = relations(posts, ({ many }) => ({
  postsTags: many(postsTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postsTags: many(postsTags),
}));

export const postsTagsRelations = relations(postsTags, ({ one }) => ({
  post: one(posts, {
    fields: [postsTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postsTags.tagId],
    references: [tags.id],
  }),
}));
