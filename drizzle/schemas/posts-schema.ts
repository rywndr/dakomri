import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * Schema untuk posts/kegiatan
 * Hanya admin yang bisa membuat, edit, dan delete posts
 */
export const posts = pgTable("posts", {
    id: text("id").primaryKey(),

    // Judul post
    title: text("title").notNull(),

    // Konten dalam format markdown
    content: text("content").notNull(),

    // Slug untuk URL (generated dari title)
    slug: text("slug").notNull().unique(),

    // Status publikasi
    published: text("published").default("draft").notNull(), // "draft" | "published"

    // Metadata
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),

    // Admin yang membuat post
    createdBy: text("created_by")
        .references(() => user.id, { onDelete: "set null" })
        .notNull(),

    // Admin yang terakhir mengupdate
    updatedBy: text("updated_by").references(() => user.id, {
        onDelete: "set null",
    }),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
