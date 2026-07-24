import { createSupabaseServerClient } from "../create-supabase-server.js";

export async function requireAuth(req, res, next) {
  const supabase = createSupabaseServerClient(req, res);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return res.redirect("/login");
  }

  req.user = user;

  next();
}
