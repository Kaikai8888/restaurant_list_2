const sortDropdown = document.querySelector('#sort-dropdown')
const searchSortForm = document.querySelector('#search-sort-form')

//submit form whenever change sorting option
sortDropdown.addEventListener('change', function onSortDropdownSelect(event) {
  searchSortForm.submit()
})
