import { auth } from "./auth-service.js";
import { supabase } from "./supabase-client.js";

function friendlyError(error) {
  if (error?.code === "42P01" || error?.code === "PGRST205") {
    return new Error(
      "A lista de interesse ainda não foi ativada no banco de dados.",
    );
  }
  return error;
}

export const communityService = {
  currentUser() {
    return auth.current();
  },

  async requestCommunity({ name, purpose, topic }) {
    const user = await auth.current();
    if (!user) throw new Error("LOGIN_REQUIRED");

    const { data, error } = await supabase
      .from("community_interests")
      .insert({
        user_id: user.id,
        community_name: name,
        purpose,
        topics: [topic],
      })
      .select("id, community_name, created_at")
      .single();

    if (error?.code === "23505") {
      throw new Error("Você já registrou interesse nessa comunidade.");
    }
    if (error) throw friendlyError(error);
    return data;
  },

  async isMember(slug) {
    const user = await auth.current();
    if (!user) return false;

    const { data, error } = await supabase
      .from("community_memberships")
      .select("community_slug")
      .eq("community_slug", slug)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw friendlyError(error);
    return Boolean(data);
  },

  async join(slug) {
    const user = await auth.current();
    if (!user) throw new Error("LOGIN_REQUIRED");

    const { error } = await supabase.from("community_memberships").upsert(
      { community_slug: slug, user_id: user.id },
      { onConflict: "community_slug,user_id", ignoreDuplicates: true },
    );
    if (error) throw friendlyError(error);
  },

  async memberCount(slug) {
    const { data, error } = await supabase.rpc("community_member_count", {
      requested_slug: slug,
    });
    if (error) return null;
    return Number(data || 0);
  },
};
