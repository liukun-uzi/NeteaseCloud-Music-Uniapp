<template>
	<view class="container">
	  <view class="search-bar">
	    <view class="search">
	      <text class="iconfont icon-sousuo"></text>
	      <input class="search-text" type="text" placeholder="搜索歌曲"
	      @confirm="search" @input="input"/>
	    </view>
	  </view>
	
	  <view class="search-list" v-if="show == '0'">
	    <view class="title">热搜榜</view>
	    <block v-for="(item,index) in hotSearch" :key="index">
	      <view :data-name="item.searchWord" class="search-item" @tap="searchWord">
	        <view class="count" :class="{'top3':index<3}">{{index + 1}}</view>
	        <view class="info">
	          <view class="name">{{item.searchWord}}
	            <image v-if="item.iconUrl" class="name-img" :src="item.iconUrl" mode="heightFix"/>
	          </view>
	          <view class="desc">{{item.content}}</view>
	        </view>
	        <view class="score">{{item.score}}</view>
	      </view>
	    </block>
	  </view>
	
	  <view class="search-list" v-else-if="show == '1'">
	    <block v-for="(item,index) in searchSuggest" :key="index">
	      <view :data-name="item.keyword" class="list-item" @tap="searchWord">
	        <text class="iconfont icon-sousuo"></text>
	        {{item.keyword}}
	      </view>
	    </block>
	  </view>
	
	 <view class="search-list" v-else>
	   <block v-for="(item,index) in searchInfo" :key="item.id">
	      <view :data-id="item.id" :data-index="index" class="result-item" @tap="chooseSong">
	        <view class="result-title">{{item.name}}</view>
	        <view class="desc">
	          <view v-if="item.fee =='1'" class="symbol special">VIP</view>
	          <view v-if="item.fee =='1'" class="symbol">试听</view>
	          <view class="symbol special" v-if="item.album.status == 0 && item.album.size < 14">SQ</view>
	          {{item.artists[0].name}} - {{item.album.name}}</view>
	      </view>
	    </block>
	  </view>
	</view>
</template>

<script>
	import {searchRecord,searchSuggest,search} from '../../service/home'
	const app = getApp()
	export default {
		data() {
			return {
				show: '0',
				hotSearch: [],
				searchSuggest: [],
				searchInfo: []
			}
		},
		onLoad() {
			this._searchRecord()
		},
		methods: {
			_searchRecord() {
				searchRecord().then(res => {
					this.hotSearch = res.data
				})
			},
			input(e) {
				let value = e.detail.value
				if(value) {
					searchSuggest(value).then(res => {
						this.searchSuggest = res.result.allMatch
						this.show = '1'
					})
				} else {
					this.show = '0'
				}
			},
			searchWord(e) {
				let value = e.currentTarget.dataset.name
				search(value).then(res => {
					this.searchInfo = res.result.songs
					this.show = '2'
				})
			},
			search(e) {
				let value = e.detail.value
				search(value).then(res => {
					this.searchInfo = res.result.songs
					this.show = '2'
				})
			},
			chooseSong(e) {
				let {id,index} = e.currentTarget.dataset
				app.globalData.index = index
				app.addSong(id)
				app.playList(this.searchInfo)
				uni.navigateTo({
					url: '/pages/song-play/song-play?id='+ id,
				})
			}
		}
	}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
.icon-sousuo {
  font-size: 22px;
  color: #5c5c5c;
  padding-right: 10px;
}
.search-bar {
  position: fixed;
  width: 100%;
  height: 40px;
  padding: 5px 40rpx;
  background-color: #fff;
  z-index: 9;
}
.search {
  display: flex;
  height: 30px;
  background-color: #f5f5f5;
  border-radius: 30px;
  padding: 5px 10px;
}

.search-text {
  font-size: 28rpx;
}

/* 热搜榜 */
.search-list {
  position: absolute;
  width: 100%;
  top: 40px;
  color: #333;
  padding: 20rpx 40rpx;
}
.title {
  font-weight: 600;
}

.search-item {
  height: 90rpx;
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}
.count {
  width: 60rpx;
  line-height: 90rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #5c5c5c;
}
.top3 {
  color: #ee4e45;
}
.info {
  flex: 1;
  max-width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.name, .desc {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}
.name-img {
  height: 30rpx;
}
.desc {
  font-size: 24rpx;
  color: #5c5c5c;
  font-weight: normal;
}
.score {
  width: 100rpx;
  line-height: 90rpx;
  font-size: 24rpx;
  color: #a1a1a1;
  text-align: center;
}

.list-item {
  height: 80rpx;
  color: #5c5c5c;
}

/* 搜索记录 */
.result-item {
  height: 100rpx;
  margin-bottom: 20rpx;
}
.result-title {
  color: #333;
  line-height: 60rpx;
}
.desc {
  font-size: 24rpx;
  color: #5c5c5c;
}
.result-title,.desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

</style>
