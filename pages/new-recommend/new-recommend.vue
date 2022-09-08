<template>
	<view class="content">
	  <view class="container">
	    <view class="shadow"></view>
	    <view class="topBar" :style="{'height':(h + 44) + 'px','line-height':(2 * h + 44) + 'px'}">
	      <view class="iconfont icon-fanhui back" @tap.stop="backTo"/>
	      <view class="songName"></view>
	      <view class="back"></view>
	    </view>
	    <view class="date"><text style="font-size: 54rpx;padding: 0 20rpx">{{date.day}}</text>/{{date.month}}</view>
	    <view class="history">
	      <text>历史日推</text>
	    </view>
	    <image lazy-load class="top-back" :src="imgUrl" mode="widthFix"/>
	    <view class="song-content">
	      <view class="topbar">
	        <text class="iconfont icon-bofang2"></text>
	        <text class="play-title">播放全部</text>
	        <text class="play-count">({{dailySongs.length}})</text>
	      </view>
	      <scroll-view :class="{'scroll-content-min':showAudio,'scroll-content': !showAudio}"  scroll-y>
	        <block v-for="(item,index) in dailySongs" :key="item.id">
	          <view class="scroll-item" :data-id="item.id" :data-index="index" @tap.stop="chooseSong">
	            <image :src="item.al.picUrl" />
	            <view class="song-info">
	              <view class="song-title">{{item.name}}</view>
	              <view class="song-desc">
	                <view v-if="item.fee =='1'" class="symbol special">VIP</view>
	                <view v-if="item.fee =='1'" class="symbol">试听</view>
	                <view class="symbol" v-if="item.originCoverType == 1">独家</view>
	                <view class="symbol special" v-if="item.privilege.playMaxbr > 320000">SQ</view>
	                {{item.ar[0].name}} - {{item.al.name}}</view>
	            </view>
	            <!-- <view data-info="{{item}}" class="iconfont icon-gengduo" catchtap="openMenu"/> -->
	            <view :data-info="item" class="iconfont icon-gengduo"/>
	          </view>
	        </block>
	      </scroll-view>
	    </view>
	  </view>
	  <view class="pull" v-if="isShow" @tap.stop="closeMenu"/>
	  <view class="menu" :class="{'up':isShow, 'down':!isShow}">
	    111
	  </view>
	  <common-audio v-if="showAudio" class="audio"/>
	</view>
</template>

<script>
	import {getSongs} from "../../service/songs"
	import commonAudio from 'components/common-audio'
	const app = getApp()
	const month = ((new Date().getMonth())+1)<10? '0'+ (new Date().getMonth() + 1): (new Date().getMonth())+''
	const day = new Date().getDate()<10? '0'+new Date().getDate() :new Date().getDate() +''
	export default {
		components:{commonAudio},
		data() {
			return {
				h: '',
				date: {month, day},
				imgUrl: '',
				dailySongs: [],
				isShow: false,
				index: 0,
				showAudio: false,
			}
		},
		onLoad() {
			this.h = uni.getSystemInfoSync().statusBarHeight
			this._getSongs()
		},
		onShow() {
			if(app.globalData.id && app.globalData.playList.length > 0) {
				this.showAudio = true
			}
		},
		methods: {
			_getSongs() {
				getSongs().then(res => {
					const dailySongs = res.data.dailySongs
					const reasons = res.data.recommendReasons
					let data = dailySongs.find(ele => {
						return ele.id == reasons[0].songId
					})
					this.imgUrl = data.al.picUrl
					this.dailySongs = dailySongs
				})
			},
			// 歌曲详情弹框
			openMenu(e) {
				this.isShow = true
			},
			closeMenu() {
				this.isShow = false
			},
			// 播放器歌曲列表弹框
			openPlaylist() {
				this.showPlaylist = true
			},
			chooseSong(e) {
				let {id,index} = e.currentTarget.dataset
				app.globalData.index = index
				app.addSong(id)
				app.playList(this.dailySongs)
				uni.navigateTo({
					url: '/pages/song-play/song-play?id='+id,
				})
			},
			backTo() {
				uni.navigateBack()
			},
		}
	}
</script>

<style>
.content, .container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.shadow {
  position: absolute;
  width: 100%;
  height: 28vh;
  background-color: rgba(0,0,0,.2);
  z-index: 8;
}

.date {
  position: absolute;
  top: 14.5%;
  left: 40rpx;
  color: #fffafa;
  font-size: 36rpx;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  letter-spacing: 4rpx;
  z-index: 9;
}
.history {
  position: absolute;
  top: 20%;
  left: 30rpx;
  padding: 10rpx 30rpx;
  color: #333;
  height: 60rpx;
  z-index: 9;
  border-radius: 60rpx;
  box-sizing: border-box;
  background-color: #fffafa;
}

.container .top-back {
  width: 100%;
  transform: translateY(-20%);
  filter: blur(3rpx)
}
.container .song-content {
  position: absolute;
  top: 26vh;
  left: 0;
  width: 100%;
  height: 74vh;
  background-color: #fffafa;
  z-index: 9;
  padding: 20rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.topbar {
  height: 70rpx;
  line-height: 50rpx;
}
.icon-bofang2 {
  font-size: 40rpx;
  color: #bb2921;
}
.play-title {
  font-size: 36rpx;
  color: #333;
  font-weight: 550;
  padding: 0 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.play-count {
  color: #a3a3a3;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.scroll-content {
  height: calc(74vh - 100rpx);
}
.scroll-content-min {
  height: calc(74vh - 220rpx);
}
.scroll-item {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.scroll-item image{
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
}
.scroll-item .song-info {
  margin-left: 20rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 65%;
}
.song-info .song-title{
  font-size: 36rpx;
  color: #111;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.song-info .song-desc{
  font-size: 28rpx;
  color: #a3a3a3;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.song-info .song-desc .common {
  color: #ff7b00;
  margin-right: 5rpx;
}
.song-info .song-desc .bgimg {
  width: 60rpx;
  margin-right: 5rpx;
}
.icon-gengduo {
  font-size: 42rpx;
  color: #a3a3a3;
  line-height: 100rpx;
  padding: 0 20rpx;
}
.symbol {
  display: inline-block;
  font-size: 20rpx;
  height: 30rpx;
  line-height: 30rpx;
  color: #ff5100;
  border: 1rpx solid #ff5100;
  padding: 0 10rpx;
  border-radius: 6rpx;
  transform: scale(.8);
}
.special {
  transform: translateY(-4rpx) scale(.8);
  line-height: 28rpx;
}
/*  */

/* 全局覆盖 */
.pull {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 98;
}

/* 菜单 */
.menu {
  width: 100%;
  height: 400rpx;
  background-color: #fffafa;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  transition: all .5s;
}
/* 播放列表弹框 */
.play-list {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 800rpx;
  background-color: #fff;
  z-index: 100;
  transform: translateY(100%);
  transition: all .5s;
}
.up{
  transform: translateY(0);
}
.down{
  transform: translateY(100%);
}

</style>
