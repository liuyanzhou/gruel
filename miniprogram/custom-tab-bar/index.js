// components/bottom/bottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },
  options: {
    styleIsolation: 'apply-shared', // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
  },
  /**
   * 组件的初始数据
   */
  data: {
    curIndex:2,
    color: "#7A7E83",
    selectedColor: "#39b54a"
  },

  properties: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    togger(e) {
      wx.switchTab({
        url: e.currentTarget.dataset.src,
      })
      this.setData({
        curIndex: e.currentTarget.dataset.index,
      }) 
    }
  }
})
