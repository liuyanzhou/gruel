import { showToast } from '../../utils/loading.js'
// 定义课名
let className = ''
// 定义选择周数后得到周数
let startWeek = '4'
let endWeek = '5'
// 定义填写教室
let place = ''
// 定义选择节数后得到数据
let curWeek = '1'
let startSec = '1'
let endSec = '2'
let teacher = ''
// 存储openid
let openId = ''
// 判断数据是否重复添加表示
let isAdd = null
// 存放云数据库上的数据临时地址
let tempArr = null
// 实例化数据库对象
const db = wx.cloud.database().collection('gruel-course')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
    ],
    multiWeekIndex: [0, 0],
    selectSectionArr: [
      ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      ['1', '3',  '5',  '7', '9', '11'],
      [ '2',  '4',  '6',  '8', '10',  '12']
    ],
    selectSectionArrIndex: [0, 0, 0]
  },
  // 选择周数
  MultiWeekChange(e) {
    this.setData({
      multiWeekIndex: e.detail.value
    },()=>{
      let { multiArray, multiWeekIndex} = this.data
      startWeek= multiArray[0][multiWeekIndex[0]]
      console.log(startWeek)
      endWeek =   multiArray[1][multiWeekIndex[1]]
    })
  },
  MultiColumnWeekChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiWeekIndex: this.data.multiWeekIndex
    };
    data.multiWeekIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  // 选择节数
  MultiSecChange(e) {
    this.setData({
      multiSecIndex: e.detail.value
    },()=>{
      let { selectSectionArr, selectSectionArrIndex} = this.data
      curWeek = selectSectionArrIndex[0] + 1
      startSec =    selectSectionArr[1][selectSectionArrIndex[1]] 
      endSec =   selectSectionArr[2][selectSectionArrIndex[2]]
    })
  },
  selectSection(e) {
    let data = {
      selectSectionArr: this.data.selectSectionArr,
      selectSectionArrIndex: this.data.selectSectionArrIndex
    };
    data.selectSectionArrIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  // 给表单元素绑定数据用于同步
  changeClassName(e) {
    className =  e.detail.value
  },
  changePlace(e) {
    place = e.detail.value
  },
  changeTeacher(e) {
    teacher = e.detail.value
  },
  // 添加课程信息
  async addClassInfo() {
    if (className == '' || place == '' || teacher =='' ) {
      showToast('请将信息填写完整')
      return 
    }


    let objInfo = {
      [curWeek] :{
      [endSec / 2] : [
        {
          className,
          place,
          startWeek,
          endWeek,
          startSec,
          endSec,
          teacher
          }
      ]
      }
    }

    // 得到云数据库中是否存在改数据
     let isCz =  await db.where({
       _openid: openId
     }).get()
    //  用户已经添加在云数据库上添加过数据
    if (isCz.data.length > 0 ) {
      // 进入这里证明云数据库已经创建了该用户的课表 我们要对其进行其他判断
      // 1.先判断该星期是否已经存在 不存在则创建 存在则往数组添加对象
       tempArr = isCz.data[0].course
      isAdd =  this.forClassInfo(tempArr)
      console.log(isAdd)

    // 添加数据操作如果该条数据并不和数据库数据冲突就添加
    if(isAdd) {
      //将数据转换为正确的数据结构 
      this.formatClassInfo(tempArr, objInfo)
      console.log(tempArr)
      let updataInfo = await db.where({
        _openid: openId
      }).update({
        data:{
          course: tempArr
        }
      })
      showToast('添加成功','success',()=>{
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/index/index',
          })
        },500)
      })
    }else {
      showToast('存在同周同节课现象')
    }

    }else {
    // 添加
     let addInfo =  await db.add({
       data:{
         course: objInfo
       }
    })
      showToast('添加成功', 'success')
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 得到openId
    this.getOpenId()
  },
//  得到openid
  async getOpenId() {
     let openInfo =  await wx.cloud.callFunction({
      name:'login'
    })
     openId = openInfo.result.openid
    // 存储到本地存储中
    wx.setStorageSync('openId', openId)
  },
  // 遍历判断课程信息是否重复
  forClassInfo(tempArr) {
    // 得到每周课程
    for (let key in tempArr) {
      // 变量每周课程的具体节课
      for (let key2 in tempArr[key]) {
        // 得到每个星期的课程信息
        let specificArr = tempArr[key][key2]
        // 遍历每周课程的具体节课的数组得到该节课下的不同周的课程
        for (let i = 0; i < specificArr.length; i++) {
          // 遍历课程的信息
          for (let key3 in specificArr[i]) {
            if (key3 == 'startSec') {
              // 1. 判断现添加的数据在同周下是否存在
              if (startSec == specificArr[i]['startSec'] && endSec == specificArr[i]['endSec'] && curWeek == key   && startWeek <= specificArr[i]['endWeek']  ) {
                return false
              }
            }   
          }
        }
      }
    }
    return true
  },
  // 格式化数据
  formatClassInfo(cloudInfo, objInfo) {
    // 1. 判断周存在否，存在则判断是那节课 该节课已创建则push进数组，若该节课不存在则创建新课
    // 定义是否已经存在标识
    let isWeekExist = false
    let isSecExist = false
    // 判断周是否存在
    for (let key in cloudInfo) {
      if (key == curWeek ) {
        isWeekExist = true
        break
      }
    }
  // 判断节是否存在
    if (isWeekExist) {
      for (let key in cloudInfo[curWeek]) {
        if(key == endSec/2) {
          isSecExist = true
          break
        }
      }
    }

    // 组织数据
    // 1.周不存在的情况
    if (!isWeekExist) {
              let newInfo = {
          [curWeek]: {
            [endSec/2]: [
              {
                className,
                place,
                startWeek,
                endWeek,
                startSec,
                endSec,
                teacher
              }
            ]
          }
        }

        tempArr = { ...tempArr, [curWeek]:newInfo[curWeek]}
        return
    }
    // 2.周存在节存在
    if(isWeekExist && isSecExist) {
      let tempClass = cloudInfo[curWeek][endSec/2]
      tempClass.push(objInfo[curWeek][endSec/2][0])
      tempArr[curWeek][endSec/2] = tempClass
      return 
    }
    // 3.周存在节不存在 
    if(isWeekExist && !isSecExist) {
      let tempClass = cloudInfo[curWeek]
      console.log(objInfo[curWeek][endSec/2])
      tempClass[endSec / 2] = [objInfo[curWeek][endSec / 2][0]] 
      console.log(tempClass[endSec / 2])
      tempArr[curWeek] = tempClass
    }
  }
})



/**
 * 1.同周下并同节课存在则不能添加
 *  1.1 拿添加的数据中开始节课与截止节课和云数据库数据匹配
 *  1.2 判断该节课是不是同开始周和截止周有课
 * 2.不同周同节课存在则往数组添加一个对象
 */