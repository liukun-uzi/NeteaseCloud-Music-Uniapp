<template>
	<view class="rank-content">
	  <hd-tip title="排行榜" tip="更多" @tap.stop="toList"></hd-tip>
	  <swiper-list :swiperList="rankList"></swiper-list>
	</view>
</template>

<script>
	import hdTip from 'components/hd-tip'
	import swiperList from 'components/swiper-list'
	export default {
		components:{hdTip,swiperList},
		props:{
			rankList: {
				type: Array,
				value: []
			}
		},
		methods: {
			toList() {
				uni.navigateTo({
					url: '/pages/new-ranklist/new-ranklist',
				})
			}
		}
	}
</script>

<style>
.rank-content {
  padding: 30rpx 20rpx;
  border-bottom: 20rpx solid #e7e7e7;
}
</style>
