<template>
	<view class="container">
	  <view class="top-filter-content">
	    <view class="filter">
	      <block v-for="item in areaList" :key="item.id">
	        <view :id="item.id" data-type="area" class="tag" :class="{'select':item.id==area}" @tap="filter">{{item.name}}</view>
	      </block>
	    </view>
	    <view class="filter">
	      <block v-for="item in typeList" :key="item.id">
	        <view :id="item.id" data-type="type" class="tag" :class="{'select':item.id==type}" @tap="filter">{{item.name}}</view>
	      </block>
	    </view>
	  </view>
	  <view class="title">热门歌手</view>
	  <scroll-view class="scroll-content" scroll-y lower-threshold="150" @scrolltolower="loadmore">
	    <block v-for="item in singerList" :key="item.id">
	      <view :id="item.id" class="scroll-item" @tap="toSinger">
	        <view class="singer-img">
	          <image lazy-load class="img" :src="item.img1v1Url" mode="widthFix"/>
	        </view>
	        <view class="singer-name">{{item.name}}
	          <text class="ENG-name">{{item.trans?'('+item.trans+')':(item.alias[0]?'('+item.alias[0]+')':'')}}</text>
	        </view>
	        <view :id="index" :data-info="item" class="singer-shoucang" :class="{'followed':item.followed}" @tap="follow">
	          <text class="iconfont" :class="{'icon-dui':item.followed,'icon-jia':!item.followed}"></text> 关注</view>
	      </view>
	    </block>
	  </scroll-view>
	</view>

</template>

<script>
	import {getSingers,followSub} from "../../service/songs"
	export default {
		data() {
			return {
				areaList: [{
					name: '华语',
					id: '7'
				},{
					name: '欧美',
					id: '96'
				},{
					name: '日本',
					id: '8'
				},{
					name: '韩国',
					id: '16'
				},{
					name: '其他',
					id: '0'
				}],
				typeList: [{
					name: '男',
					id: '1'
				},{
					name: '女',
					id: '2'
				},{
					name: '乐队/组合',
					id: '3'
				}],
				area: '',
				type:'',
				offset: 0,
				singerList: []
			}
		},
		onLoad() {
			this._getSingers({initial:-1,offset: 0})
		},
		methods: {
			_getSingers(params) {
				getSingers(params).then(res => {
					this.singerList = res.artists
				})
			},
			filter(e) {
				let id = e.currentTarget.id
				let type = e.currentTarget.dataset.type
				if(!this.area && !this.type) {
					if(type == 'area') {
						this.area = id
						this.type = '1'
						this.offset = 0
					} else{
						this.area = '7'
						this.type = id
						this.offset = 0
					}
				} else {
					if(type == 'area') {
						this.area = id
						this.offset = 0
					} else{
						this.type = id
						this.offset = 0
					}
				}
				this._getSingers({area:this.area,type:this.type,initial:-1,offset: 0})
			},
			follow(e) {
				let info = e.currentTarget.dataset.info
				let t = info.followed?0:1
				let singerList = this.singerList
				singerList[e.currentTarget.id].followed = !info.followed
				this.singerList = singerList
				followSub({id:info.id,t})
			},
			toSinger(e) {
				let id = e.currentTarget.id
				uni.navigateTo({
					url: '/pages/singer-toplist/singer-toplist?id='+id
				})
			},
			loadmore() {
				this.offset = this.offset + 1
				getSingers({area:this.area,type:this.type,initial:-1,offset: this.offset * 10}).then(res => {
					let singerList = this.singerList
					res.artists.forEach(ele => {
						singerList.push(ele)
					})
					this.singerList = singerList
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

.top-filter-content {
  padding: 40rpx;
}
.filter {
  display: flex;
  line-height: 60rpx;
}

.tag {
  font-size: 34rpx;
  color: #505050;
  min-width: 80rpx;
  margin-right: 50rpx;
}
.select {
  color: #d33b32;
}
.title {
  line-height: 1.8;
  padding: 0 40rpx;
  color: #505050;
  background-color: #f2f2f2;
}

.scroll-content {
  width: 100%;
  height: calc(100% - 256rpx);
}
.scroll-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  line-height: 100rpx;
}
.singer-img {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;
}
.singer-img>.img {
  width: 100%;
}
.singer-name {
  padding-left: 40rpx;
  flex: 1;
  font-size: 32rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ENG-name {
  color: #505050;
}
.singer-shoucang {
  margin-left: 20rpx;
  font-size: 28rpx;
  height: 50rpx;
  line-height: 50rpx;
  color:  #f33100;
  padding: 0 14rpx;
  border: 1rpx solid #f33100;
  border-radius: 50rpx;
  margin-top: 25rpx;
}
.followed {
  color: #505050;
  border-color: #bbb;
}
</style>
