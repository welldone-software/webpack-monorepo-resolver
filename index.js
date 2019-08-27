const path = require('path')

module.exports = class WebpackMonorepoResolver {
  constructor({possiblePackageEntries} = {possiblePackageEntries: ['src']}) {
    this.possiblePackageEntries = possiblePackageEntries
  }

  // eslint-disable-next-line class-methods-use-this
  apply(resolver) {
    // More info about resolver steps we hook to:
    // https://github.com/webpack/enhanced-resolve/blob/master/lib/ResolverFactory.js
    // https://github.com/webpack/enhanced-resolve
    // https://github.com/webpack/webpack.js.org/issues/1458

    // "describedResolve" is one of the first steps of a resolve process,
    // where the path to package.json is added to the resolve request.
    // We need package.json because this is how we determine where the root of the package
    // of the file that requests the resolving is.
    // For example: when /packages/package-a/index.js resolves "b/b.js",
    // we know we need to resolve relatively to "package-a".
    const sourceHook = resolver.ensureHook('describedResolve')

    // "describedRelative" is the hook we target the resolving.
    // It means the file relative path is resolved and the next step is to see if it exists at all
    // requiring "fs" for example would indeed result in this plugin
    // resolving to "package-a/src/fs" but it would see there's no file by this name
    // so the resolution process would go on to node_modules etc...
    const targetHook = resolver.ensureHook('describedRelative')

    sourceHook.tapAsync('WebpackMonorepoResolver', (request, resolveContext, callback) => {
      const {
        // The exact request string being resolved. f.e: 'common/service/api'
        request: originalRequestStr,
        // The path of the *requesting* file
        path: requestingFilePath,
        // This is the path of the folder of the nearest package.json to the *requesting* file.
        descriptionFileRoot
      } = request

      const isModuleImport = (originalRequestStr.startsWith('.') && !path.isAbsolute(originalRequestStr))
      if (!isModuleImport) {
        return callback()
      }

      const packageEntry = this.possiblePackageEntries.find(possibleEntry => {
        const possibleEntryPath = path.resolve(descriptionFileRoot, possibleEntry)
        const isFileRequestingStartsWithThisEntryPath = requestingFilePath.startsWith(possibleEntryPath)
        return isFileRequestingStartsWithThisEntryPath
      }) || ''

      const monorepoResolvedPath = path.resolve(descriptionFileRoot, packageEntry, originalRequestStr)

      resolver.doResolve(
        targetHook,
        {...request, path: monorepoResolvedPath},
        `WebpackMonorepoResolver resolved path: ${monorepoResolvedPath}`,
        resolveContext,
        callback
      )
    })
  }
}
