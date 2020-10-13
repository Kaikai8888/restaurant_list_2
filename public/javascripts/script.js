const sortDropdown = document.querySelector('#sort-dropdown')
const searchSortForm = document.querySelector('#search-sort-form')
const categoryNameInput = document.querySelector('.new-edit-form #category')
const categoryDropdown = document.querySelector('.new-edit-form #category-dropdown')
const categoryDropdownItems = document.querySelectorAll('.new-edit-form #category-dropdown a')


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
    categoryNameInput.value = event.target.dataset.name
  })
  categoryNameInput.addEventListener('keyup', function onCategoryKeyUp(event) {
    const keyword = this.value.trim().toLowerCase()
    const matchCount = [...categoryDropdownItems].reduce((matchCount, item) => {
      if (!keyword || item.innerText.toLowerCase().includes(keyword)) {
        item.style.display = ''
        matchCount++
      } else {
        item.style.display = 'none'
      }
      return matchCount
    }, 0)

    //hide dropdown list when no options matched the keyword
    if (matchCount === 0) {
      categoryDropdown.style.display = 'none'
    } else {
      categoryDropdown.style.display = ''
    }
  })
}




