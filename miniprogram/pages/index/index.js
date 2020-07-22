import { showToast } from '../../utils/loading.js'
let openId = ''
const app = getApp()
let curDay = ''
// 实例化数据库对象
const db = wx.cloud.database().collection('gruel-course')
// 云数据库上得到的数据
let cloudClasInfo = {}
Page({

/**
 * 页面的初始数据
 */
data: {
  // 模态框
  loadModal:true,
  classArr: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  classIndex:[1,3,5,7,9,11],
  // 随机颜色
  backgroudColor: ['rgba(38, 188, 95, .6)', 'rgba(217, 170, 92, .6)', 'rgba(253, 71, 93, .6)', 'rgb(18,175,244,.6)'],
  arrIndex: [],
  // 点击课程信息
  classname: '',
  place: '',
  startsec: '',
  endsec: '',
  startweek:'',
  endweek:'',
  teachweek:'',
  teacher:'',
  curWeek: 3,
  // 当前星期几
  day:1,
  isEdit:false,
  isconfirm:false,
  scrollHeight: 1000,
  course: { }
},

clickClass(e) {
  const { place, classname, startsec, endsec, teachweek, startweek, endweek, weekname, teacher } = e.currentTarget.dataset
  curDay = weekname
  this.setData({
    place,
    classname,
    startsec,
    endsec,
    startweek,
    endweek,
    teacher,
    teachWeek: teachweek,
    modalName: e.currentTarget.dataset.target
  })
},

MultiColumnChange(e) {
  let data = {
    multiArray: this.data.multiArray,
    multiIndex: this.data.multiIndex
  };
  data.multiIndex[e.detail.column] = e.detail.value;
  this.setData(data);
},
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  // 生成随机颜色
  this.getRandColor()
  // 得到设备屏幕可视高度
  this.getBottomNav()
  this.getOpenId()
  // 获取今天星期几
  let day = new Date().getDay()
  if (day == 0) {
    day = 7
  }
  this.setData({
    day
  })
},
  async getOpenId() {
    let openInfo = await wx.cloud.callFunction({
      name: 'login'
    })
    openId = openInfo.result.openid
    // 存储到本地存储中
    wx.setStorageSync('openId', openId)
  },
// 得到云数据库上的课表信息
  async getCloudClassInfo(){
    let cloudInfo = await db.get()

    if (cloudInfo.data.length >0) {
    cloudClasInfo = cloudInfo.data[0].course
    // 遍历组织数据 
    // 1.遍历周数
    let tempobj = {1:{},2:{},3:{},4:{},5:{},6:{}}
    let newObj = { 1: { ...tempobj }, 2: { ...tempobj }, 3: { ...tempobj }, 4: { ...tempobj }, 5: { ...tempobj }, 6: { ...tempobj }, 7: { ...tempobj}}

    let obj = {}
    let secInfo = ''
    let showCurWeek = this.data.curWeek
    for(let key in cloudClasInfo) {
      // 2.遍历节数
      for (let key2 in cloudClasInfo[key]) {
        // 3.遍历具体节数中的数据
        for (let i = 0; i < cloudClasInfo[key][key2].length;i++) {
           secInfo = cloudClasInfo[key][key2][i]
          if (secInfo['startWeek'] <= showCurWeek && secInfo['endWeek'] >= showCurWeek   ) {    
            newObj[key][parseInt(secInfo['endSec']) / 2] = secInfo
            obj = {}
          }
        }
       
      } 
    }
 
    this.setData({
      course: newObj
    },()=>{
      setTimeout(()=>{
       this.setData({
         loadModal: false
       })
      },300)
    })
    return 
    }

    this.setData({
      loadModal: false
    })
  },
// 得到底部导航栏高度
getBottomNav() {
  const syh = wx.getSystemInfoSync().windowHeight
  this.setData({
    scrollHeight: syh
  })
},
// 点击加号去往添加课程页面
toAddClass() {
  wx.navigateTo({
    url: '/pages/addClass/addClass',
  })
},
// 生成颜色随机数
getRandColor() {
  let sjArr = []
  let newArr = []
  for (let i = 0; i < this.data.classArr.length; i++) {
    for (let j = 0; j < this.data.classArr.length - 1; j++) {
      sjArr.push(Math.floor(Math.random() * (4 - 0)) + 0)
    }
    newArr.push(sjArr)
    sjArr = []
  }
  this.setData({
    arrIndex: newArr
  })
},
// 发送数据到云数据库存储
  sendMessage(e) {
    let causeInfo = {
      1: {
        couseName: '',
        teacher: '',
        teachWeek: '',
        place: '',
        startTime: '',
        endTime: ''
      }
    }
    console.log(e.detail.teachWeek)
  },
  // 清除点击态
  clearnClickInfo() {
  this.setData({
    teacher:null,
    classname: null,
    place: null,
    startsec: null,
    endsec: null,
    startweek: null,
    endweek: null,
    teachweek: null,
  })
  },

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {
  if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      curIndex: 2
    })
 
  }
  // 得到云数据库上的课表信息
  this.getCloudClassInfo()
},

// 点击切换周
// 上一周
  onPreWeek() {
    let newCurWeek = --this.data.curWeek
    if (newCurWeek>=1) {
      this.setData({
        curWeek: newCurWeek
      })
      this.getCloudClassInfo()
    }
  },
// 下一周
onNextWeek() {
  let newCurWeek = ++this.data.curWeek
  if (newCurWeek <= 25) {
    this.setData({
      curWeek: newCurWeek
    })
    this.getCloudClassInfo()
  }
},
// 删除课程
  async delClass() {
  let tempCourse = cloudClasInfo
    let { classname, startweek, endweek, startsec, endsec} =this.data
    let endSec = endsec / 2
    let index = ''
  //  1.定位到该数据上
  for(let key in tempCourse ) {
    if(key == curDay) {
      let  locClassArr = tempCourse[key][endSec]
        for(let i=0;i<locClassArr.length;i++) {
         for(let key2 in locClassArr[i]) {
           if (locClassArr[i]['className'] == classname && locClassArr[i]['startWeek'] == startweek && locClassArr[i]['endWeek'] == endweek && locClassArr[i]['startSec'] == startsec && locClassArr[i]['endSec'] == endsec  ) {
           index = i
           break
           }
         }
        }
    }
  }
    tempCourse[curDay][endSec].splice(index,1)
    let deleteInfo = await db.where({
      _openid: openId
    }).update({
      data: {
        course: tempCourse
      }
    })
    if (deleteInfo.errMsg =="collection.update:ok") {
      showToast('删除成功','success',()=>{
        this.getCloudClassInfo()
        this.clearnClickInfo()
        this.setData({
          modalName: null
        })
      })
      
    }
  }


})