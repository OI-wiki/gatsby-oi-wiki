const trough = require('trough')
const extend = require('extend')
const unified = require('unified')
const vfile = require('vfile')

function WrapperPlugin(doc, options) {
  const plugins = options.unifiedPlugins
  const nodeName = options.nodeName || 'markdownAST'
  
  const ast = doc[nodeName]

  // let's say transformers do not care their unified instance at all
  const dummyUnified = unified()

  const attachers = addPlugins(plugins)
  const transformers = trough()

  for (const i in attachers) {
    const values = attachers[i]

    if (values[1] === false) {
      continue
    } else if (values[1] === true) {
      values[1] = undefined
    }

    const transformer = values[0].apply(dummyUnified, values.slice(1))
    
    if (typeof transformer === 'function') {
      transformers.use(transformer)
    }
  }

  transformers.run(ast, vfile(undefined), function (error) {
    if (error) throw error
  })
}

function addPlugins(plugins) {
  const attachers = []
  for (const plugin of plugins) {
    switch(typeof plugin) {
      case 'function': 
        addPlugin(plugin)
        break
      case 'object':
        if ('length' in plugin) {
          addPlugin.apply(null, plugin)
          break
        } else {
          throw new Error('Presets are not supported currently')
        }
      default:
        throw new Error('Expected usable value, not `' + plugin + '`')
    }
  }

  return attachers

  function find(plugin) {
    var index = -1

    while (++index < attachers.length) {
      if (attachers[index][0] === plugin) {
        return attachers[index]
      }
    }
  }

  function addPlugin(plugin, value) {
    var entry = find(plugin)

    if (entry) {
      if (plain(entry[1]) && plain(value)) {
        value = extend(true, entry[1], value)
      }

      entry[1] = value
    } else {
      const { slice } = []
      attachers.push(slice.call(arguments))
    }
  }
}

WrapperPlugin.setParserPlugins = function (options) {
  return options.unifiedPlugins
}

module.exports = WrapperPlugin
