module.exports = {
  getByKey: (object, key) => object[key],
  eq: (a, b) => a === b,
  or: (...items) => {
    items.splice(-1, 1)
    return items.reduce((result, item) => result || item)
  }
}

