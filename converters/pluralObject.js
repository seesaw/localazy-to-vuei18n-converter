const pluralToString = (pluralObject) => {
  // TODO: this works for circa all lang, for arabic there are some other options
  // https://localazy.com/docs/general/translating-plurals
  return `${pluralObject.zero || pluralObject.other} | ${pluralObject.one} | ${pluralObject.other}` 
}

const convertkeyObject = (subObject) => {
  if (subObject.constructor === Object) {
    if(Object.keys(subObject).includes('one') && Object.keys(subObject).includes('other')) {
      return pluralToString(subObject)
    }
    else {
      return convert(subObject)
    }
  }
  else if (subObject.constructor === Array) {
    return subObject
  }
  else if (subObject.constructor === String) {
    return subObject
  }
  else {
    return null
  }
}

const convert = (fileContent) => {
  return Object.keys(fileContent).reduce((acc, key) => {
    acc[key] = convertkeyObject(fileContent[key])
    return acc
  }, {})
}

const convertWithPluralObjects = (translations) => {
  let output = {}
  Object.keys(translations).forEach(fileName => {
    const converted = convert(translations[fileName])
    output[fileName] = { ...converted }
  })
  return output
}

module.exports = convertWithPluralObjects
