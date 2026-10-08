import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const countryPagesFile = path.join(root, "components/layout/country-pages-section.tsx")
const newCountryPagesFile = path.join(root, "lib/new-country-pages.ts")
const countryPagesSource = readFileSync(countryPagesFile, "utf8")
const newCountryPagesSource = readFileSync(newCountryPagesFile, "utf8")
const countrySlugs = [...countryPagesSource.matchAll(/href:\s*"\/([^"]+)"/g)].map((match) => match[1])
const routeFile = (slug) => path.join(root, "app", slug, "page.tsx")
const componentFile = (name) => path.join(root, "components/country-landings", `${name}.tsx`)
const configEntryPattern = (slug) => new RegExp(`(?:^|\\n)\\s*${slug.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*:\\s*\\{\\s*slug\\s*:\\s*[\"']${slug}[\"']`, "m")

 test("country navigation has 40 unique entries", () => {
  assert.equal(countrySlugs.length, 40, "update this assertion when the approved country list changes")
  assert.equal(new Set(countrySlugs).size, countrySlugs.length, "duplicate country links found")
})

test("every listed country route has metadata and a valid central dispatch target", () => {
  const failures = []

  for (const slug of countrySlugs) {
    const routePath = routeFile(slug)
    if (!existsSync(routePath)) {
      failures.push(`${slug}: missing app/${slug}/page.tsx`)
      continue
    }

    const source = readFileSync(routePath, "utf8")
    const hasStaticMetadata = /export\s+const\s+metadata\s*:\s*Metadata\b/.test(source)
    const hasDynamicMetadata = /export\s+async\s+function\s+generateMetadata\s*\(/.test(source)
    if (!hasStaticMetadata && !hasDynamicMetadata) failures.push(`${slug}: missing exported Metadata or generateMetadata`)

    const engineMatch = source.match(/<CountryLandingEngine\b([\s\S]*?)\/>/)
    if (engineMatch) {
      const props = engineMatch[1]
      const routeSlug = props.match(/\bslug\s*=\s*["']([^"']+)["']/)?.[1]
      if (routeSlug !== slug) failures.push(`${slug}: engine slug is ${routeSlug ?? "missing"}`)

      const specializedName = props.match(/\bspecializedPage\s*=\s*\{([A-Za-z_$][\w$]*)\}/)?.[1]
      if (specializedName) {
        const importPattern = new RegExp(`import\\s*\\{\\s*${specializedName}\\s*\\}\\s*from\\s*[\"']@/components/country-landings/${specializedName}[\"']`)
        if (!importPattern.test(source)) {
          failures.push(`${slug}: specialized page ${specializedName} is not imported from its country component`)
        } else if (!existsSync(componentFile(specializedName))) {
          failures.push(`${slug}: missing components/country-landings/${specializedName}.tsx`)
        } else {
          const component = readFileSync(componentFile(specializedName), "utf8")
          if (!new RegExp(`export\\s+(?:async\\s+)?function\\s+${specializedName}\\b`).test(component)) {
            failures.push(`${slug}: ${specializedName} is not exported as a component`)
          }
        }
      } else if (!configEntryPattern(slug).test(newCountryPagesSource)) {
        failures.push(`${slug}: generic engine route has no matching config in lib/new-country-pages.ts`)
      }
      continue
    }

    if (/import\s*\{\s*NewCountryLanding\s*\}\s*from\s*["']@\/components\/new-country-landing["']/.test(source)) {
      const configSlug = source.match(/getNewCountryConfig\s*\(\s*["']([^"']+)["']\s*\)/)?.[1]
      if (configSlug !== slug) failures.push(`${slug}: NewCountryLanding config slug is ${configSlug ?? "missing"}`)
      if (!configEntryPattern(slug).test(newCountryPagesSource)) {
        failures.push(`${slug}: matching NewCountryLanding config does not exist`)
      }
      continue
    }

    failures.push(`${slug}: route does not use CountryLandingEngine or NewCountryLanding`)
  }

  assert.deepEqual(failures, [], failures.join("\n"))
})

test("each production country route emits static HTML or a dynamic server bundle", (t) => {
  const outputRoot = path.join(root, ".next/server/app")
  if (!existsSync(outputRoot)) {
    t.skip("run pnpm build before the production HTML smoke test")
    return
  }

  const failures = []
  for (const slug of countrySlugs) {
    const candidates = [path.join(outputRoot, `${slug}.html`), path.join(outputRoot, slug, "index.html")]
    const htmlPath = candidates.find(existsSync)
    if (!htmlPath) {
      const routeBundle = path.join(outputRoot, slug, "page.js")
      const sourcePath = routeFile(slug)
      const hasDynamicMetadata = existsSync(sourcePath)
        && /export\s+async\s+function\s+generateMetadata\s*\(/.test(readFileSync(sourcePath, "utf8"))
      if (existsSync(routeBundle) && hasDynamicMetadata) continue
      failures.push(`${slug}: static HTML or dynamic server bundle with generateMetadata missing`)
      continue
    }

    const html = readFileSync(htmlPath, "utf8")
    if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${slug}: title tag missing`)
    if (!new RegExp(`rel="canonical" href="[^"]*/${slug}(?:/)?"`).test(html)) {
      failures.push(`${slug}: canonical URL does not end in /${slug}`)
    }
    if (!/<h1(?:\s|>)/.test(html)) failures.push(`${slug}: rendered page has no h1`)
  }

  assert.deepEqual(failures, [], failures.join("\n"))
})
