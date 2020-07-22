// miniprogram/pages/team/team.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:''
  },
  // 点击卡片弹出右侧模态框
  clickRightModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  hideModalShowImg(e) {
    console.log(e.currentTarget.dataset.target)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  changeEdit(e) {
  this.setData({
    modalName: e.currentTarget.dataset.target
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const syh = wx.getSystemInfoSync().windowHeight
    console.log(syh)
    this.setData({
      scrollHeight: syh
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        curIndex: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})