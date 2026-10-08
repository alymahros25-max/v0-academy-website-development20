import assert from "node:assert/strict"
import { randomBytes, scryptSync } from "node:crypto"
import { spawn } from "node:child_process"
import { createServer } from "node:http"
import { setTimeout as sleep } from "node:timers/promises"
import { test } from "node:test"

// This test deliberately uses only an in-memory PostgREST-compatible server on
// loopback. It never reads .env files and overrides all Supabase URLs in the
// spawned Next.js process with this local mock.
const rows = {
  site_areas: [
    { id: 1, slug: "global", area_type: "global", country_code: null, name_ar: "موقع اختبار", name_en: "Mock site", currency_code: "USD", currency_symbol: "$", is_active: true },
    { id: 11, slug: "colombia", area_type: "country", country_code: "CO", name_ar: "اختبار كولومبيا", name_en: "Mock Colombia", currency_code: "COP", currency_symbol: "COP", is_active: true },
    { id: 22, slug: "austria", area_type: "country", country_code: "AT", name_ar: "اختبار النمسا", name_en: "Mock Austria", currency_code: "EUR", currency_symbol: "€", is_active: true },
    { id: 33, slug: "australia", area_type: "country", country_code: "AU", name_ar: "اختبار أستراليا", name_en: "Mock Australia", currency_code: "AUD", currency_symbol: "A$", is_active: true },
  ],
  site_content: [
    { key: "hero_title", content_ar: "عنوان الصفحة الرئيسية التجريبي", content_en: "Mock home heading", content_fr: "Titre de test", is_active: true },
  ],
  area_content: [],
  area_packages: [
    { id: 101, area_id: 11, program: "quran", package_key: "quran-30-4", name_ar: "باقة كولومبيا التجريبية", price: 101, currency_code: "COP", billing_period: "month", sessions_per_month: 4, features_ar: [], is_popular: false, is_active: true, sort_order: 10 },
    { id: 201, area_id: 22, program: "quran", package_key: "quran-30-4", name_ar: "باقة النمسا التجريبية", price: 202, currency_code: "EUR", billing_period: "month", sessions_per_month: 4, features_ar: [], is_popular: false, is_active: true, sort_order: 10 },
    { id: 301, area_id: 33, program: "quran", package_key: "quran-30-4", name_ar: "باقة أستراليا التجريبية", price: 303, currency_code: "AUD", billing_period: "month", sessions_per_month: 4, features_ar: [], is_popular: false, is_active: true, sort_order: 10 },
  ],
  area_faq_items: [
    { id: 221, area_id: 22, question_key: "mock-faq", question_ar: "سؤال النمسا قبل التعديل", question_en: "Austria test FAQ", answer_ar: "إجابة نمساوية اصطناعية", answer_en: "Synthetic answer", is_active: true, sort_order: 10 },
    { id: 331, area_id: 33, question_key: "mock-faq", question_ar: "سؤال أستراليا الأصلي", question_en: "Australia test FAQ", answer_ar: "إجابة أسترالية اصطناعية", answer_en: "Synthetic Australia answer", is_active: true, sort_order: 10 },
  ],
  area_links: [
    { id: 222, area_id: 22, link_key: "mock-contact", label_ar: "تواصل اختباري", label_en: "Mock contact", href: "https://example.test/austria", link_type: "external", is_external: true, is_active: true, sort_order: 10 },
    { id: 332, area_id: 33, link_key: "mock-contact", label_ar: "تواصل اختباري", label_en: "Mock contact", href: "https://example.test/australia", link_type: "external", is_external: true, is_active: true, sort_order: 10 },
  ],
  area_themes: [
    { id: 223, area_id: 22, theme_name_ar: "ثيم نمساوي تجريبي", theme_name_en: "Mock Austria", primary_color: "#123456", secondary_color: "#234567", accent_color: "#345678", background_color: "#F7F7F7", text_color: "#111111", quran_fact_title_ar: "معلومة اختبار", quran_fact_body_ar: "نص تجريبي", quran_fact_reference_ar: "مرجع تجريبي", is_active: true, sort_order: 10 },
  ],
  area_cities: [
    { id: 224, area_id: 22, city_key: "mock-city", name_ar: "مدينة اختبار", name_en: "Mock City", region_name: "Mock Region", is_active: true, sort_order: 10 },
  ],
  area_timezones: [
    { id: 225, area_id: 22, timezone_name: "Europe/Vienna", label_ar: "توقيت اختبار", label_en: "Mock time", is_primary: true, is_active: true, sort_order: 10 },
  ],
  landing_page_configs: [
    { slug: "saudi-arabia", config_json: { seo: { title: "السعودية — نسخة الاختبار", description: "وصف الاختبار", canonical: "https://quran-elhafez.com/saudi-arabia" }, heroTitle: "عنوان السعودية قبل الاختبار", heroDescription: "وصف سعودي تجريبي", closingTitle: "دعوة سعودية", closingDescription: "نص سعودي" } },
    { slug: "uae", config_json: { seo: { title: "الإمارات — نسخة الاختبار", description: "وصف الاختبار", canonical: "https://quran-elhafez.com/united-arab-emirates" }, heroTitle: "عنوان الإمارات الأصلي", heroDescription: "وصف إماراتي تجريبي", closingTitle: "دعوة إماراتية", closingDescription: "نص إماراتي" } },
  ],
  legal_pages: [],
}

let nextId = 1000

function json(response, status, data, headers = {}) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", ...headers })
  response.end(JSON.stringify(data))
}

function matches(row, params) {
  for (const [column, expression] of params.entries()) {
    if (["select", "order", "limit", "offset", "on_conflict"].includes(column)) continue
    if (expression.startsWith("eq.")) {
      const expected = expression.slice(3)
      if (String(row[column]) !== expected) return false
      continue
    }
    if (expression.startsWith("in.(") && expression.endsWith(")")) {
      const allowed = expression.slice(4, -1).split(",").map((value) => value.replace(/^"|"$/g, ""))
      if (!allowed.includes(String(row[column]))) return false
    }
  }
  return true
}

function selectProjection(record, selection) {
  if (!selection || selection === "*") return { ...record }
  const columns = selection.split(",").map((column) => column.trim()).filter((column) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(column))
  if (columns.length === 0) return { ...record }
  return Object.fromEntries(columns.filter((column) => column in record).map((column) => [column, record[column]]))
}

function makePostgrestServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1")
      const rpcMatch = url.pathname.match(/^\/rest\/v1\/rpc\/([a-z_]+)$/)
      if (rpcMatch && request.method === "POST") {
        const payload = await readJSON(request)
        if (rpcMatch[1] === "replace_admin_content_atomic") {
          const contentType = payload.p_content_type
          if (!Array.isArray(payload.payload)) return json(response, 400, { message: "Payload must be an array" })
          rows.admin_content = (rows.admin_content ?? []).filter((row) => row.content_type !== contentType)
          rows.admin_content.push(...payload.payload.map((entry) => ({ content_type: contentType, ...entry, updated_at: new Date().toISOString() })))
          return json(response, 200, null)
        }
        if (rpcMatch[1] === "replace_packages_atomic") {
          if (!Array.isArray(payload.payload)) return json(response, 400, { message: "Payload must be an array" })
          rows.packages = payload.payload.map((item) => ({ ...item, updated_at: new Date().toISOString() }))
          return json(response, 200, rows.packages)
        }
        return json(response, 404, { message: "Mock RPC not found" })
      }
      const match = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/)
      if (!match) return json(response, 404, { message: "Mock table not found" })
      const table = match[1]
      rows[table] ??= []
      let tableRows = rows[table]
      const params = url.searchParams
      const singular = request.headers.accept?.includes("application/vnd.pgrst.object+json") ?? false

      if (request.method === "GET") {
        let result = tableRows.filter((row) => matches(row, params))
        for (const order of params.getAll("order")) {
          const [column, direction] = order.split(".")
          result = [...result].sort((a, b) => {
            const left = a[column]
            const right = b[column]
            const comparison = String(left ?? "").localeCompare(String(right ?? ""), "en", { numeric: true })
            return direction === "desc" ? -comparison : comparison
          })
        }
        const offset = Number(params.get("offset") ?? 0)
        const limit = params.has("limit") ? Number(params.get("limit")) : undefined
        result = result.slice(offset, limit === undefined ? undefined : offset + limit)
        result = result.map((row) => selectProjection(row, params.get("select")))
        if (singular) {
          if (result.length !== 1) return json(response, 406, { message: "Expected one mock row" })
          return json(response, 200, result[0])
        }
        return json(response, 200, result)
      }

      if (request.method === "PATCH") {
        const body = await readJSON(request)
        const updated = []
        tableRows = tableRows.map((row) => {
          if (!matches(row, params)) return row
          const value = { ...row, ...body, updated_at: new Date().toISOString() }
          updated.push(value)
          return value
        })
        rows[table] = tableRows
        return respondWithRepresentation(response, request, updated, params)
      }

      if (request.method === "POST") {
        const parsed = await readJSON(request)
        const input = Array.isArray(parsed) ? parsed : [parsed]
        const inserted = input.map((item) => {
          const conflictColumns = params.get("on_conflict")?.split(",") ?? []
          const existingIndex = conflictColumns.length
            ? tableRows.findIndex((current) => conflictColumns.every((column) => String(current[column]) === String(item[column])))
            : -1
          if (existingIndex >= 0) {
            const updated = { ...tableRows[existingIndex], ...item, updated_at: new Date().toISOString() }
            tableRows[existingIndex] = updated
            return updated
          }
          const row = { ...item }
          if (row.id === undefined) row.id = ++nextId
          if (row.is_active === undefined && table.startsWith("area_")) row.is_active = true
          if (table === "area_packages" && row.duration_minutes === undefined) row.duration_minutes = 30
          if (row.created_at === undefined) row.created_at = new Date().toISOString()
          if (row.updated_at === undefined) row.updated_at = new Date().toISOString()
          tableRows.push(row)
          return row
        })
        rows[table] = tableRows
        return respondWithRepresentation(response, request, inserted, params, 201)
      }

      if (request.method === "DELETE") {
        const removed = tableRows.filter((row) => matches(row, params))
        rows[table] = tableRows.filter((row) => !matches(row, params))
        return respondWithRepresentation(response, request, removed, params)
      }

      return json(response, 405, { message: "Mock method not supported" })
    } catch (error) {
      json(response, 500, { message: error instanceof Error ? error.message : "Mock error" })
    }
  })
  return server
}

async function readJSON(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")
}

function respondWithRepresentation(response, request, result, params, status = 200) {
  const prefer = request.headers.prefer ?? ""
  if (!prefer.includes("return=representation")) return json(response, 204, null)
  const projected = result.map((row) => selectProjection(row, params.get("select")))
  const singular = request.headers.accept?.includes("application/vnd.pgrst.object+json") ?? false
  if (singular) {
    if (projected.length !== 1) return json(response, 406, { message: "Expected one mock row" })
    return json(response, status, projected[0])
  }
  return json(response, status, projected)
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", resolve)
  })
  return server.address().port
}

async function freePort() {
  const server = createServer()
  const port = await listen(server)
  await new Promise((resolve) => server.close(resolve))
  return port
}

async function waitForApp(baseURL, child, getLogs) {
  const deadline = Date.now() + 90_000
  let lastError
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Next dev exited early (code ${child.exitCode})\n${getLogs()}`)
    try {
      const response = await fetch(`${baseURL}/api/admin/auth`, { signal: AbortSignal.timeout(3000) })
      if (response.ok) return
    } catch (error) {
      lastError = error
    }
    await sleep(500)
  }
  throw new Error(`Timed out waiting for Next dev${lastError ? `: ${lastError}` : ""}\n${getLogs()}`)
}

test("isolated dashboard API updates flow into country page and homepage using mock data only", { timeout: 150_000 }, async () => {
  const restServer = makePostgrestServer()
  const restPort = await listen(restServer)
  const appPort = await freePort()
  const password = "Mock-Only-Password-827!"
  const salt = randomBytes(16)
  const passwordHash = `scrypt$${salt.toString("hex")}$${scryptSync(password, salt, 64).toString("hex")}`
  let logs = ""
  const child = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(appPort)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "development",
      NEXT_TELEMETRY_DISABLED: "1",
      SUPABASE_URL: `http://127.0.0.1:${restPort}`,
      NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${restPort}`,
      SUPABASE_SERVICE_ROLE_KEY: "mock-only-not-a-real-key",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "mock-only-anon-key",
      ADMIN_EMAIL: "preview-owner@example.test",
      ADMIN_PASSWORD_SCRYPT_HASH: passwordHash,
      ADMIN_SESSION_SECRET: `mock-session-${randomBytes(24).toString("hex")}`,
    },
    stdio: ["ignore", "pipe", "pipe"],
  })
  const keepLogTail = (chunk) => {
    logs = `${logs}${chunk.toString()}`.slice(-12_000)
  }
  child.stdout.on("data", keepLogTail)
  child.stderr.on("data", keepLogTail)
  const baseURL = `http://127.0.0.1:${appPort}`

  try {
    await waitForApp(baseURL, child, () => logs)

    const unauthorized = await fetch(`${baseURL}/api/admin/areas`)
    assert.equal(unauthorized.status, 401, "admin routes must reject a request without the mock session")

    const login = await fetch(`${baseURL}/api/admin/auth`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "preview-owner@example.test", password }),
    })
    assert.equal(login.status, 200, "temporary mock credentials should authenticate only inside this test")
    const setCookie = login.headers.get("set-cookie")
    assert.ok(setCookie?.includes("admin_session="), "login should issue the expected local session cookie")
    const cookie = setCookie.split(";")[0]

    const unauthLandingWrite = await fetch(`${baseURL}/api/cms/landing-pages`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: "saudi-arabia", config: {} }),
    })
    assert.equal(unauthLandingWrite.status, 401, "landing page edits must require an admin session")
    const landingConfig = {
      seo: { title: "اختبار Saudi محفوظ", description: "وصف SEO من اختبار معزول", canonical: "https://example.test/saudi-arabia" },
      heroTitle: "عنوان سعودي بعد تحديث لوحة الإدارة",
      heroDescription: "وصف سعودي مُحدّث من لوحة الإدارة.",
      closingTitle: "دعوة سعودية محدثة",
      closingDescription: "نص سعودي محدث من اختبار مثلث معزول.",
    }
    const landingPatch = await fetch(`${baseURL}/api/cms/landing-pages`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ slug: "saudi-arabia", config: landingConfig }),
    })
    assert.equal(landingPatch.status, 200, `Saudi landing write failed: ${await landingPatch.text()}`)
    const landingRead = await fetch(`${baseURL}/api/cms/landing-pages?slug=saudi-arabia`, { headers: { cookie } })
    assert.deepEqual((await landingRead.json()).data, landingConfig)
    const uaeLandingRead = await fetch(`${baseURL}/api/cms/landing-pages?slug=uae`, { headers: { cookie } })
    assert.equal((await uaeLandingRead.json()).data.heroTitle, "عنوان الإمارات الأصلي", "Saudi edits must not overwrite UAE settings")

    const legalSave = await fetch(`${baseURL}/api/cms/legal-pages`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ page_slug: "privacy", locale: "ar", title: "خصوصية تجريبية", content: "محتوى قانوني اصطناعي" }),
    })
    assert.equal(legalSave.status, 200, "legal editor must be able to create or update a missing locale row")
    const legalPublic = await fetch(`${baseURL}/api/public/legal?slug=privacy&locale=ar`)
    assert.equal((await legalPublic.json()).content, "محتوى قانوني اصطناعي")

    const contentRead = await fetch(`${baseURL}/api/cms/content?key=hero_title&locale=ar`)
    assert.equal(contentRead.status, 200)
    const contentReadBody = await contentRead.json()
    assert.equal(contentReadBody.data[0].content, "عنوان الصفحة الرئيسية التجريبي")

    const contentWrite = await fetch(`${baseURL}/api/cms/content`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ key: "preview_test_copy", content_ar: "نص اختبار معزول", section: "homepage", type: "text" }),
    })
    assert.equal(contentWrite.status, 200, "authenticated CMS writes should use the isolated repository")
    const contentVerify = await fetch(`${baseURL}/api/cms/content?key=preview_test_copy&locale=ar`)
    assert.equal((await contentVerify.json()).data[0].content, "نص اختبار معزول")
    const heroUpdate = await fetch(`${baseURL}/api/cms/content`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ key: "hero_title", content_ar: "عنوان الصفحة بعد CMS", content_en: "Homepage after CMS", section: "homepage", type: "heading" }),
    })
    assert.equal(heroUpdate.status, 200, "CMS update should persist the homepage key")

    const settingsWrite = await fetch(`${baseURL}/api/cms/settings`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify([{ setting_key: "admin-section-preview-color", setting_value: "#123456", value_type: "color", category: "admin-section-preview", label: "لون اختبار" }]),
    })
    assert.equal(settingsWrite.status, 200, "authenticated settings writes should use the isolated repository")
    const settingsVerify = await fetch(`${baseURL}/api/cms/settings?key=admin-section-preview-color`)
    assert.equal((await settingsVerify.json()).data[0].setting_value, "#123456")

    const faqCreate = await fetch(`${baseURL}/api/admin/faq`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ question_ar: "سؤال عام للاختبار", answer_ar: "إجابة عامة للاختبار", category: "preview", sort_order: 1, is_active: true }),
    })
    assert.equal(faqCreate.status, 201)
    const faqCreated = await faqCreate.json()
    const publicFaq = await fetch(`${baseURL}/api/public/faq`)
    const publicFaqData = await publicFaq.json()
    assert.ok(publicFaqData.some((item) => item.id === faqCreated.id && item.question_ar === "سؤال عام للاختبار"))
    const faqPatch = await fetch(`${baseURL}/api/admin/faq`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ id: faqCreated.id, data: { answer_ar: "إجابة معدلة في الاختبار" } }),
    })
    assert.equal(faqPatch.status, 200)
    const faqDelete = await fetch(`${baseURL}/api/admin/faq?id=${faqCreated.id}`, { method: "DELETE", headers: { cookie } })
    assert.equal(faqDelete.status, 200)

    const dashboardDataResponse = await fetch(`${baseURL}/api/admin/areas?slug=austria`, { headers: { cookie } })
    assert.equal(dashboardDataResponse.status, 200)
    const dashboardData = await dashboardDataResponse.json()
    assert.equal(dashboardData.areas[0].currency_code, "EUR")
    assert.equal(dashboardData.faq[0].question_ar, "سؤال النمسا قبل التعديل")

    const globalTeachers = await fetch(`${baseURL}/api/admin/data?type=teachers`, { headers: { cookie } })
    assert.equal(globalTeachers.status, 200)
    assert.equal(rows.admin_content?.length ?? 0, 0, "reading defaults must not seed or copy them into the clean database")
    const teacherUpdate = await fetch(`${baseURL}/api/admin/data`, {
      method: "PUT",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ type: "teachers", id: "1", data: { experience: "preview-only" } }),
    })
    assert.equal(teacherUpdate.status, 200)
    const updatedTeachers = await (await fetch(`${baseURL}/api/admin/data?type=teachers`, { headers: { cookie } })).json()
    assert.equal(updatedTeachers.find((teacher) => teacher.id === "1").experience, "preview-only")

    const globalPackageWrite = await fetch(`${baseURL}/api/admin/data`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ type: "packages", data: { type: "quran", name: { ar: "باقة عامة للاختبار" }, sessions: 2, price: 777, duration: 30, popular: false, active: true, features: { ar: ["اصطناعي"] } } }),
    })
    assert.equal(globalPackageWrite.status, 200)
    const globalPackages = await (await fetch(`${baseURL}/api/admin/data?type=packages`, { headers: { cookie } })).json()
    assert.ok(globalPackages.some((pkg) => pkg.price === 777 && pkg.name.ar === "باقة عامة للاختبار"))

    const pageBefore = await fetch(`${baseURL}/austria`)
    assert.equal(pageBefore.status, 200, "the specialized country page should render in the local preview")
    const htmlBefore = await pageBefore.text()
    assert.match(htmlBefore, /rel="canonical" href="https:\/\/quran-elhafez\.com\/austria"/, "canonical metadata should remain attached to the country route")

    const patch = await fetch(`${baseURL}/api/admin/areas`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ resource: "faq", id: 221, changes: { question_ar: "سؤال معاينة معزولة بعد التعديل", answer_ar: "إجابة معاينة محلية فقط" } }),
    })
    const patchBody = await patch.json()
    assert.equal(patch.status, 200, `FAQ patch failed: ${JSON.stringify(patchBody)}`)

    const createPackage = await fetch(`${baseURL}/api/admin/areas`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ area_id: 22, program: "arabic", name_ar: "باقة اصطناعية", price: 444, sessions_per_month: 8, duration_minutes: 30, description_ar: "اختبار محلي", features_ar: ["mock"] }),
    })
    const createdPackage = await createPackage.json()
    assert.equal(createPackage.status, 201, `package creation failed: ${JSON.stringify(createdPackage)}`)
    assert.equal(createdPackage.data.currency_code, "EUR", "the admin API must derive currency from the selected area")

    const publicAustriaResponse = await fetch(`${baseURL}/api/public/areas/austria`)
    assert.equal(publicAustriaResponse.status, 200)
    const publicAustria = await publicAustriaResponse.json()
    assert.equal(publicAustria.faq[0].question_ar, "سؤال معاينة معزولة بعد التعديل")
    assert.ok(publicAustria.packages.some((item) => item.price === 444 && item.currency_code === "EUR"), JSON.stringify(publicAustria.packages))

    const pageAfter = await fetch(`${baseURL}/austria`)
    assert.equal(pageAfter.status, 200)
    const htmlAfter = await pageAfter.text()
    assert.match(htmlAfter, /rel="canonical" href="https:\/\/quran-elhafez\.com\/austria"/, "the content update must not alter canonical metadata")

    const publicAustraliaResponse = await fetch(`${baseURL}/api/public/areas/australia`)
    assert.equal(publicAustraliaResponse.status, 200)
    const publicAustralia = await publicAustraliaResponse.json()
    assert.equal(publicAustralia.faq[0].question_ar, "سؤال أستراليا الأصلي", "editing Austria must not alter Australia")
    assert.ok(publicAustralia.packages.some((item) => item.price === 303 && item.currency_code === "AUD"))
    assert.ok(!publicAustralia.packages.some((item) => item.price === 444), "the new Austria package must not leak to Australia")

    const home = await fetch(baseURL)
    assert.equal(home.status, 200, "the main site homepage should render against the mock content source")
    const homeHTML = await home.text()
    assert.match(homeHTML, /عنوان الصفحة بعد CMS/)

    const saudiPage = await fetch(`${baseURL}/saudi-arabia`)
    assert.equal(saudiPage.status, 200, "the specialized Saudi page should render from isolated mock storage")
    const saudiHTML = await saudiPage.text()
    assert.match(saudiHTML, /عنوان سعودي بعد تحديث لوحة الإدارة/)
    assert.match(saudiHTML, /rel="canonical" href="https:\/\/example\.test\/saudi-arabia"/)
    const uaePage = await fetch(`${baseURL}/united-arab-emirates`)
    assert.equal(uaePage.status, 200, "the specialized UAE page should render separately")
    const uaeHTML = await uaePage.text()
    assert.match(uaeHTML, /عنوان الإمارات الأصلي/, "Saudi page edits must not leak into UAE output")
  } finally {
    child.kill("SIGTERM")
    await Promise.race([new Promise((resolve) => child.once("exit", resolve)), sleep(5000)])
    if (child.exitCode === null) child.kill("SIGKILL")
    await new Promise((resolve) => restServer.close(resolve))
  }
})
