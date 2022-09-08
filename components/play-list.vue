<template>
	<scroll-view class="list-content" scroll-y>
		<block v-for="item in playList" :key="item.id">
			<view :id="item.id" class="list-item" @tap="chooseList">
				<image class="list-img" :src="item.coverImgUrl" mode="widthFix"/>
				<view class="desc">{{item.name}}</view>
			</view>
		</block>
	</scroll-view>
</template>

<script>
	export default {
		props: {
			playList: {
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
.list-content {
  width: 100%;
  height: calc(100% - 50rpx);
  padding: 20rpx;
  box-sizing: border-box;
}

.list-item {
	display: inline-block;
  width: 33.33333%;
  text-align: center;
  padding: 10rpx;
}
.list-img {
  width: 100%;
  border-radius: 10rpx;
}

.desc {
  font-size: 28rpx;
	height: 75rpx;
  text-align: left;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
