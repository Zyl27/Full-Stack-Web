import { createSupabaseServerClient } from "../create-supabase-server.js";

export function supabaseMiddleware(req, res, next) {
  req.supabase = createSupabaseServerClient(req, res);
  next();
}
