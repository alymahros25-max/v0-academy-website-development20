import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const migration = await readFile("supabase/migrations/052_harden_rls_and_public_reads.sql", "utf8")
const videoRoute = await readFile("app/api/classroom-videos/route.ts", "utf8")
const blogPage = await readFile("app/blog/[slug]/page.tsx", "utf8")
const blogRoute = await readFile("app/api/blog/route.ts", "utf8")
const videoClient = await readFile("lib/classroom-videos-client.ts", "utf8")
const videoServer = await readFile("lib/classroom-videos.ts", "utf8")
const healthRoute = await readFile("app/api/health/route.ts", "utf8")

test("public RLS migration limits reads to published or active records", () => {
  assert.match(migration, /REVOKE EXECUTE ON FUNCTION public\.rls_auto_enable\(\) FROM PUBLIC, anon, authenticated/)
  assert.match(migration, /public_read_published_blog_posts[\s\S]*USING \(is_published = true\)/)
  assert.match(migration, /public_read_published_classroom_videos[\s\S]*USING \(is_published = true\)/)
  assert.match(migration, /public_read_active_site_areas[\s\S]*USING \(is_active = true\)/)
})

test("browser content readers use server routes instead of Supabase anon", () => {
  assert.doesNotMatch(videoClient, /createClient|NEXT_PUBLIC_SUPABASE_ANON_KEY/)
  assert.match(videoClient, /fetch\(['"]\/api\/classroom-videos['"]\s*,/)
  assert.doesNotMatch(blogPage, /createClient|NEXT_PUBLIC_SUPABASE_ANON_KEY/)
  assert.match(blogPage, /supabaseAdmin/)
  assert.doesNotMatch(blogRoute, /NEXT_PUBLIC_SUPABASE_ANON_KEY|createClient\(/)
  assert.match(blogRoute, /supabaseAdmin/)
  assert.doesNotMatch(videoServer, /NEXT_PUBLIC_SUPABASE_ANON_KEY|createClient\(/)
  assert.match(videoServer, /supabaseAdmin/)
  assert.match(videoRoute, /supabaseAdmin\.from\(["']classroom_videos["']\)/)
})

test("health endpoint does not expose database errors or credentials", () => {
  assert.match(healthRoute, /Cache-Control.*no-store/)
  assert.match(healthRoute, /status: healthy \? "ok" : "degraded"/)
  assert.doesNotMatch(healthRoute, /SUPABASE_SERVICE_ROLE_KEY|error\.message|error\.details/)
})
