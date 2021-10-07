const path = require('path');
const fs = require('fs')

const translationsRelDir = 'translations/downloaded'
const translationsOutpurRelDir = 'translations/parsed'
const localazyConfigFile = 'localazy.json'

const projectDir = path.dirname(path.dirname(__dirname))
const translationsDir = path.join(projectDir, translationsRelDir)
const translationsOutputDir = path.join(projectDir, translationsOutpurRelDir)

const log = (msg) => console.log(`[Localazy-Converter] ${msg}`)

const loadTranslations = () => {
  const translationFiles = fs.readdirSync(translationsDir).filter(f => f.endsWith('.json'))
  return translationFiles.reduce((acc, fileName) => {
    const absPath = path.join(translationsDir, fileName)
    acc[fileName] = JSON.parse(fs.readFileSync(absPath))
    return acc
  }, {})
}

const convertWithPluralObjects = (translations) => {
  const convert = (fileContent) => {
    // do the conversion
    return fileContent
  }

  Object.keys(translations).forEach(fileName => {
    const rawTranslation = translations[fileName]
    const converted = convert(rawTranslation)
    persistTranslationsFile(fileName, converted)
    log(`Converted ${fileName}, output in ${translationsOutpurRelDir}`)
  })
}

const persistTranslationsFile = (fileName, content) => {
  const absFileName = path.join(translationsOutputDir, fileName)
  fs.writeFileSync(absFileName, JSON.stringify(content, null, 2))
}

exports.convert = () => {
  const localazyConfig = JSON.parse(fs.readFileSync(path.join(projectDir, localazyConfigFile)))
  const translations = loadTranslations()
  const pluralType = localazyConfig.upload.features.find(feature => feature.match(/plural_/))

  switch(pluralType) {
    case 'plural_object':
      convertWithPluralObjects(translations)
      break;
    default:
      log('plural type not reconized')
      break;
  }
}
