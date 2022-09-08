<template>
	<swiper class="swiper-list" next-margin="60rpx">
	  <block v-for="item in swiperList" :key="item.id">
	    <swiper-item :id="item.id" class="swiper-item" @tap.stop="chooseList">
	      <view class="item-cotent">
	        <view class="title-name">{{item.name}}
	          <text class="iconfont icon-gengduo2"></text>
	        </view>
	        <view class="rank-list">
	          <block v-for="(ranks,i) in item.tracks" :key="i" >
	            <view class="list-item">
	              <image lazy-load class="list-image" :src="ranks.al.picUrl"/>
	              <text class="count">{{i + 1}}</text>
	              <text class="count-name">{{ranks.name}} <text class="singer">- {{ranks.ar[0].name}}</text>
	              </text>
	            </view>
	          </block>
	        </view>
	      </view>
	    </swiper-item>
	  </block>
	</swiper>
</template>

<script>
	export default {
		props:{
			swiperList: {
				type: Array,
				value: []
			}
		},
		methods: {
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
.swiper-list {
  width: 100%;
  height: 490rpx;
}
.swiper-item {
  padding: 20rpx 40rpx 0 0;
  box-sizing: border-box;
}
.item-cotent {
  padding-top: 20rpx;
  padding-left: 20rpx;
  padding-bottom: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
}
.title-name {
  line-height: 60rpx;
  text-align: center;
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}
.rank-list {
  display: flex;
  flex-direction: column;
}
.list-item {
  display: flex;
  margin-top: 10rpx;
}
.list-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
}
.list-item text {
  line-height: 100rpx;
  font-size: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.count {
  width: 50rpx;
  text-align: center;
  font-weight: 600;
}
.count-name {
  flex:1;
  max-width: calc(100% - 200rpx);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.list-item .singer {
  font-size: 28rpx;
  color: #a5a5a5;
}

</style>
