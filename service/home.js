import request from "./network"

export function getBannerData() {
  return request({
    url: '/banner'
  })
}
export function getRcommendList() {
  return request({
    url: '/personalized',
    data: {
      limit: 10
    }
  })
}
export function getRankList() {
  return request({
    url: '/toplist/detail',
  })
}
export function getPlaylistDetail(id, s =8) {
  return request({
    url: '/playlist/detail',
    data: {
      id: id,
      s: s
    }
  })
}
// 获取验证码
export function sendCaptcha(info) {
  return request({
    url: '/captcha/sent',
    data:{
      phone: info.phone,
    }
  })
}
// 用户登录
export function login(info) {
  return request({
    url: '/login/cellphone',
    data: info
  })
}
// 用户登录email
export function loginEmail(info) {
  return request({
    url: '/login',
    data:{
      email: info.email,
      password: info.password,
      islogin: info.islogin
    }
  })
}
//用户信息
export function userDetail(uid) {
  return request({
    url: '/user/detail',
    data:{
      uid: uid
    }
  })
}
export function getRecentPlayList(info) {
  return request({
    url: '/user/record',
    data:{
      uid: info.uid,
      type: info.type
    }
  })
}
export function getLevel() {
  return request({
    url: '/user/level',
  })
}


// 热搜榜
export function searchRecord() {
  return request({
    url: '/search/hot/detail',
  })
}
//键入搜索建议
export function searchSuggest(keywords, type = 'mobile') {
  return request({
    url: '/search/suggest',
    data: {
      keywords: keywords,
      type: type
    }
  })
}
// 搜索
export function search(keywords, limit = 20) {
  return request({
    url: '/search',
    data: {
      keywords: keywords,
      limit: limit
    }
  })
}