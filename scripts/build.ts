import path from 'node:path'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
// import { execSync as exec } from 'node:child_process'
import execa from 'execa'
import fs from 'fs-extra'
import fg from 'fast-glob'
import consola from 'consola'
import { version } from '../package.json'
import { packages } from '../meta/packages'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const rootDir = path.resolve(__dirname, '..')
const watch = process.argv.includes('--watch')

const FILES_COPY_ROOT = ['LICENSE']

const FILES_COPY_LOCAL = ['README.md', 'index.json', '*.cjs', '*.mjs', '*.d.ts']

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
  for (const { name, dir } of packages) {
    const packageDir = dir ? dir.split('/')[0] : 'packages'
    const packageRoot = path.resolve(__dirname, '..', packageDir, name)
    const packageDist = path.resolve(packageRoot, 'dist')

    if (name === 'core') {
      await fs.copyFile(
        path.join(rootDir, 'README.md'),
        path.join(packageDist, 'README.md'),
      )
    }

    for (const file of FILES_COPY_ROOT)
      await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))

    const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })
    for (const file of files) {
      await fs.copyFile(
        path.join(packageRoot, file),
        path.join(packageDist, file),
      )
    }

    const packageJSON = await fs.readJSON(
      path.join(packageRoot, 'package.pro.json'),
    )

    for (const key of Object.keys(packageJSON.dependencies || {})) {
      if (key.startsWith('@vruse/'))
        packageJSON.dependencies[key] = version
    }

    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, {
      spaces: 2,
    })
  }
}

async function build() {
  // consola.info('Clean up')
  // execa('pnpm run clean', { stdio: 'inherit' })

  consola.info('Rollup')
  execa(`pnpm run build:rollup${watch ? ' -- --watch' : ''}`, {
    stdio: 'inherit',
  })

  await buildMetaFiles()
}

async function cli() {
  try {
    await build()
  }
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { build }

cli()
