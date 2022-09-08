<template>
	<view class="recommend">
		<block v-for="(item,index) in recommendList" :key="index" >
			<view :data-type="item.type" class="recommendList" @tap="openNew">
				<view class="icon iconfont" :class="item.icon"></view>
				<view class="text">{{item.text}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	const app = getApp()
	import {personal_fm} from '../service/songs'
	export default {
		data() {
			return {
				recommendList:[{
					icon: 'icon-meirinongshi',
					text: '每日推荐',
					type: 'recommend'
				},{
					icon: 'icon-sirenFM',
					text: '私人FM',
					type: 'FM'
				},{
					icon: 'icon-remengedanjingangqu',
					text: '歌单',
					type: 'songlist'
				},{
					icon: 'icon-paihang',
					text: '排行榜',
					type: 'ranklist'
				},{
					icon: 'icon-zhuanjis',
					text: '歌手',
					type: 'singer'
				}]
			};
		},
		methods: {
			openNew(e) {
				let type = e.currentTarget.dataset.type
				if(type == 'FM') {
					personal_fm().then(res => {
						const data = res.data
						app.globalData.index = 0
						app.addSong(data[0].id)
						app.playList(data)
						uni.navigateTo({
							url: '/pages/song-play/song-play?id=' + data[0].id,
						})
					})
				} else {
					uni.navigateTo({
						url: `/pages/new-${type}/new-${type}`,
					})
				}
			}
		}
	}
</script>

<style>
.recommend {
  display: flex;
  padding: 20rpx 10rpx 30rpx;
  border-bottom: 2rpx solid #e7e7e7;
}
.recommendList {
  width: 300rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.recommendList .icon {
  width: 100rpx;
  height: 100rpx;
  background-color: #fff3f3;
  box-shadow: inset 0 0 30rpx #ffe2e2;
  border-radius: 50%;
  color:#ff4f4f;
  text-align: center;
  font-size: 48rpx;
  font-weight: 500;
  line-height: 100rpx;
}
.recommendList .text {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #8a8a8a;
}
</style>
