<template>
	<view class="container">
	  <view class="topBar" :style="{'height':h+44+'px','line-height':2*h+44+'px'}">
	    <view class="back"/>
	    <view class="songName"></view>
	    <view class="back"/>
	  </view>
	  <image lazy-load  class="back-img" style="opacity: 0.9" :src="userInfo.backgroundUrl" mode="widthFix"/>
	  <scroll-view class="scroll-content" scroll-y :style="scrollStyle">
	    <view class="main">
	      <view class="content">
	        <view class="user">
	          <image lazy-load  :src="userInfo.avatarUrl" class="user-img" mode="widthFix"/>
	        </view>
	        <view>
	          <view class="user-name">{{userInfo.nickname}}</view>
	          <view class="user-follow">
	            <view>{{userInfo.follows}} <text style="color: #5c5c5c;"> 关注</text></view>
	            <view>{{userInfo.followeds}} <text style="color: #5c5c5c;"> 粉丝</text></view>
	            <view>Lv.{{level.level}}</view>
	          </view>
	          <view class="user-introduce">点击添加个人简介</view>
	        </view>
	      </view>
	
	      <view class="content content-music">
	        <view class="title">播放记录</view>
	        <view class="scroll-record">
	          <block v-for="item in recentPlayList" :key="item.song.id">
	            <view :id="item.song.id" class="scroll-item" @tap="chooseSong">
	              <image lazy-load  class="scroll-img" :src="item.song.al.picUrl"/>
	              <view class="desc">{{item.song.name}}</view>
	            </view>
	          </block>
	        </view>
	      </view>
	
	      <view :id="likes.id" class="content content-love" @tap="chooselist">
	        <image lazy-load  class="love-img" :src="likes.coverImgUrl" mode="widthFix"></image>
	        <view class="love-title">
	          <view>我喜欢的音乐</view>
	          <view class="love-count">{{likes.trackCount}}首</view>
	        </view>
	        <view class="active" @tap.stop="activePlay">心动模式</view>
	      </view>
	
	      <view class="content content-own" >
	        <view class="shoucang-title">收藏歌单({{own.length}}个)</view>
	        <block v-for="item in own" :key="item.id">
	          <view :id="item.id" class="own-item" @tap="chooselist">
	            <image lazy-load  class="love-img" :src="item.coverImgUrl" mode="widthFix"></image>
	            <view class="love-title">
	              <view class="love-name">{{item.name}}</view>
	              <view class="love-count">{{item.trackCount}}首</view>
	            </view>
	          </view>
	        </block>
	      </view>
	
	      <view class="loginOut" @tap="toLogin">退出登陆</view>
	    </view>
	  </scroll-view>
	  <common-audio v-if="showAudio" class="audio"/>
	</view>
</template>

<script>
	const app = getApp()
	import {getRecentPlayList,getLevel} from '../../service/home'
	import {getSongDetail,userPlayList,activeList,getSonglist} from '../../service/songs'
	import commonAudio from 'components/common-audio'
	export default {
		components:{commonAudio},
		data() {
			return {
				h: '',
				showAudio: false,
				scrollStyle: '',
				userInfo: {}, // 用户信息
				recentPlayList: [], // 用户播放记录
				level: {},
				likes: {},
				own: [],
			}
		},
		onLoad() {
			this.h = uni.getSystemInfoSync().statusBarHeight
			let userInfo = wx.getStorageSync('userInfo')
			if(userInfo) {
				this.userInfo = JSON.parse(userInfo)
				this._getRecentPlayList(1)
				this._getLevel()
				this._userPlayList(this.userInfo.userId)
			}
		},
		methods: {
			_userPlayList(id) {
				userPlayList(id).then(res => {
					const own = res.playlist
					this.likes = res.playlist[0]
					this.own = own.slice(1)
				})
			},
			_getLevel() {
				getLevel().then(res => {
					this.level = res.data
				})
			},
			_getRecentPlayList(type) {
				let params = {
					uid: this.userInfo.userId,
					type: type
				}
				getRecentPlayList(params).then(res => {
					this.recentPlayList = res.weekData
				})
			},
			chooseSong(e) {
				let id = e.currentTarget.id
				app.addSong(id)
				getSongDetail(id).then(res => {
					app.playList(res.songs)
				})
				uni.navigateTo({
					url: '/pages/song-play/song-play?id=' + id,
				})
			},
			toLogin() {
				uni.reLaunch({
					url: '/pages/login/login',
				})
			},
			chooselist(e) {
				let id = e.currentTarget.id
				uni.navigateTo({
					url: '/pages/song-list/song-list?id=' + id,
				})
			},
			activePlay() {
				let pid = this.likes.id
				getSonglist(pid).then(res => {
					let index = Math.floor(Math.random() * 172)
					let id = res.playlist.tracks[index].id
					activeList(pid,id).then(res => {
						app.globalData.index = -1
						app.addSong(id)
						app.playList(res.data)
						uni.navigateTo({
							url: '/pages/song-play/song-play?active=1&pid='+pid,
						})
					})
				})
			},
		},
		onShow() {
			let h = this.h
			if(app.globalData.id && app.globalData.playList.length > 0) {
				this.scrollStyle = `height: calc(100% - ${h+44+60}px);top:${h+44}px;`
				this.showAudio = true
			} else {
				this.scrollStyle = `height: calc(100% - ${h+44}px);top:${h+44}px;`
			}
		}
	}
</script>

<style>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #e5e5e5;
}
.back-img {
  width: 100%;
}

.scroll-content{
  position: absolute;
  top: 90px;
  width: 100%;
  height: 87%;
  z-index: 9;
  box-sizing: border-box;
}
.main {
  position: relative;
  width: 100%;
  min-height: calc(100% - 360rpx);
  top: 360rpx;
  box-sizing: border-box;
  background-color: #e5e5e5;
  padding: 0 4%;
}
.content{
  position: absolute;
  top: -40rpx;
  width: 92%;
  height: 260rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  padding: 80rpx 40rpx 20rpx;
  text-align: center;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
}

.user {
  position: absolute;
  top: -70rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 6rpx;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background-color: #fff;
}
.user-img {
  width: 100%;
  border-radius: 50%;
}
.user-name {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
}
.user-follow {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 120rpx;
  font-size: 26rpx;
  color: #333;
}
.user-introduce {
  font-size: 26rpx;
  color: #5c5c5c;
}
/*  */
.content-music {
  position: relative;
  top: 250rpx;
  width: 100%;
  height: auto;
  box-shadow: none;
  padding: 20rpx;
}
.title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
  text-align: left;
}

.scroll-record {
  width: 100%;
  height: 260rpx;
  display: flex;
  margin-top: 20rpx;
	overflow: auto;
}
.scroll-item {
  width: 180rpx;
  margin-right: 20rpx;
}
.scroll-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 20rpx;
  box-shadow: 10rpx 10rpx 10rpx rgba(0,0,0,0.1);
}
.desc {
  font-size: 24rpx;
  text-align: left;
  color: #5c5c5c;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.music-box {
  display: flex;
  justify-content: space-between;
}

.content-love {
  padding: 20rpx;
  display: flex;
  position: relative;
  top: 250rpx;
  width: 100%;
  margin-top: 30rpx;
  height: auto;
  text-align: left;
}
.love-img {
  width: 140rpx;
  border-radius: 20rpx;
}
.love-title {
  flex: 1;
  max-width: 75%;
  padding-left: 40rpx;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 2;
  color: #333;
}
.love-count {
  font-size: 28rpx;
  color: #5c5c5c;
  font-weight: normal;
}
.content-own {
  padding: 20rpx;
  position: relative;
  top: 250rpx;
  width: 100%;
  margin-top: 30rpx;
  height: auto;
  text-align: left;
}
.shoucang-title {
  font-size: 28rpx;
  color: #5c5c5c;
}
.own-item {
  display: flex;
  margin-top: 20rpx;
}

.love-count, .love-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.active {
  margin-top: 40rpx;
  height: 54rpx;
  padding: 7rpx 20rpx;
  font-size: 28rpx;
  border-radius: 27rpx;
  border: 1rpx solid #e1e1e1;
}

.loginOut {
  position: relative;
  margin-top: 60rpx;
  margin-bottom: 40rpx;
  top: 250rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  text-align: center;
  line-height: 80rpx;
  font-size: 36rpx;
  color: #fa1919;
  border-radius: 30rpx;
  background-color: #fff;
  box-shadow: 0 10rpx 20rpx rgba(0,0,0,0.1);
}
/*  */

</style>
