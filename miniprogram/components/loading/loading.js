// components/loading/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadModal:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },
  options: {
    styleIsolation: 'apply-shared', // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadProgress() {
      this.triggerEvent('loadProgress')
    },
    loadModal() {
      this.setData({
        loadModal: true
      })
    },
  }
})
