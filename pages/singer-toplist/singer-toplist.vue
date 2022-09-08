<template>
	<view class="container">
	  <view class="topBar" :style="{'height':h+44+'px','line-height':2*h+44+'px'}">
	    <view class="iconfont icon-fanhui back" @tap="backTo"/>
	    <view class="songName">{{opcity < 0.35?artist.name:''}}</view>
	    <view class="back"/>
	  </view>
	  <view class="shadow"/>
	  <image class="back-img" :style="{opacity:opcity}" :src="artist.img1v1Url" mode="widthFix"/>
	  <scroll-view class="scroll-content" :style="scrollStyle" scroll-y enable-back-to-top scroll-with-animation @scroll="scroll">
	    <view class="song-content">
	      <view class="topbar">
	        <text class="iconfont icon-bofang2"></text>
	        <text class="play-title">热门歌曲</text>
	        <text class="play-count">({{hotSongs.length}})</text>
	      </view>
	      <view>
	        <block v-for="(item,index) in hotSongs" :key="item.id">
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
	          </view>
	        </block>
	      </view>
	    </view>
	  </scroll-view>
	  <common-audio v-if="showAudio" class="audio"/>
	</view>

</template>

<script>
	import commonAudio from 'components/common-audio'
	import {singerInfo} from "../../service/songs"
	const app = getApp()
	export default {
		components:{commonAudio},
		data() {
			return {
				h: '',
				scrollStyle: '',
				opcity: 1,
				id: "",
				artist: {},
				hotSongs: [],
				// 弹框组件控制
				isShow: false,
				index: 0,
				showAudio: false
			}
		},
		onLoad(option) {
			this.h = uni.getSystemInfoSync().statusBarHeight
			this.id = option.id
			this._singerInfo(this.id)
		},
		methods: {
			_singerInfo(id) {
				singerInfo(id).then(res => {
					this.artist = res.artist
					this.hotSongs = res.hotSongs
				})
			},
			chooseSong(e) {
				let {id,index} = e.currentTarget.dataset
				app.globalData.index = index
				app.addSong(id)
				app.playList(this.hotSongs)
				uni.navigateTo({
					url: '/pages/song-play/song-play?id='+ id,
				})
			},
			scroll(e) {
				let top = 220
				let scrollTop = e.detail.scrollTop
				if(scrollTop <= 150) {
					this.opcity = (top - scrollTop) / top
				}
			},
			backTo() {
				uni.navigateBack()
			},
		},
		onShow() {
			let h = this.h
			if(app.globalData.id && app.globalData.playList.length > 0) {
				this.scrollStyle = `height: calc(100% - ${h+44+62}px);top:${h+44}px;`
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
.back-img {
  width: 100%;
}
.scroll-content{
  position: absolute;
  top: 120rpx;
  width: 100%;
  z-index: 9;
}
/* 列表展示驱 */
.song-content {
  width: 100%;
  background-color: #fffafa;
  padding: 20rpx;
  margin-top: 170px;
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

.scroll-item {
  margin-top: 20rpx;
  display: flex;
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
  max-width: 85%;
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
.shadow {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.25);
  z-index: 2;
}
</style>
