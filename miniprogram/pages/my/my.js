// miniprogram/pages/my/my.js
import { showToast } from '../../utils/loading.js'
let tempid = 'v74q-Z2GUac6sxKLs5NjcvdbICVTcH37-XqtvkJCUkA'
let openid = ''
const gruelClass = wx.cloud.database().collection('gruel-course')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheck:false,
    subNum:0
  },

  // 检测用户是否已经勾选了订阅功能
  detectionSub(successCallback, addNum) {
    // 得到用户对订阅消息的授权信息
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        console.log(res)
        let subInfo = res.subscriptionsSetting
        let { mainSwitch, itemSettings } = res.subscriptionsSetting
        // 用户已经开启订阅消息推送功能
        if (mainSwitch) {
          successCallback &&  successCallback()
          if (itemSettings) {
            let flag = itemSettings[tempid]
            if (flag == 'accept') {
              // 用户接受该推送模板
              console.log(itemSettings)
              addNum && addNum()
            } else if (flag == 'reject') {
              // 用户拒绝该推送模板
              showToast('请勾选上订阅功能')
            }
          }else {
            addNum && addNum()
          }
        } else {
          // 订阅消息总开关是关闭的
          showToast('请勾选上订阅功能')
        }
      }
    })
  },
// 添加订阅模板的次数
  addSubNum() {

    this.detectionSub(null,()=>{
       wx.requestSubscribeMessage({
        // 模板id 要和下面的云函数调用的模板id一致
        tmplIds: [tempid],
        success: (res) => {
          // 实现数据库subNum+1操作
          this.callCloudSubNum()
          wx.getSetting({
            withSubscriptions: true,
          })
        }
      })
    })
  },
// 调取云数据库给推送次数+1 
async callCloudSubNum() {
  let cloudUser = (await gruelClass.where({
    _openid:openid
  }).get()).data[0]
  let  subNum =  cloudUser['subNum'] || 1
  if (cloudUser['subNum']) {
    await gruelClass.where({
      _openid: openid
    }).update({
      data: {
        subNum: ++subNum
      }
    })
  }else {
    await gruelClass.where({
      _openid: openid
    }).update({
      data:{
        subNum: subNum
      }
    })
  }
this.setData({
  subNum: subNum
})
},
// 授权订阅功能
  async subscriptionInfo(e){
    this.detectionSub(()=>{
      this.setData({
        isCheck:true
      })
    },()=>{
      wx.requestSubscribeMessage({
        // 模板id 要和下面的云函数调用的模板id一致
        tmplIds: [tempid],
        success:()=>{
          // 实现数据库subNum+1操作
          this.callCloudSubNum()
        }
      })
    })

  },
  async sendMessage() {
    // 调用云函数
    let sendResult = await wx.cloud.callFunction({
      name: 'gruel_sendMessage',
    })
    console.log(sendResult)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async  function (options) {
    // 得到openid
    openid = wx.getStorageSync('openId')
    let showSubNum = (await gruelClass.where({
      _openid: openid
    }).get()).data[0]['subNum']
    this.setData({
      subNum: showSubNum
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 检测是否已经勾选
   this.detectionSub(()=>{
     this.setData({
       isCheck:true
     })
   })

    // 判断用于言责
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        curIndex: 3
      })
    }
  },
})