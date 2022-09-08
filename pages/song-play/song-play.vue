<template>
	<view class="back-content">
		<image class="blur" :src="songInfo.al && songInfo.al.picUrl" mode="widthFix"/>
	  <view class="container" @tap="closeList">
	    <view class="topBar" :style="{'height':(h + 44) + 'px','line-height':(2 * h + 44) + 'px'}">
	      <view class="iconfont icon-fanhui back" @tap="backTo"/>
	      <view class="songName">{{songInfo.name || '暂无数据'}}</view>
	      <view class="back"></view>
	    </view>
	    <view class="content-image" :style="{'top':h+50+'px'}">
	      <view class="circle-button"></view>
	      <image class="needle" :class="{'play':isPlay}" src="../../static/images/song/needle.png" mode="widthFix"/>
	      <view class="disc-content">
	        <image class="disc" src="../../static/images/song/disc.png" mode="widthFix"/>
	        <view class="song-back">
	          <image class="songback-img" :src="songInfo.al && songInfo.al.picUrl" mode="widthFix"/>
	        </view>
	      </view>
	    </view>
	    <!-- 歌词展示 -->
	    <scroll-view class="lyric-content" scroll-y 
	    scroll-anchoring scroll-with-animation :scroll-top="marginTop">
	      <view v-if="songInfo.fee == 1" class="none-lyric">VIP试听中</view>
	      <view class="content-text" v-else>
	        <block v-for="(item,index) in lyric" :key="index">
	          <view class="lyric-item" :class="{'currentTime':currentIndex == index}">{{item[1]}}</view>
	        </block>
	        <view v-if="!!lyric" class="none-lyric">暂无歌词</view>
	      </view>
	    </scroll-view>
	
	    <!-- 进度条 -->
	   <view class="progress" @touchend="changeProgress">
	      <text>{{ct}}</text>
	      <view class="progress-line">
	        <view class="progress-active" :style="{'width': progress + '%'}"></view>
	      </view>
	      <text>{{dt}}</text>
	    </view>
	    <!-- 控制区 -->
	    <view class="footer">
	      <view class="iconfont" :class="circleType" @tap.stop="changeCircleType"></view> 
	      <view class="iconfont icon-shangyiqu101" id="pre" @tap.stop="switchSong"></view>
	      <view class="play-button" @tap.stop="play">
	        <text class="iconfont" :class="{'icon-zanting':isPlay,'icon-bofang1':!isPlay}"></text>
	      </view>
	      <view class="iconfont icon-xiayiqu101" id="next" @tap.stop="switchSong"></view>
	      <view class="iconfont icon-caidan" @tap.stop="openList"></view>
	    </view>
	  </view>
	
	  <view class="play-list" :class="{'up':isShow,'down':!isShow}">
	    <view class="play-list__title">播放列表<text class="play-count">({{playList.length || 0}})</text></view>
	    <scroll-view scroll-y class="scroll-list__content" :scroll-top="index * 40">
	      <view style="height: 900rpx">
	        <block v-for="(item,index) in playList" :key="item.id">
	          <view class="scroll-list__item" :id="index" :data-info="item.id" @tap="chooseSong">
	            <text class="song-number">{{index + 1}}</text>
	            <text v-if="item.id == songInfo.id" class="iconfont icon-zhengzaibofang"></text>
	            <text class="play-list__songname" :class="{'playing':item.id == songInfo.id}">{{item.name || item.songInfo.name}}{{item.alia[0]? '('+item.alia[0]+')': ''}}</text>
	            <text class="play-list__singer" :class="{'playing':item.id == songInfo.id}"> - {{item.ar[0].name || item.artists[0].name || item.songInfo.ar[0].name}}</text>
	          </view>
	        </block>
	      </view>
	    </scroll-view>
	  </view>
	</view>

</template>

<script>
	const app = getApp()
	import moment from 'moment'
	import {getSongUrl, getSongLyric,getSonglist,getSongDetail,activeList} from '../../service/songs'
	let time = null
	export default {
		data() {
			return {
				h: '',
				pid: '',
				//播放列表
				playList: [],
				isShow: false,
				songInfo: {},
				index:'',
				isPlay: true,
				musicSrc: '',
				//播放进度控制
				progress: 0,
				ct: '00:00',
				dt: '00:00',
				// 播放进度跳转
				width: 0,
				offsetLeft: 0,
				// 循环播放
				circleType: 'icon-xunhuan', 
				//歌词
				lyric: [],
				marginTop: 0,
				currentIndex: 0,
			}
		},
		onLoad(option) {
			this.h = uni.getSystemInfoSync().statusBarHeight
			this.pid = option.pid || ''
			if(option.active == '1') {
				this.circleType = 'icon-B'
			}
			if(app.globalData.isSame) {
				if(app.globalData.backgroundAudioManager.src && app.globalData.backgroundAudioManager.title) {
					getSongDetail(app.globalData.id).then(res => {
						this.dt = moment(res.songs[0].dt).format('mm:ss')
						this.songInfo = res.songs[0]
						this.playList = app.globalData.playList
					})
					app.globalData.backgroundAudioManager.play()
				} else {
					getSongDetail(app.globalData.id).then(res => {
						this.dt = moment(res.songs[0].dt).format('mm:ss')
						this.songInfo = res.songs[0]
						this.playList = app.globalData.playList
						this._getUrl(app.globalData.id)
					})
				}
			} else {
				app.globalData.backgroundAudioManager = uni.getBackgroundAudioManager()
				getSongDetail(app.globalData.id).then(res => {
					this.dt = moment(res.songs[0].dt).format('mm:ss')
					this.songInfo = res.songs[0]
					this.playList = app.globalData.playList
					this._getUrl(app.globalData.id)
				})
			}
			// 获取歌词
			this._getSongLyric(app.globalData.id)
			app.globalData.backgroundAudioManager.onPrev(() => {
				this.changeSong('pre')
			})
			app.globalData.backgroundAudioManager.onNext(() => {
				this.changeSong('next')
			})
			app.globalData.backgroundAudioManager.onEnded(() => {
				this.circlePlay()
			})
			app.globalData.backgroundAudioManager.onPlay(()=>{
				this.isPlay =true
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
			//播放音乐
			app.globalData.backgroundAudioManager.onTimeUpdate((e)=> {
				let self = this
				let ct = moment(app.globalData.backgroundAudioManager.currentTime * 1000).format('mm:ss')
				let index = 1
				if(self.currentIndex >= index) {
					self.marginTop = (self.currentIndex - index) * 28
				}
				if(ct !== self.ct) {
					let progress = ((app.globalData.backgroundAudioManager.currentTime) / (self.songInfo.dt/1000))*100
					self.ct = ct
					this.progress = progress
					if(self.lyric.length !== 0 && self.songInfo.fee !== 1) {
						self.lyricProgressUpdate()
					}
				}
			})
			//拿到进度条的宽度
			let obj = wx.createSelectorQuery()
			obj.select('.progress-line').boundingClientRect((rec) => {
				this.offsetLeft = rec.left,
				this.width = rec.width
			})
			obj.exec()
		},
		
		methods: {
			backTo() {
				uni.navigateBack()
			},
			//获取歌词
			_getSongLyric(id) {
				getSongLyric(id).then(res => {
					if(res.lrc && res.lrc.lyric) {
						this.lyric = this.sliceNull(this.parseLyric(res.lrc.lyric))
					}
				})
			},
			//歌词处理
			parseLyric(text) {
				let result = []
				let lines = text.split('\n')
				let pattern = /\[\d{2}:\d{2}.\d+\]/g
				if(!pattern.test(lines[0])) {
					lines = lines.slice(1);
				}
				lines[lines.length - 1].length === 0 && lines.pop();
				lines.forEach((ele, index, arr) => {
					var time = ele.match(pattern)
					var value = ele.replace(pattern, '');
					time.forEach((e,i,a) => {
						var t = e.slice(1, -1).split(':');
						result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
					})
				})
				result.sort(function (a, b) {
					return a[0] - b[0];
				});
				return result;
			},
			sliceNull(lrc) {
				var result = []
				for (var i = 0; i < lrc.length; i++) {
					if (lrc[i][1] == "") {
					} else {
						result.push(lrc[i]);
					}
				}
				return result
			},
			//歌词进度更新处理
			lyricProgressUpdate() {
				let self = this
				if(self.currentIndex != self.lyric.length - 1) {
					for(let j = self.currentIndex; j< self.lyric.length - 1; j++) {
						if(self.currentIndex == self.lyric.length - 2) {
							if (parseFloat(app.globalData.backgroundAudioManager.currentTime + 1) > parseFloat(self.lyric[self.lyric.length - 1][0])) {
								self.currentIndex = self.lyric.length - 1
								return;
							}
						} else {
							if (parseFloat(app.globalData.backgroundAudioManager.currentTime + 1) >= parseFloat(self.lyric[j][0]) && parseFloat(app.globalData.backgroundAudioManager.currentTime + 1) < parseFloat(self.lyric[j + 1][0])) {
								self.currentIndex = j
								return;
							}
						}
					}
				}
			},
			_getUrl(id) {
				getSongUrl(id).then(res => {
					const musicSrc = res.data[0].url
					if(musicSrc) {
						this.musicSrc = musicSrc
						app.globalData.backgroundAudioManager = uni.getBackgroundAudioManager()
						// app.globalData.backgroundAudioManager = uni.createInnerAudioContext()
						app.globalData.backgroundAudioManager.autoplay = true
						app.globalData.backgroundAudioManager.coverImgUrl = this.songInfo.al.picUrl
						app.globalData.backgroundAudioManager.title = this.songInfo.name
						app.globalData.backgroundAudioManager.src = this.musicSrc
						app.globalData.backgroundAudioManager.play()
					} else {
						this.musicSrc = ''
						time = setTimeout(() => {
							this.changeSong('next')
						}, 3000)
					}
				})
			},
			circlePlay() {
				if(this.circleType == 'icon-xunhuan' || this.circleType == 'icon-B') {
					this.changeSong('next')
				} else {
					app.globalData.backgroundAudioManager.src = this.musicSrc
					app.globalData.backgroundAudioManager.title = this.songInfo.name
				}
			},
			play() {
				this.isPlay = !this.isPlay
				this.musicControl(this.isPlay)
			},
			musicControl(isPlay) {
				if(isPlay) {
					if(app.globalData.backgroundAudioManager.src) {
						app.globalData.backgroundAudioManager.play()
					} else {
						app.globalData.backgroundAudioManager.src = this.musicSrc
						app.globalData.backgroundAudioManager.title = this.songInfo.name
					}
				} else {
					app.globalData.backgroundAudioManager.pause()
				}
			},
			//切换歌曲播放模式
			changeCircleType() {
				if(this.circleType == 'icon-xunhuan') {
					var circleType= 'icon-xunhuan1'
				} else if(this.circleType == 'icon-xunhuan1') {
					if(this.pid) {
						var circleType= 'icon-B'
						activeList(this.pid,this.songInfo.id).then(res => {
							this.playList = res.data
							app.globalData.index = -1
							app.playList(this.playList)
						})
					} else {
						var circleType= 'icon-xunhuan'
					}
				} else {
					var circleType = 'icon-xunhuan'
					getSonglist(this.pid).then(res => {
						const songList = res.playlist
						let ids = []
						songList.trackIds.forEach(ele => {
							ids.push(ele.id)
						})
						ids = ids.join(',')
						getSongDetail(ids).then(t => {
							this.playList = t.songs
							app.globalData.index = -1
							app.playList(this.playList)
						})
					})
				}
				this.circleType = circleType
			},
			//切换歌曲
			changeSong(type) {
				clearTimeout(time)
				getSongDetail(app.getSong(type)).then(res => {
					this.getSongInfo(res.songs[0])
				})
			},
			//歌曲播放函数
			async getSongInfo(info) {
				await this._getSongLyric(info.id)
				await this._getUrl(info.id)
				 this.dt = moment(info.dt).format( 'mm:ss')
				 this.songInfo = info
				 this.marginTop = 0
				 this.currentIndex = 0
				 this.lyric = []
			},
			switchSong (e) {
				let type = e.currentTarget.id 
				this.changeSong(type)
			},
			// 点击改变进度条
			changeProgress(e) {
				let self = this
				let current = e.changedTouches[0].pageX - this.offsetLeft
				if(current > 0 && current < this.width) {
					let progress = current / this.width
					let currentTime = app.globalData.backgroundAudioManager.duration * progress
					for(let i = 0; i < self.lyric.length - 1; i++) {
						if(currentTime >= parseFloat(self.lyric[i][0]) && currentTime < parseFloat(self.lyric[i + 1][0])) {
							self.currentIndex = i,
							self.progress= progress * 100,
							self.isPlay= true
							break
						}
					}
					app.globalData.backgroundAudioManager.seek(currentTime)
					app.globalData.backgroundAudioManager.play()
				}
			},
		
			// 播放列表
			openList() {
				this.isShow = true
				this.index = app.globalData.index > 4? app.globalData.index-4:0
			},
			closeList() {
				this.isShow = false
			},
			// 选择某一首歌
			chooseSong(e) {
				app.globalData.index = e.currentTarget.id
				let id = e.currentTarget.dataset.info
				getSongDetail(id).then(res => {
					this.getSongInfo(res.songs[0])
				})
			},
		},
		onShow: function() {
			this.marginTop = 0
			this.currentIndex = 0
		},
		onUnload: function() {
			if(this.circleType == 'icon-B') {
				app.globalData.active = '1'
			} else {
				app.globalData.active = '0'
			}
			app.globalData.pid = this.pid
			app.globalData.state = this.isPlay
			app.globalData.id = this.songInfo.id
		}
	}
</script>

<style>
.iconfont {
  font-size: 50rpx;
  text-align: center;
  width: 100rpx;
  color: #fff;
  font-weight: 400;
}

.back-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.blur {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%,-50%) scale(2.5);
  filter: blur(25rpx);
}
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 2;
  background-color:rgba(0, 0, 0, 0.2);
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
}
.topBar .songName {
  flex: 1;
  overflow:hidden;
  text-align: center;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.topBar .back{
  position: relative;
  z-index: 9;
  width: 195rpx;
  text-align: left;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.icon-fanhui{
  font-size: 40rpx;
}
/* 下面图片 */
.content-image {
  position: absolute;
  top: 100px;
  left: 0;
  width: 100%;
  height: 340px;
  z-index:9;
}
.circle-button {
  position: absolute;
  top: 0;
  left: 52%;
  transform: translateX(-50%);
  background-color: #dddddd;
  z-index: 9;
  width: 55rpx;
  height: 55rpx;
  border-radius: 50%;
  box-shadow: 0 0 8rpx rgba(0,0,0,.1);
}
.circle-button::before {
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    display: block;
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    background-color: #c0c0c0;
}
.needle {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  transform: rotate(-40deg);
  transform-origin: 5rpx 5rpx;
  z-index: 3;
  transition: all 0.3s linear;
}
.play {
  transform: rotate(-5deg);
}
.disc-content {
  position: absolute;
  width: 100%;
  height: 75vw;
  top: 60px;
  left: 0;
  animation: circle 10s .3s linear infinite;
}
.disc-pause {
  animation-play-state: paused;
}
.disc {
  position: absolute;
  top: 0;
  left: 50%;
  width: 75vw;
  transform: translateX(-50%);
}
.song-back {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 47vw;
  height: 47vw;
  overflow: hidden;
  border-radius: 50%;
}
.songback-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 100%;
}
@keyframes circle
{
  0% {}
  100% {transform: rotate(360deg);}
}
/* 进度条 */
.progress {
  position: absolute;
  bottom: 160rpx;
  left: 0;
  width: 100%;
  height: 60rpx;
  padding: 0 40rpx;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
}
.progress text {
  padding: 5rpx;
  font-size: 24rpx;
  line-height: 40rpx;
  color: rgba(255, 251, 251, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.progress .progress-line {
  position: relative;
  flex: 1;
  height: 4rpx;
  background-color:#ffffff4d;
  margin: auto 10rpx;
  margin-top: 22rpx;
}
.progress-active {
  position: absolute;
  top: 0;
  left: 0;
  height: 4rpx;
  background-color: #fff;
}
.progress-active::after {
  content: '';
  position: absolute;
  width: 24rpx;
  height: 24rpx;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  border-radius: 50%;
  background-color: #f2f2f2;
}
/* 控制区 */
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 160rpx;
  display: flex;
  justify-content: space-between;
  line-height: 120rpx;
  padding: 10rpx 40rpx;
  box-sizing: border-box;
	z-index: 99;
}

.play-button {
  position: relative;
  top: 6%;
  width: 100rpx;
  height: 100rpx;
  border: 3rpx solid #fff;
  border-radius: 50%;
}

.icon-bofang1, .icon-zanting {
  position: absolute;
  line-height: 100rpx;
}

.icon-bofang1 {
  left: 5%;
}

/* 歌词部分 */
.lyric-content {
  position: absolute;
  bottom: 280rpx;
  text-align: center;
  width: 100%;
  height: 84px; 
}
.content-text {
  width: 100%;
  height: 100vh;
}
.lyric-item {
  width: 100%;
  height: 28px;
  line-height: 28px;
  color: #ffffff80;
  font-size: 30rpx;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.currentTime{
  color: #fff;
}

.none-lyric{
  color: #ffffff80;
  font-size: 40rpx;
  line-height: 170rpx;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 播放列表框 */
.play-list {
  width: 100%;
  height: 800rpx;
  background-color: #fff;
  position: absolute;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  bottom: 0;
  left: 0;
  z-index: 99;
  transform: translateY(100%);
  transition: all .5s;
  box-sizing: border-box;
  padding: 10px;
  padding-bottom: 5px;
}
.up{
  transform: translateY(0);
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.2);
}
.down{
  transform: translateY(100%);
}
.icon-zhengzaibofang {
  font-size: 28rpx;
  line-height: 40px;
  color: #d84519;
  padding: 0 5px;
}

.play-list__title, .play-list__songname {
  font-size: 36rpx;
  line-height: 40px;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.play-count {
  padding: 18rpx;
  font-size: 28rpx;
  color: #5c5c5c;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.song-number {
  display: inline-block;
  font-size: 30rpx;
  color: #5c5c5c;
  width: 60rpx; 
  text-align: left;
}
.play-list__title{
  font-weight: 550;
  padding: 0 20rpx;
}
.scroll-list__content {
  height: 680rpx;
}
.scroll-list__item {
  padding: 0 15px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.play-list__singer {
  font-size: 28rpx;
  color: #5c5c5c;
}
.playing {
  color: #d84519;
}


</style>
