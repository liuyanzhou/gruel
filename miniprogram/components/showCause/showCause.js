// components/showCause/showCause.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classname: String,
    place: String,
    startsec: String,
    endsec: String,
    modalName: String,
    teachWeek: String,
    curWeek: String,
    startWeek: String,
    endWeek: String,
    teacher: String
  },
  options: {
    styleIsolation: 'apply-shared', // 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
  },
  /**
   * 组件的初始数据
   */
  data: {
    TabCur:0,
    multiIndex: [0, 0],
    multiArray: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal(e) {
      this.setData({
        modalName: null
      },()=>{
       setTimeout(()=>{
         this.triggerEvent('clearnClickInfo')
       },300)
      })
    },
    changeEdit() {
      this.setData({
        isEdit: !this.data.isEdit,
        isconfirm: true
      })
    },
    // 切换nav
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    },
    MultiChange(e) {
      console.log(e)
      this.setData({
        multiIndex: e.detail.value
      })
    },
    MultiColumnChange(e) {
      let data = {
        multiArray: this.properties.multiArray,
        multiIndex: this.properties.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      this.setData(data);
    },
    //  发送数据到云数据库
    sendMessage() {   
      this.triggerEvent('sendMessage', { teachWeek})
    },
    // 删除课程
    delClass() {
      this.triggerEvent('delClass')
    },
    // 防止冒泡
    stopHiden() {
      console.log('防止冒泡')
    }
  }
})
