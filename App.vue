<script>
	import {getOpenId,login, loginEmail,userDetail} from "./service/home"
	export default {
		onLaunch: function() {
			let isLogin = !!(wx.getStorageSync('cookies')) && !!(wx.getStorageSync('userInfo'))
			this.globalData.isLogin = isLogin
			if(!isLogin) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			addSong(id) {
				if(this.globalData.id && this.globalData.id == id) {
					this.globalData.isSame = true
				} else {
					this.globalData.isSame = false
					this.globalData.backgroundAudioManager = {}
					this.globalData.id = id
				}
			},
			playList(arr) {
				this.globalData.playList = arr
			},
			getSong(type) {
				if(this.globalData.playList.length > 1) {
					if(type == 'next') {
						this.globalData.index >= this.globalData.playList.length -1? this.globalData.index = 0: this.globalData.index ++
					} else {
						this.globalData.index <= 0?this.globalData.index = this.globalData.playList.length -1: this.globalData.index --
					}
				} else {
					this.globalData.index = 0
				}
				let id = this.globalData.playList[this.globalData.index].id
				this.globalData.id = id
				return id
			},
		},
		globalData:{
			//是否登陆
			isLogin: false,
			// 播放列表
			playList: [],
			index: 0,
			state: false,
			isSame: false,
			id: '',
			pid: '',
			active: '',
			backgroundAudioManager:{},
		}
	}
</script>

<style>
	@import './static/iconfont/iconfont.css';
	/*每个页面公共css */
	page {
	  height: 100%;
	  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	  box-sizing: border-box;
	}
	view {
	  box-sizing: border-box;
	  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}
	.topBar {
	  display: flex;
	  justify-content: space-between;
	  position: fixed;
	  top: 0;
	  width: 100%;
	  height: 130rpx;
	  left: 0;
	  font-size: 34rpx;
	  line-height: 165rpx;
	  color: #fff;
	  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	  z-index: 99;
	}
	
	/* 自定义navigation */
	.topBar .songName {
	  flex: 1;
	  overflow:hidden;
	  text-align: center;
	}
	.topBar .back{
	  width: 195rpx;
	  text-align: left;
	  padding: 0 20rpx;
	  box-sizing: border-box;
	}
	
	/* 全局播放器 */
	.audio {
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	  z-index: 88;
	}
</style>
