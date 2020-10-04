const sortDropdown = document.querySelector('#sort-dropdown')
const searchSortForm = document.querySelector('#search-sort-form')
sortDropdown.addEventListener('change', function onSortDropdownSelect(event) {
  searchSortForm.submit()
})
