import { createSupabaseServerClient } from "../create-supabase-server.js";

export async function requireAuth(req, res, next) {
  const serverSupabase = createSupabaseServerClient(req, res);

  const {
    data: { user },
    error,
  } = await serverSupabase.auth.getUser();

  if (error || !user) {
    return res.redirect("/login");
  }

  req.user = user;

  next();
}
