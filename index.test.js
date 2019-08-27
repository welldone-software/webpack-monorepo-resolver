const fs = require('fs')
const webpack = require('webpack')

const webpackPromise = config => new Promise((resolve, reject) => {
  webpack(config, (err, stats) => {
    resolve({err, stats})
  })
})

describe('resolving', () => {
  const testProjects = fs.readdirSync('./testProjects')

  testProjects.forEach(testProjectName => {

    describe(testProjectName, () => {

      const testProjectFiles = fs.readdirSync(`./testProjects/${testProjectName}`)
        .filter(f => f.startsWith('webpack'))
        .forEach(webpackFileName => {

            test(webpackFileName, () => {
              const webpackConfig = {
                ...require(`./testProjects/${testProjectName}/${webpackFileName}`),
                bail: true
              }
              webpackConfig.resolve.extensions = ['.ts', '.js']
              return webpackPromise(webpackConfig)
                .then(({err, stats}) => {
                  if(webpackFileName.includes('.fail.')){
                    expect(err).toBeTruthy()
                  } else {
                    expect(err).toBeFalsy()
                  }
                })
            })

        })
    })

  })
})
