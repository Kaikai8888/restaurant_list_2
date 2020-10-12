const sortDropdown = document.querySelector('#sort-dropdown')
const searchSortForm = document.querySelector('#search-sort-form')
const categoryNameInput = document.querySelector('.new-edit-form #category')
const categoryDropdown = document.querySelector('.new-edit-form #category-dropdown')


//Index page: submit form whenever change sorting option
if (sortDropdown) {
  sortDropdown.addEventListener('change', function onSortDropdownSelect(event) {
    searchSortForm.submit()
  })
}

//New, Edit form page: categoryDropDown
if (categoryDropdown && categoryNameInput) {
  categoryDropdown.addEventListener('click', function onCategoryDropdownClick(event) {
    categoryNameInput.innerText = ''
    categoryNameInput.value = event.target.innerText
    // categoryIdInput.value = event.target.dataset.id
  })
  // categoryNameInput.addEventListener('keyup', function onCategoryKeyUp(event) {
  //   categoryIdInput.value = 
  // })
}




