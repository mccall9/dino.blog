import { supabase } from "./supabase-client.js";
const mapProfile = (p) =>
  p
    ? {
        id: p.id,
        username: p.username,
        name: p.display_name,
        bio: p.bio || "",
        site: p.site_url || "",
        avatar: p.avatar_url || "assets/dino-logo.png",
        createdAt: p.created_at,
      }
    : null;
export const auth = {
  async sendEmailCode(email, redirectPath = "/feed") {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${location.origin}${redirectPath}`,
      },
    });
    if (error) throw error;
    return data;
  },
  async verifyEmailCode(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) throw error;
    return data;
  },
  async current() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },
  async profile() {
    const user = await this.current();
    if (!user) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (error) throw error;
    return mapProfile(data);
  },
  async update(data) {
    const user = await this.current();
    if (!user) throw new Error("Sessão encerrada.");
    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        display_name: data.name,
        bio: data.bio || "",
        site_url: data.site || null,
      })
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;
    return mapProfile(profile);
  },
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  onChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
