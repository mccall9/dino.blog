import { supabase } from "./supabase-client.js";
let currentUser = null;
const mapAuthor = (p) => ({
  id: p.id,
  name: p.display_name || p.username,
  avatar: p.avatar_url || "assets/dino-logo.png",
});
const mapPost = (p, saved) => ({
  id: p.id,
  author: mapAuthor(p.author),
  category: p.category,
  title: p.title,
  description: p.description,
  link: p.link_url || "",
  createdAt: p.created_at,
  pinned: p.pinned,
  savedBy: saved.has(p.id) ? [currentUser.id] : [],
  comments: (p.comments || [])
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((c) => ({
      id: c.id,
      author: mapAuthor(c.author),
      text: c.content,
      createdAt: c.created_at,
    })),
});
async function session() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Faça login para acessar as conversas.");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (profileError) throw profileError;
  currentUser = mapAuthor(profile);
  return currentUser;
}
async function list() {
  if (!currentUser) await session();
  const [{ data, error }, { data: saves, error: saveError }] =
    await Promise.all([
      supabase
        .from("posts")
        .select(
          "id,category,title,description,link_url,pinned,created_at,author:profiles!posts_author_id_fkey(id,username,display_name,avatar_url),comments(id,content,created_at,author:profiles!comments_author_id_fkey(id,username,display_name,avatar_url))",
        )
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", currentUser.id),
    ]);
  if (error) throw error;
  if (saveError) throw saveError;
  const saved = new Set((saves || []).map((x) => x.post_id));
  return (data || []).map((p) => mapPost(p, saved));
}
async function refresh(action) {
  const { error } = await action;
  if (error) throw error;
  return list();
}
export const service = {
  get currentUser() {
    return currentUser;
  },
  init: session,
  list,
  async create(data) {
    return refresh(
      supabase
        .from("posts")
        .insert({
          author_id: currentUser.id,
          category: data.category,
          title: data.title,
          description: data.description,
          link_url: data.link || null,
        }),
    );
  },
  async update(id, data) {
    return refresh(
      supabase
        .from("posts")
        .update({
          category: data.category,
          title: data.title,
          description: data.description,
          link_url: data.link || null,
        })
        .eq("id", id)
        .eq("author_id", currentUser.id),
    );
  },
  async remove(id) {
    return refresh(
      supabase
        .from("posts")
        .delete()
        .eq("id", id)
        .eq("author_id", currentUser.id),
    );
  },
  async toggleSaved(id, isSaved) {
    const query = isSaved
      ? supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("post_id", id)
      : supabase
          .from("saved_posts")
          .insert({ user_id: currentUser.id, post_id: id });
    return refresh(query);
  },
  async comment(id, text) {
    return refresh(
      supabase
        .from("comments")
        .insert({ post_id: id, author_id: currentUser.id, content: text }),
    );
  },
  async removeComment(postId, commentId) {
    return refresh(
      supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("post_id", postId)
        .eq("author_id", currentUser.id),
    );
  },
};
