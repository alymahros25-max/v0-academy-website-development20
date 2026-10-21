import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const read = (file) => readFile(file, "utf8")

test("official migration policy documents the isolated production baseline", async () => {
  const readme = await read("supabase/README.md")
  const rlsMigration = await read("supabase/migrations/052_harden_rls_and_public_reads.sql")
  const searchPathMigration = await read("supabase/migrations/053_harden_function_search_paths.sql")

  assert.match(readme, /quran123/)
  assert.match(readme, /isolated_0001_clean_baseline/)
  assert.match(readme, /لا تُشغّل `supabase db push`/)
  assert.match(rlsMigration, /harden the isolated database boundary/i)
  assert.match(searchPathMigration, /SET search_path = pg_catalog, public/g)
})
