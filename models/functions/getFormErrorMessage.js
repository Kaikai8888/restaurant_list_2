module.exports = function (error) {
  const errorMessage = Object.entries(error.errors).map(entry => `${entry[0]}: ${entry[1].message}`).join('<br>')
  return `<p>${errorMessage}</p>`
}