import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8')

const removedSurfaces = [
  'app/actions/stripe.ts',
  'app/actions/paddle.ts',
  'app/api/admin/orders/route.ts',
  'app/api/admin/payment-settings/route.ts',
  'app/api/stripe/webhook/route.ts',
  'app/api/webhooks/paddle/route.ts',
  'app/checkout-success/page.tsx',
  'components/admin/OrdersTab.tsx',
  'components/admin/PaymentSettingsTab.tsx',
  'components/dynamic-checkout.tsx',
  'components/paddle-checkout.tsx',
  'components/stripe-checkout.tsx',
  'lib/payment-config.ts',
  'lib/payment-feature.ts',
  'lib/paddle-client.ts',
  'lib/stripe.ts',
  'lib/products.ts',
]

test('payment, order, webhook, and checkout modules are absent', () => {
  for (const relativePath of removedSurfaces) {
    assert.equal(existsSync(path.join(root, relativePath)), false, `${relativePath} should not exist`)
  }
})

test('Stripe SDK packages are no longer direct dependencies', () => {
  const pkg = JSON.parse(read('package.json'))
  const dependencyNames = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
  assert.equal(dependencyNames.some((name) => name === 'stripe' || name.startsWith('@stripe/')), false)
})

test('admin navigation no longer exposes orders or payment settings', () => {
  const navigation = read('components/admin/admin-navigation.ts')
  assert.doesNotMatch(navigation, /id:\s*"orders"|id:\s*"payment-settings"/)
  assert.doesNotMatch(read('lib/i18n.tsx'), /account\.myOrders/)
  assert.match(navigation, /id:\s*"packages"/)
})

test('package price content and public package endpoint remain available', () => {
  const areaSchema = read('db/isolated/0001_clean_baseline.sql')
  const globalSchema = read('db/isolated/0002_admin_content.sql')
  assert.match(areaSchema, /CREATE TABLE area_packages[\s\S]*?price NUMERIC/i)
  assert.match(globalSchema, /CREATE TABLE packages[\s\S]*?price NUMERIC/i)
  assert.equal(existsSync(path.join(root, 'app/api/public/packages/route.ts')), true)
})
