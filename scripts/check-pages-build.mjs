import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const base = '/Pawtern/'
const output = resolve('dist')
const html = readFileSync(resolve(output, 'index.html'), 'utf8')
assert(html.includes(`src="${base}assets/`), 'The entry script must use the GitHub Pages base path')

let checked = 0
for (const file of readdirSync(resolve(output, 'assets'))) {
  if (!/\.(css|js)$/.test(file)) continue
  const content = readFileSync(resolve(output, 'assets', file), 'utf8')
  assert(!/["'`(]\/(?:assets|reference|fonts)\//.test(content), `${file} has a domain-root asset URL`)
  for (const match of content.matchAll(/["'`(]((?:\.\/|\/Pawtern\/)(?:assets|reference|fonts)\/[^"'`()\s]+)["'`)]/g)) {
    if (match[1].includes('${')) continue
    const relative = match[1].replace(/^\.\//, '').replace(/^\/Pawtern\//, '')
    assert(existsSync(resolve(output, relative)), `Missing asset: ${relative}`)
    checked++
  }
}
for (const step of [1, 2, 3]) {
  assert(existsSync(resolve(output, `reference/onboarding-${step}.png`)), `Missing welcome image ${step}`)
}
console.log(`GitHub Pages base path and ${checked} asset references verified.`)
