/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

/**
 * @file Run Gatsby bootstrap step to generate schema files to lint
 */

const fsExtra = require('fs-extra')
const reporter = require('gatsby-cli/lib/reporter')
const redux = require('gatsby-cli/lib/reporter/redux')
const { updateSiteMetadata } = require('gatsby-core-utils')
const { bootstrap } = require('gatsby/dist/bootstrap')
const path = require('path')

async function build (program) {
  await updateSiteMetadata({
    name: program.sitePackageJson.name,
    sitePath: program.directory,
    lastRun: Date.now(),
    pid: process.pid,
  })

  const { workerPool } = await bootstrap({
   program: program,
   parentSpan: {},
  })

  workerPool.end()

  // explicitly exit as gatsby still monitors somewhere
  // workaround: wait 1000ms to ensure introspection is written
  await new Promise(resolve => setTimeout(resolve, 1000))
  process.exit(0)
}

process.env.gatsby_log_level = 'verbose'
process.env.gatsby_executing_command = 'build'

const directory = path.resolve('.')
const useYarn = fsExtra.existsSync(path.join(directory, 'yarn.lock'))
const program = {
  directory: directory,
  browserslist: ['>0.25%', 'not dead'],
  sitePackageJson: require(path.join(directory, 'package.json')),
  report: reporter.default,
  useYarn: useYarn,
  setStore: redux.setStore,
}

build(program)
