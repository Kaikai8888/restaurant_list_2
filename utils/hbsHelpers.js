module.exports = {
  getByKey: (object, key) => object[key],
  eq: (a, b) => a === b,
  or: (a, b) => a || b
}

