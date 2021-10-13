const path = require('path');
const fs = require('fs')

const convertPluralObjects = require('./converters/pluralObject')

const translationsRelDir = 'translations/downloaded'
const translationsOutpurRelDir = 'translations/parsed'
const localazyConfigFile = 'localazy.json'

const projectDir = path.dirname(path.dirname(__dirname))
const translationsOutputDir = path.join(projectDir, translationsOutpurRelDir)

const log = (msg) => console.log(`[Localazy-Converter] ${msg}`)

const loadTranslations = (translationsFilesDirs = null) => {
  const translationsDir = path.join(projectDir, translationsFilesDirs || translationsRelDir)
  const translationFiles = fs.readdirSync(translationsDir).filter(f => f.endsWith('.json'))
  return translationFiles.reduce((acc, fileName) => {
    const absPath = path.join(translationsDir, fileName)
    acc[fileName] = JSON.parse(fs.readFileSync(absPath))
    return acc
  }, {})
}

const persistTranslationsFile = (translations) => {
  if(!translations) return

  Object.keys(translations).forEach(fileName => {
    const absFileName = path.join(translationsOutputDir, fileName)
    fs.writeFileSync(absFileName, JSON.stringify(translations[fileName], null, 2))
    log(`converted ${fileName} translations in ${translationsOutpurRelDir}`)
  })
}

exports.convert = (translationsFilesDirs = null) => {
  const localazyConfig = JSON.parse(fs.readFileSync(path.join(projectDir, localazyConfigFile)))
  const translations = loadTranslations(translationsFilesDirs)
  const pluralType = localazyConfig.upload.features.find(feature => feature.match(/plural_/))

  let output
  switch(pluralType) {
    case 'plural_object':
      output = convertPluralObjects(translations)
      break;
    default:
      log('plural type not reconized')
      break;
  }

  persistTranslationsFile(output)
}
