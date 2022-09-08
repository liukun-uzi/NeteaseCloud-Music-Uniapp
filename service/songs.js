import request from "./network"
// 每日推荐
export function getSongs() {
  return request({
    url: '/recommend/songs'
  })
}
export function getSongUrl(id) {
  return request({
    url: '/song/url',
    data: {
      id: id
    }
  })
}
export function getSongLyric(id) {
  return request({
    url: '/lyric',
    data: {
      id: id
    }
  })
}

// 歌单
export function getNavList() {
  return request({
    url: '/playlist/highquality/tags',
  })
}
// 歌单类型
export function getPlayList(params) {
  return request({
    url: '/top/playlist/highquality',
    data: {
      cat: params.tag,
      limit: 21,
      before: params.before
    }
  })
}
// 歌单列表
export function getSonglist(id, s = 8) {
  return request({
    url: '/playlist/detail',
    data: {
      id: id,
      s: s
    }
  })
}
// 获取单个歌曲详情接口
export function getSongDetail(ids) {
  return request({
    url: '/song/detail',
    data: {
      ids: ids,
    }
  })
}
// 热门歌手
export function getTopSingers() {
  return request({
    url: '/toplist/artist',
  })
}
// 获取歌手分类
export function getSingers(params) {
  return request({
    url: '/artist/list',
    data: {
      ...params,
      limit: 10
    }
  })
}
// 关注
export function followSub(params) {
  return request({
    url: '/artist/sub',
    data: {
      ...params
    }
  })
}
// 歌手部分信息和热门歌曲
export function singerInfo(id) {
  return request({
    url: '/artists',
    data: {
      id: id
    }
  })
}

// fm
export function personal_fm(id) {
  return request({
    url: '/personal_fm',
  })
}
// 用户歌单
export function userPlayList(id) {
  return request({
    url: '/user/playlist',
    data: {
      uid: id
    }
  })
}
// 心动模式
export function activeList(pid, id) {
  return request({
    url: '/playmode/intelligence/list',
    data: {
      pid: pid,
      id: id
    }
  })
}
