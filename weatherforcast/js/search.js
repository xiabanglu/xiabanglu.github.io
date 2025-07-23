const searchList = document.querySelector('.search-list')
document.querySelector('.search-city').addEventListener('input', e => {
    if (e.target.value.length > 0) {
        searchList.classList.add('show')
    } else {
        searchList.classList.remove('show')
    }
})
document.querySelector('.search-city').addEventListener('blur', e => {
    setTimeout(() => {
        searchList.classList.remove('show')
    }, 500)
})
document.querySelector('.search-city').addEventListener('focus', e => {
    if (e.target.value.length > 0) {
        searchList.classList.add('show')
    }
})