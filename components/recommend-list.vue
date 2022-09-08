<template>
	<view class="recommend-list">
	  <hd-tip title="推荐歌单" tip="更多" @tap.stop="toList"></hd-tip>
	  <hd-scroll-list :scrollList="recommendList"></hd-scroll-list>
	</view>
</template>

<script>
	import hdTip from 'components/hd-tip'
	import hdScrollList from 'components/hd-scroll-list'
	export default {
		name:"recommend-list",
		components: {hdTip,hdScrollList},
		props: {
			recommendList: {
				type: Array,
				value: []
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			toList() {
				uni.navigateTo({
					url: '/pages/new-songlist/new-songlist',
				})
			}
		}
	}
</script>

<style>
.recommend-list {
  padding: 30rpx 20rpx;
  border-bottom: 20rpx solid #e7e7e7;
}
</style>
