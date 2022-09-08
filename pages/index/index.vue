<template>
	<view class="container">
	  <view class="search-bar" @tap="search">
	    <view class="search">
	      <text class="iconfont icon-sousuo"></text>
	      搜索</view>
	  </view>
	  <scroll-view class="scroll-content" :class="{'scroll-content-min': showAudio}"  scroll-y>
	    <hdSwiper :banners="banners"></hdSwiper>
	    <hd-recommend></hd-recommend>
	    <recommend-list :recommendList="recommendList"></recommend-list>
	    <rank-list :rankList="rankList"></rank-list>
	  </scroll-view>
	  <common-audio v-if="showAudio" class="audio"/>
	</view>
</template>

<script>
	import hdSwiper from "components/hd-swiper"
	import hdRecommend from "components/hd-recommend"
	import recommendList from "components/recommend-list"
	import rankList from "components/rank-list"
	import commonAudio from "components/common-audio"
	import {getBannerData,getRcommendList,getPlaylistDetail} from "../../service/home"
	const app = getApp()
	export default {
		data() {
			return {
				ids: [{
					name: '飙升榜',
					id: 19723756,
				},{
					name: '新歌榜',
					id: 3779629
				},{
					name: '热歌榜',
					id: 3778678
				},{
					name: '原创榜',
					id: 2884035
				},{
					name: '云音乐电音榜',
					id: 1978921795,
				},{
					name: 'UK排行榜周榜',
					id: 180106,
				}],
				banners: [],
				recommendList: [],
				rankList: [],
				showAudio: false
			}
		},
		components: {
			hdSwiper,hdRecommend,recommendList,rankList,commonAudio
		},
		onLoad() {
			this._getBannerData()
			this._getRecommendList()
			this._getRankList()
		},
		onShow() {
			if(app.globalData.id && app.globalData.playList.length > 0) {
				this.showAudio = true
			}
		},
		methods: {
			search() {
				uni.navigateTo({
					url: '/pages/search/search',
				})
			},
			_getBannerData() {
				getBannerData().then(res => {
					this.banners = res.banners
				})
			},
			_getRecommendList() {
				getRcommendList().then(res => {
					this.recommendList = res.result
				})
			},
			_getRankList() {
			    let rankList = []
			    this.ids.forEach((ele,index) => {
			      getPlaylistDetail(ele.id).then(res => {
			        rankList.push({
			          id: ele.id,
			          name: ele.name,
			          picUrl: res.playlist.coverImgUrl,
			          tracks: res.playlist.tracks.slice(0,3)
			        })
							this.rankList= rankList
			      })
			    })
			  },
		}
	}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f5f5f5;
}
.search-bar {
  position: fixed;
	top: 0;
  width: 100%;
  height: 40px;
  background-color: #f5f5f5;
  padding: 5px 40rpx;
}
.search {
  background-color: #e7e7e7;
  font-size: 28rpx;
  height: 30px;
  line-height: 30px;
  color: #5c5c5c;
  text-align: center;
  border-radius: 30px;
}
.icon-sousuo {
  font-size: 36rpx;
}
.scroll-content {
  position: absolute;
  top: 40px;
  height: calc(100% - 40px);
}
.scroll-content-min {
  height: calc(100% - 102px);
}
</style>
