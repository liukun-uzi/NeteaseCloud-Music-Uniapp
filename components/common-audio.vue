<template>
	<view class="container" @tap.stop="goSongPlay">
	  <view class="song-pic">
	    <image class="song-image" :src="songInfo.al.picUrl" mode="widthFix"/>
	  </view>
	  <view class="song-info">{{songInfo.name}}
	    <text class="singer"> - {{songInfo.ar[0].name}}</text>
	  </view>
	  <view class="iconfont" :class="{'icon-zanting1':isPlay,'icon-65zanting':!isPlay}" @tap.stop="play"/>
	  <view class="iconfont icon-xiayiqu101" @tap.stop="nextSong"/>
	</view>
</template>

<script>
	const app = getApp()
	import {getSongUrl,getSongDetail} from "../service/songs"
	export default {
		data() {
			return {
				//播放列表
				playList: [],
				songInfo: {},
				isPlay: false,
				pid: '',
				active: ''
			};
		},
		created() {
			getSongDetail(app.globalData.id).then(res => {
				this.playList = app.globalData.playList,
				this.songInfo = res.songs[0],
				this.isPlay = app.globalData.state,
				this.pid = app.globalData.pid,
				this.active = app.globalData.active
			})
			app.globalData.backgroundAudioManager.onEnded(() => {
				this.nextSong()
			})
			app.globalData.backgroundAudioManager.onPlay(()=>{
				this.isPlay = true
				app.globalData.backgroundAudioManager.play()
			})
			app.globalData.backgroundAudioManager.onPause(()=>{
				this.isPlay = false
				app.globalData.backgroundAudioManager.pause()
			})
			app.globalData.backgroundAudioManager.onStop(()=>{
				this.isPlay = false
				app.globalData.backgroundAudioManager.stop()
				app.globalData.backgroundAudioManager.currentTime = 0
				app.globalData.backgroundAudioManager.duration = 0
			})
		},
		methods: {
			play() {
				this.isPlay = !this.isPlay
				if(this.isPlay) {
					app.globalData.backgroundAudioManager.play()
				} else {
					app.globalData.backgroundAudioManager.pause()
				}
			},
			goSongPlay() {
				app.globalData.isSame = true
				if(this.active == '1') {
					uni.navigateTo({
						url: '/pages/song-play/song-play?active=1&pid='+this.pid,
					})
				} else {
					uni.navigateTo({
						url: '/pages/song-play/song-play?pid='+this.pid,
					})
				}
			},
			nextSong() {
				let id = app.getSong('next')
				getSongDetail(id).then(res => {
					this.songInfo = res.songs[0]
					getSongUrl(id).then(result => {
						app.globalData.backgroundAudioManager = uni.getBackgroundAudioManager()
						app.globalData.backgroundAudioManager.src = result.data[0].url
						app.globalData.backgroundAudioManager.title = this.songInfo.name
					})
				})
			}
		}
	}
</script>

<style>
.container {
  width: 100%;
  height: 62px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  padding: 10rpx 20rpx;
  box-sizing: border-box;
  border-top: 1rpx solid #e4e4e4;
}
.song-pic {
  position: relative;
  top: -6rpx;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid #dfdfdf80;
  box-shadow: 0 0 10rpx rgba(0,0,0,.3);
  animation: circle 10s linear infinite;
}
.song-pause {
  animation-play-state: paused;
}
.song-image {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%,-50%);
  width: 100%;
}
@keyframes circle {
  0% {
  }
  100% {
    transform: rotate(360deg);
  }
}
.song-info {
  flex: 1;
  margin-left: 20rpx;
  line-height: 90rpx;
  font-size: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.singer {
  font-size: 28rpx;
  color: #a3a3a3;
}
.iconfont {
  text-align: center;
  width: 80rpx;
  color: #8b8b8b;
  font-size: 54rpx;
  line-height: 90rpx;
  padding-left: 14rpx;
  padding-bottom: 8rpx;
}
</style>
