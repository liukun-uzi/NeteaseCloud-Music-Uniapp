<template>
	<view class="container">
	  <view class="rank-content">
	    <view class="title">
	      <image class="title-img" src="../../static/images/logo.png" mode="widthFix"></image>
	      官方榜</view>
	    <block v-for="item in gList" :key="item.id">
	      <view :id="item.id" class="rank-item" @tap="chooseList">
	        <view class="rank-image">
	          <view class="gf-tip">{{item.updateFrequency}}</view>
	          <image class="rank-img" :src="item.coverImgUrl" mode="widthFix"/>
	        </view>
	        <view class="rank-list">
	          <block v-for="(t,index) in item.tracks" :key="t.id">
	            <view class="list-info">
	              <text class="count">{{index + 1}}. </text>
	              <text>{{t.first}}<text class="singer"> - {{t.second}}</text></text>
	            </view>
	          </block>
	        </view>
	      </view>
	    </block>
	  </view>
	  <view class="qf-content">
	    <view class="title">曲风榜</view>
	    <view class="rank-qufeng">
	      <block v-for="item in list" :key="item.id">
	        <view :id="item.id" class="list-item" @tap="chooseList">
	          <view class="gf-tip rank-tip">{{item.updateFrequency}}</view>
	          <image class="image" :src="item.coverImgUrl" mode="widthFix"/>
	          <view class="desc">{{item.name}}</view>
	        </view>
	      </block>
	    </view>
	  </view>
	  <view class="qf-content">
	    <view class="title">全球榜</view>
	    <view class="rank-qufeng">
	      <block v-for="item in worldList" :key="index">
	        <view :id="item.id" class="list-item" @tap="chooseList">
	          <view class="gf-tip rank-tip">{{item.updateFrequency}}</view>
	          <image class="image" :src="item.coverImgUrl" mode="widthFix"/>
	          <view class="desc">{{item.name}}</view>
	        </view>
	      </block>
	    </view>
	  </view>
	</view>
</template>

<script>
	import {getRankList} from "../../service/home"
	export default {
		data() {
			return {
				ids: [1978921795,71385702,991319590,5059633707,5059661515,10520166,71384707,5059642708],
				ids1: [60198,180106,11641012,60131,27135204,2809577409,2809513713,5059644681,745956260],
				gList: [],
				list: [],
				worldList: []
			}
		},
		onLoad() {
			this._getRanks()
		},
		methods: {
			_getRanks() {
				getRankList().then(res => {
					const gList = res.list.slice(0,4)
					let list = []
					let worldList = []
					this.ids.forEach(ele => {
						try {
							res.list.forEach(item => {
								if(ele == item.id) {
									list.push(item)
									throw new Error('EndIterative')
								}
							})
						} catch(e) {
							if(e.message != 'EndIterative') throw e
						}
					})
					this.ids1.forEach(ele => {
						try {
							res.list.forEach(item => {
								if(ele == item.id) {
									worldList.push(item)
									throw new Error('EndIterative')
								}
							})
						} catch(e) {
							if(e.message != 'EndIterative') throw e
						}
					})
					this.gList = gList
					this.list = list
					this.worldList = worldList
				})
			},
			_getRankList() {
				getRankList().then(res => {
					const rankList = res.list
				})
			},
			chooseList(e) {
				let id = e.currentTarget.id
				uni.navigateTo({
					url: '/pages/song-list/song-list?id=' + id,
				})
			}
		}
	}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
}
.rank-content {
  padding: 10rpx 40rpx 30rpx;
  border-bottom: 20rpx solid #f2f2f2;
}
.qf-content {
  padding: 10rpx 30rpx 30rpx;
}
.title {
  font-size: 34rpx;
  line-height: 50rpx;
  color: #333;
  font-weight: 600;
}
.title-img {
  width: 50rpx;
  vertical-align: middle;
	margin-right: 10rpx;
}
.rank-item {
  display: flex;
  padding: 20rpx 0;
}
.gf-tip {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  font-size: 20rpx;
  height: 28rpx;
  line-height: 28rpx;
  border-radius: 30rpx;
  color: #fff;
  padding: 0 10rpx;
  background-color: rgba(0,0,0,0.1);
}
.rank-image {
  width: 30%;
  position: relative;
}
.rank-img {
  width: 100%;
  border-radius: 10rpx;
}
.rank-list {
  padding: 10rpx 0rpx 10rpx 20rpx;
  flex: 1;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.list-info {
  font-size: 32rpx;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.count {
  font-weight: 600;
}
.singer {
  font-size: 28rpx;
  color: #5c5c5c;
}
/* 曲风榜 */
.qf-content .title {
  padding-left: 10rpx;
}
.rank-qufeng {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.list-item {
  width: 33.3333%;
  padding: 10rpx;
  position: relative;
}
.rank-tip {
  top: 20rpx;
  right: 20rpx;
}
.image {
  width: 100%;
  border-radius: 20rpx;
}
.desc {
  font-size: 28rpx;
  color: #5c5c5c;
}
</style>
