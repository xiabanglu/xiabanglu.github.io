const creator = '某某'

function getBookList() {
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    params: {
      creator
    }
  }).then(result => {
    const bookList = result.data.data
    const htmlstr = bookList.map((item, index) => {
      return `<tr>
          <td>${index + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td data-id=${item.id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>`
    }).join('')
    document.querySelector('.list').innerHTML = htmlstr
  })
}
getBookList()
const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)

document.querySelector('.add-btn').addEventListener('click', () => {
  const addForm = document.querySelector('.add-form')
  const bookObj = serialize(addForm, { hash: true, empty: true })
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    method: 'post',
    data: {
      ...bookObj,
      creator
    }
  }).then(result => {
    console.log(result);
    getBookList()
    addForm.reset()
    addModal.hide()
  })
})

document.querySelector('.list').addEventListener('click', e => {
  if (e.target.classList.contains('del')) {
    const theId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
      method: 'delete'
    }).then(() => {
      getBookList()
    })
  }
})

const editDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editDom)

document.querySelector('.list').addEventListener('click', e => {
  if (e.target.classList.contains('edit')) {
    const theId = e.target.parentNode.dataset.id
    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
    }).then(result => {
      const bookObj = result.data.data
      const keys = Object.keys(bookObj)
      keys.forEach(key => {
        document.querySelector(`.edit-form .${key}`).value = bookObj[key]
      })
    })

    editModal.show()
  }
})
document.querySelector('.edit-btn').addEventListener('click', () => {
  const editForm = document.querySelector('.edit-form')
  const { id, bookname, author, publisher } = serialize(editForm, { hash: true, empty: true })

  axios({
    url: `http://hmajax.itheima.net/api/books/${id}`,
    method: 'put',
    data: {
      bookname,
      author,
      publisher,
      creator
    }
  }).then(() => {
    getBookList()
  })
  editModal.hide()
})