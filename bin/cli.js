try {
  require('../index').convert()
}
catch(error) {
  console.error(error)
  process.exit(2)
}
