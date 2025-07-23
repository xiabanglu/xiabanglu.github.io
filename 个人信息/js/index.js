const creator = '播仔'
axios({
  url: 'http://hmajax.itheima.net/api/settings',
  params: {
    creator
  }
}).then(result => {
  const userObj = result.data.data
  Object.keys(userObj).forEach(key => {
    if (key === 'avatar') {
      document.querySelector('.prew').src = userObj[key]
    } else if (key === 'gender') {
      const gRadioList = document.querySelectorAll('.gender')
      const gNum = userObj[key]
      gRadioList[gNum].checked = true
    } else {
      document.querySelector(`.${key}`).value = userObj[key]
    }
  })
})
document.querySelector('.upload').addEventListener('change', e => {
  const fd = new FormData()
  fd.append('avatar', e.target.files[0])
  fd.append('creator', creator)
  axios({
    url: 'http://hmajax.itheima.net/api/avatar',
    method: 'PUT',
    data: fd
  }).then(result => {
    const imgUrl = result.data.data.avatar
    document.querySelector('.prew').src = imgUrl
  })
})
document.querySelector('.submit').addEventListener('click', () => {
  const userForm = document.querySelector('.user-form')
  const userObj = serialize(userForm, { hash: true, empty: true })
  userObj.creator = creator
  userObj.gender = +userObj.gender
  axios({
    url: 'http://hmajax.itheima.net/api/settings',
    method: 'PUT',
    data: userObj
  }).then(() => {
    const toastDom = document.querySelector('.my-toast')
    const toast = new bootstrap.Toast(toastDom)
    toast.show()
  })
})