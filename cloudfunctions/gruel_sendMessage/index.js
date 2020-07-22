// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化云数据库
const db = cloud.database()
const gruelClass = db.collection('gruel-course')
const gruelTask = db.collection('gruel-task')

// 云函数入口函数
exports.main = async (event, context) => {
// 1.获取到当天的任务集合，得到当天的任务
// 2.根据任务时间进行课程推送
   const allGruelTask = (await gruelTask.get())['data']
   console.log(allGruelTask)
  for(let i=0;i<allGruelTask.length;i++) {
    let tempOpneid = allGruelTask[i].openid
    let remindCourse = allGruelTask[i].task
    for (let j = 0; j < remindCourse.length;j++) {

      // let curTime = new Date()
      // let remindTime = new Date('2020-7-22 22:45:00')
    
      console.log('---------remindTime----------')
      console.log(remindCourse[j]['startSec'])
      console.log( typeof tempOpneid)
      // console.log(remindCourse[j])
      // console.log(remindTime - curTime)
      // console.log(Math.floor((remindTime - curTime) / 1000 / 60 / 60))
      console.log('---------remindTime----------')
        let result = await cloud.openapi.subscribeMessage.send({
          touser: tempOpneid,
          lang: 'zh_CN',
          // 模板id  要和 wx.requestSubscribeMessage() 中的模板id一致
          templateId: 'v74q-Z2GUac6sxKLs5NjcvdbICVTcH37-XqtvkJCUkA',
          // 用户点击模板要跳转的路径
          page: `pages/index/index`,
          data: {
            // 信息填写位置 要和摸吧对应上
            thing3: {
              value: remindCourse[j]['course']['className']
            },
            time2: {
              value: '2020年1月2日 18:00'
            },
            thing5: {
              value: remindCourse[j]['course']['place']
            }
          }

        })
 
    } 
  }


  // let tempid = 'v74q-Z2GUac6sxKLs5NjcvdbICVTcH37-XqtvkJCUkA'
  // let result = await cloud.openapi.subscribeMessage.send({
  //   touser: 'ooKTI5dKPG53FlObI9uvsmY3mJVQ',
  //   lang: 'zh_CN',
  //   // 模板id  要和 wx.requestSubscribeMessage() 中的模板id一致
  //   templateId: 'v74q-Z2GUac6sxKLs5NjcvdbICVTcH37-XqtvkJCUkA',
  //   // 用户点击模板要跳转的路径
  //   page: `pages/index/index`,
  //   data: {
  //     // 信息填写位置 要和摸吧对应上
  //     thing3: {
  //       value: '大学物理'
  //     },
  //     time2: {
  //       value: '2020年1月2日 18:00'
  //     },
  //     thing5:{
  //       value: '厚德楼A602'
  //     }
  //   }

  // })
  // return {
  //   'success': result,
  // }

}