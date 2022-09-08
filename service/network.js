import { baseURL, timeout} from "./config"

function request(options, method='GET') {
  return new Promise((resolve, reject) => {
    wx.request({
			// #ifdef H5
      url: '/lmusic' + options.url,
			// #endif
			// #ifdef MP-WEIXIN
			url: baseURL + options.url,
			// #endif
      timeout: timeout,
      data: {
		...options.data,
		cookie: uni.getStorageSync('cookies')
	  },
      method: method,
      header: {
				'content-type': 'application/x-www-form-urlencoded;application/json;charset=UTF-8', 
				cookies: uni.getStorageSync('cookies')
      },
      success: function(res) {
        if(options.data && options.data.islogin) {
          uni.setStorage({
						data:res.data.cookie,
            key: 'cookies',
          })
        }
        resolve(res.data)
      },
      fail: reject,
      complete: res => {
      }
    })
  })
}

export default request;