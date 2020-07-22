// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化云数据库对象
const gruelClass = cloud.database().collection('gruel-course')
const gruelWeek = cloud.database().collection('gruel-curWeek')
const gruelTask = cloud.database().collection('gruel-task')
const MAX_LIMIT = 10
// 得到现在星期几
const curDay = (new Date().getDay()) == 0 ? 7 : new Date().getDay()
// 云函数入口函数
exports.main = async (event, context) => {
  const curWeek =(await gruelWeek.get())['data'][0]['curWeek']
  console.log('curWeek', curWeek)
  const wxContext = cloud.getWXContext()
  // 得到用户总条数
  const total = (await gruelClass.count()).total
  // 临时存储云数据库取回来的数据
  const tasksPrmise = []
  // 得到用获取几次数据
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  for(let i=0;i<batchTimes;i++) {
    let promise = gruelClass.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasksPrmise.push(promise)
  }
  // 最终将云数据的数据存放的位置
  let list = {
    data: []
  }
  // 用刚才请求到的promise数组去请求循环取数据
  if (tasksPrmise.length > 0) {
    // 执行每个promise 之后返回 到新数组中去 拼接成[{},{}]形式
    list = (await Promise.all(tasksPrmise)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    }) 
  for(let i=0;i<list.data.length;i++){
    let openid = list.data[i]._openid
    let tempUser = list.data[i]['course'][curDay]
    let task = []
    for (let key in tempUser ) {

      for(let j=0;j<tempUser[key].length;j++) {
        if (tempUser[key][j]['startWeek'] <= curWeek && tempUser[key][j]['endWeek'] >= curWeek) {
          let obj = {
            startSec:key,
            course: tempUser[key][j]
          }
          task.push(obj)
      }
      }
    }
    // 写入数据库
    if (task.length>0){
    let addTaskResult =  await  gruelTask.add({
        data:{
          openid: openid,
          task: task
        }
      })
    }
    }
  }
  }

  

 
