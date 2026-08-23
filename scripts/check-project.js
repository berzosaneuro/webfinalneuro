#!/usr/bin/env node
const { existsSync, readFileSync } = require('node:fs')
const { join } = require('node:path')
const root = process.cwd()
console.log('Deploying project from:', root)

const pkgPath = join(root, 'package.json')
const verPath = join(root, 'vercel.json')
if (!existsSync(pkgPath) || !existsSync(verPath)) {
  console.error('ERROR: Run build from the Next.js app root (package.json + vercel.json required).')
  process.exit(1)
}
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
if (!pkg.dependencies?.next) {
  console.error('ERROR: This folder is not the Next.js app root.')
  process.exit(1)
}

const projectFile = join(root, '.vercel', 'project.json')
if (existsSync(projectFile)) {
  const p = JSON.parse(readFileSync(projectFile, 'utf8'))
  console.log('Vercel project:', p.projectName || p.projectId, p.orgId || '')
} else {
  console.warn('WARN: .vercel/project.json missing — run: vercel link --yes --team <team> --project webfinalneuro-main')
}
