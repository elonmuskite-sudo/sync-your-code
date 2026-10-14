#!/usr/bin/env node
// One command that checks every service key and pushes them where they are needed:
//   - Supabase Edge Function secrets (NOWPayments, Resend, Appwrite) via the Supabase Management API
//   - Vercel Production environment variables (browser + server keys)
// Runs locally (reads .env.secrets / .env.local / .env) or in GitHub Actions (reads repo secrets).
// Flags: --check   only validate keys against each live API, change nothing
//        --dry-run validate + print the plan, change nothing
// Secret values are never printed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const CHECK_ONLY = args.has('--check')
const DRY_RUN = args.has('--dry-run')

function readEnvFile(file) {
  const p = path.join(root, file)
  if (!fs.existsSync(p)) return {}
  const out = {}
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#') || !t.includes('=')) continue
    const i = t.indexOf('=')
    let v = t.slice(i + 1).trim()
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1)
    out[t.slice(0, i).trim()] = v
  }
  return out
}

const env = { ...readEnvFile('.env'), ...readEnvFile('.env.local'), ...readEnvFile('.env.secrets') }
for (const [k, v] of Object.entries(process.env)) if (v) env[k] = v
const get = (...keys) => keys.map((k) => String(env[k] || '').trim()).find(Boolean) || ''
const PLACEHOLDER = /your_|your-|changeme|replace-me|example\.com/i
const has = (v) => Boolean(v) && !PLACEHOLDER.test(v)

const cfg = {
  supabaseUrl: get('SUPABASE_URL', 'VITE_SUPABASE_URL'),
  anonKey: get('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY'),
  serviceRole: get('SUPABASE_SERVICE_ROLE_KEY'),
  projectRef: get('SUPABASE_PROJECT_REF', 'VITE_SUPABASE_PROJECT_ID', 'SUPABASE_PROJECT_ID'),
  accessToken: get('SUPABASE_ACCESS_TOKEN'),
  resendKey: get('RESEND_API_KEY'),
  resendFrom: get('RESEND_FROM'),
  nowKey: get('NOWPAYMENTS_API_KEY'),
  nowIpn: get('NOWPAYMENTS_IPN_SECRET'),
  appwriteEndpoint: get('APPWRITE_ENDPOINT', 'VITE_APPWRITE_ENDPOINT'),
  appwriteProject: get('APPWRITE_PROJECT_ID', 'VITE_APPWRITE_PROJECT_ID'),
  vercelToken: get('VERCEL_TOKEN'),
  vercelProject: get('VERCEL_PROJECT_ID'),
  vercelTeam: get('VERCEL_ORG_ID', 'VERCEL_TEAM_ID'),
  // Appwrite stays keys-only: sign-in remains on Supabase unless explicitly switched.
  authProvider: get('VITE_AUTH_PROVIDER') || 'supabase',
}

const results = []
const record = (name, ok, note = '') => { results.push({ name, ok, note }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${note ? ` — ${note}` : ''}`) }
const skip = (name, note) => { results.push({ name, ok: null, note }); console.log(`SKIP  ${name} — ${note}`) }

async function probe(name, ready, missingNote, fn) {
  if (!ready) return skip(name, missingNote)
  try {
    const res = await fn()
    record(name, res.ok, res.ok ? '' : `HTTP ${res.status}`)
  } catch (e) {
    record(name, false, e.message)
  }
}

async function checkAll() {
  console.log('— Checking keys against live services —')
  await probe('Supabase public key', has(cfg.supabaseUrl) && has(cfg.anonKey), 'SUPABASE_URL / SUPABASE_ANON_KEY not set',
    () => fetch(`${cfg.supabaseUrl}/auth/v1/settings`, { headers: { apikey: cfg.anonKey } }))
  await probe('Supabase service key', has(cfg.supabaseUrl) && has(cfg.serviceRole), 'SUPABASE_SERVICE_ROLE_KEY not set',
    () => fetch(`${cfg.supabaseUrl}/auth/v1/admin/users?per_page=1`, { headers: { apikey: cfg.serviceRole, Authorization: `Bearer ${cfg.serviceRole}` } }))
  await probe('Supabase management token', has(cfg.accessToken) && has(cfg.projectRef), 'SUPABASE_ACCESS_TOKEN / SUPABASE_PROJECT_REF not set',
    () => fetch(`https://api.supabase.com/v1/projects/${cfg.projectRef}/secrets`, { headers: { Authorization: `Bearer ${cfg.accessToken}` } }))
  await probe('Resend', has(cfg.resendKey), 'RESEND_API_KEY not set',
    () => fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${cfg.resendKey}` } }))
  if (!has(cfg.resendFrom)) skip('Resend sender', 'RESEND_FROM not set')
  await probe('NOWPayments', has(cfg.nowKey), 'NOWPAYMENTS_API_KEY not set',
    () => fetch('https://api.nowpayments.io/v1/merchant/coins', { headers: { 'x-api-key': cfg.nowKey } }))
  if (!has(cfg.nowIpn)) skip('NOWPayments IPN secret', 'NOWPAYMENTS_IPN_SECRET not set')
  await probe('Appwrite', has(cfg.appwriteEndpoint) && has(cfg.appwriteProject), 'APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID not set',
    () => fetch(`${cfg.appwriteEndpoint.replace(/\/$/, '')}/health/version`, { headers: { 'X-Appwrite-Project': cfg.appwriteProject } }))
  await probe('Vercel', has(cfg.vercelToken) && has(cfg.vercelProject), 'VERCEL_TOKEN / VERCEL_PROJECT_ID not set',
    () => fetch(`https://api.vercel.com/v9/projects/${encodeURIComponent(cfg.vercelProject)}${cfg.vercelTeam ? `?teamId=${cfg.vercelTeam}` : ''}`, { headers: { Authorization: `Bearer ${cfg.vercelToken}` } }))
}

// Edge Function secrets. Names starting with SUPABASE_ are reserved and injected by Supabase itself.
function edgeSecrets() {
  return [
    ['NOWPAYMENTS_API_KEY', cfg.nowKey],
    ['NOWPAYMENTS_IPN_SECRET', cfg.nowIpn],
    ['RESEND_API_KEY', cfg.resendKey],
    ['RESEND_FROM', cfg.resendFrom],
    ['APPWRITE_ENDPOINT', cfg.appwriteEndpoint],
    ['APPWRITE_PROJECT_ID', cfg.appwriteProject],
  ].filter(([, v]) => has(v))
}

// [key, value, type] — plain for browser-safe values, encrypted for server secrets.
function vercelVars() {
  return [
    ['VITE_SUPABASE_URL', cfg.supabaseUrl, 'plain'],
    ['SUPABASE_URL', cfg.supabaseUrl, 'plain'],
    ['VITE_SUPABASE_ANON_KEY', cfg.anonKey, 'plain'],
    ['VITE_SUPABASE_PUBLISHABLE_KEY', cfg.anonKey, 'plain'],
    ['SUPABASE_ANON_KEY', cfg.anonKey, 'plain'],
    ['SUPABASE_SERVICE_ROLE_KEY', cfg.serviceRole, 'encrypted'],
    ['RESEND_API_KEY', cfg.resendKey, 'encrypted'],
    ['RESEND_FROM', cfg.resendFrom, 'plain'],
    ['VITE_AUTH_PROVIDER', cfg.authProvider, 'plain'],
    ['APPWRITE_ENDPOINT', cfg.appwriteEndpoint, 'plain'],
    ['APPWRITE_PROJECT_ID', cfg.appwriteProject, 'plain'],
    ['VITE_APPWRITE_ENDPOINT', cfg.appwriteEndpoint, 'plain'],
    ['VITE_APPWRITE_PROJECT_ID', cfg.appwriteProject, 'plain'],
  ].filter(([, v]) => has(v))
}

async function pushSupabase() {
  const list = edgeSecrets()
  if (!has(cfg.accessToken) || !has(cfg.projectRef)) return skip('Push Supabase secrets', 'SUPABASE_ACCESS_TOKEN / SUPABASE_PROJECT_REF not set')
  console.log(`Supabase secrets to set: ${list.map(([k]) => k).join(', ') || '(none)'}`)
  if (DRY_RUN || !list.length) return
  const res = await fetch(`https://api.supabase.com/v1/projects/${cfg.projectRef}/secrets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(list.map(([name, value]) => ({ name, value }))),
  })
  record('Push Supabase secrets', res.ok, res.ok ? `${list.length} set` : `HTTP ${res.status}`)
}

async function pushVercel() {
  const list = vercelVars()
  if (!has(cfg.vercelToken) || !has(cfg.vercelProject)) return skip('Push Vercel env', 'VERCEL_TOKEN / VERCEL_PROJECT_ID not set')
  console.log(`Vercel Production vars to set: ${list.map(([k]) => k).join(', ')}`)
  if (DRY_RUN) return
  const q = new URLSearchParams({ upsert: 'true', ...(cfg.vercelTeam ? { teamId: cfg.vercelTeam } : {}) })
  let failed = 0
  for (const [key, value, type] of list) {
    const res = await fetch(`https://api.vercel.com/v10/projects/${encodeURIComponent(cfg.vercelProject)}/env?${q}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.vercelToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value, type, target: ['production'] }),
    })
    if (!res.ok) { failed++; console.log(`FAIL  Vercel ${key} — HTTP ${res.status}`) }
  }
  record('Push Vercel env', failed === 0, failed ? `${failed} failed` : `${list.length} set`)
}

async function main() {
  if (!['supabase', 'appwrite'].includes(cfg.authProvider)) throw new Error('VITE_AUTH_PROVIDER must be supabase or appwrite.')
  await checkAll()
  if (!CHECK_ONLY) {
    console.log(DRY_RUN ? '— Dry run: nothing will be changed —' : '— Pushing secrets —')
    await pushSupabase()
    await pushVercel()
  }
  const failed = results.filter((r) => r.ok === false)
  const skipped = results.filter((r) => r.ok === null)
  console.log(`\nDone: ${results.filter((r) => r.ok).length} passed, ${failed.length} failed, ${skipped.length} skipped.`)
  if (failed.length) process.exitCode = 1
}

main().catch((e) => { console.error(`[secrets] ${e.message}`); process.exitCode = 1 })
