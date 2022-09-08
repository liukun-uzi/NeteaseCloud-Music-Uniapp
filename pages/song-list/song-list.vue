<template>
	<view class="container">
	  <view class="topBar" :style="{'height':h+44+'px','line-height':2*h+44+'px'}">
	    <view class="iconfont icon-fanhui back" @tap.stop="backTo"/>
	    <view class="songName">歌单</view>
	    <view class="back"/>
	  </view>
	  <view class="shadow"/>
	  <image class="back-img" :src="songList.coverImgUrl || 'https://p2.music.126.net/VFd5cboNTbnYsWZ5DBn9bg==/18953381440004340.jpg'" mode="widthFix"/>
	  <scroll-view class="scroll-content" :style="scrollStyle" scroll-y @scrolltolower="loadmore">
	    <view class="top-content">
	      <image class="top-image" :src="songList.coverImgUrl" 
	      mode="widthFix"/>
	      <view class="top-info">
	        <view class="title">{{songList.name}}</view>
	        <view class="creator">
	          <image class="creator-img" v-if="songList.creator" :src="songList.creator.avatarUrl" mode="widthFix"/>
	          <text class="creator-name" v-if="songList.creator">{{songList.creator.nickname}}</text>
	        </view>
	        <view class="info">{{songList.description || ''}}</view>
	      </view>
	    </view>
	    <view class="song-content">
	      <view class="topbar">
	        <text class="iconfont icon-bofang2"></text>
	        <text class="play-title">播放全部</text>
	        <text class="play-count">({{trackIds.length}})</text>
	      </view>
	      <view>
	        <block v-for="(item,index) in tracks" :key="item.id">
	          <view class="scroll-item" :data-id="item.id" :data-index="index" @tap="chooseSong">
	            <text class="song-number">{{index + 1}}</text>
	            <view class="song-info">
	              <view class="song-title">{{item.name}}</view>
	              <view class="song-desc">
	                <view v-if="item.fee =='1'" class="symbol special">VIP</view>
	                <view v-if="item.fee =='1'" class="symbol">试听</view>
	                <view class="symbol" v-if="item.originCoverType == 1">独家</view>
	                <view class="symbol special" v-if="item.privilege.playMaxbr > 320000">SQ</view>
	                {{item.ar[0].name}} - {{item.al.name}}</view>
	            </view>
	            <view :data-info="item" class="iconfont icon-gengduo" @tap.stop="openMenu"/>
	          </view>
	        </block>
	        <!-- <view wx:if="{{trackIds.length>69}}" class="scroll-tip">更多内容请前往网易云手机app</view> -->
	      </view>
	    </view>
	  </scroll-view>
	  <view class="pull" v-if="isShow" @tap="closeMenu"/>
	  <view class="menu" :class="{'up':isShow, 'down':!isShow}">
	    <view class="menu-top">
	      <image class="menu-pic" :src="songInfo.al && songInfo.al.picUrl" mode="widthFix"/>
	      <view class="menu-content">
	        <view class="menu-title">{{songInfo.name}}</view>
	        <view class="menu-zhuanji">专辑 - {{songInfo.al && songInfo.al.name}}</view>
	        <view :id="songInfo.ar[0].id" class="menu-singer">{{songInfo.ar[0] && songInfo.ar[0].name}}</view>
	      </view>
	    </view>
	  </view>
	  <common-audio v-if="showAudio" class="audio"/>
	</view>
</template>

<script>
	import {getSonglist, getSongDetail} from '../../service/songs'
	import commonAudio from 'components/common-audio'
	const app = getApp()
	export default {
		components:{commonAudio},
		data() {
			return {
				h:'',
				scrollStyle: '',
				id: 2201879658,
				songList: {},
				tracks: [],
				trackIds: [],
				// 弹框组件控制
				isShow: false,
				index: 0,
				showAudio: false,
				// 弹框信息
				songInfo: {}
			}
		},
		onLoad(options) {
			this.h = uni.getSystemInfoSync().statusBarHeight
			this.id = options.id || '',
			this._getSonglist()
		},
		methods: {
			_getSonglist() {
				getSonglist(this.id).then(res => {
					this.songList = res.playlist
					this.trackIds = this.songList.trackIds
					this._getSongDetail(this.songList.trackIds)
				})
			},
			_getSongDetail(trackIds) {
				let ids = []
				trackIds.forEach(ele => {
					ids.push(ele.id)
				})
				ids = ids.join(',')
				getSongDetail(ids).then(res => {
					this.tracks = res.songs
				})
			},
			loadmore() {
				console.log('11111');
			},
			backTo() {
				uni.navigateBack()
			},
			// 歌曲详情弹框
			openMenu(e) {
				this.songInfo = e.currentTarget.dataset.info
				this.isShow = true
			},
			closeMenu() {
				this.isShow = false
			},
			chooseSong(e) {
				let {id,index} = e.currentTarget.dataset
				app.globalData.index = index
				app.addSong(id)
				app.playList(this.tracks)
				uni.navigateTo({
					url: '/pages/song-play/song-play?pid='+ this.id,
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
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.shadow {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.2);
  z-index: 2;
}
.back-img {
  width: 100%;
  transform: scale(2.6);
  filter: blur(30rpx);
}
.scroll-content{
  position: absolute;
  top: 120rpx;
  width: 100%;
  z-index: 9;
}
.top-content {
  width: 100%;
  height: 340rpx;
  display: flex;
  padding:40rpx;
}
.top-image {
  width: 240rpx;
  border-radius: 20rpx;
}

.top-info {
  flex: 1;
  padding-left: 40rpx;
  font-size: 32rpx;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.creator {
  padding: 20rpx 0;
}
.creator-img {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  box-shadow: 0 0 10rpx rgba(0,0,0,0.3);
  vertical-align: middle;
}
.creator-name {
  padding-left: 20rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}
.info {
  font-size: 24rpx;
  overflow : hidden;
  color: rgba(236, 236, 236, 0.5);
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/* 列表展示区 */
.song-content {
  width: 100%;
  background-color: #fffafa;
  padding: 20rpx;
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
  color: #5c5c5c;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 28rpx;
}

.scroll-item {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}
.song-number {
  width: 80rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 40rpx;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: rgba(100, 98, 98, 0.8);
}
.scroll-item .song-info {
  margin-left: 20rpx;
  flex: 1;
  max-width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.scroll-tip {
  text-align: center;
  line-height: 120rpx;
  height: 110rpx;
  color: #a0a0a0;
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
  color: #5c5c5c;
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
  color: #5c5c5c;
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
  /* transform: translateY(-4rpx) scale(.8);
  line-height: 28rpx; */
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
  padding: 40rpx;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  box-shadow: 0 0 20rpx rgba(0,0,0,0.3);
}
.menu-top {
  display: flex;
  width: 100%;
  height: 200rpx;
}

.menu-pic {
  width: 200rpx;
}
.menu-content {
  flex: 1;
  padding-left: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.menu-title {
  font-size: 40rpx;
  color: #333;
}
.menu-zhuanji {
  font-size: 38rpx;
  color: #999;
}
.menu-singer {
  font-size: 32rpx;
  color: #5c5c5c;
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
.noUrl {
  color: #ececec;
}



</style>
