<template>
	<view class="scroll-content__list">
		<block v-for="item in scrollList" :key="item.id">
			<view :id="item.id" class="scroll-item" @tap="chooseList">
				<image lazy-load class="scroll-img" :src="item.picUrl"/>
				<view class="desc">{{item.name}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		props:{
			scrollList: {
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
.scroll-content__list {
  padding-top: 10rpx;
	width: 100%;
  height: 300rpx;
  display: flex;
	overflow: auto;
}
.scroll-item {
  padding-top: 10rpx;
  width: 200rpx;
  margin-right: 20rpx;
}
.scroll-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
  box-shadow: 5rpx -5rpx 10rpx rgba(0,0,0,.1);
}

.desc {
  font-size: 24rpx;
  color: #5c5c5c;
  display:block/inline-block;
  width: 200rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
