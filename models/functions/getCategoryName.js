module.exports = function (...restaurants) {
  return restaurants.map(restaurant => {
    restaurant.category = restaurant.category.name
    return restaurant
  })
}