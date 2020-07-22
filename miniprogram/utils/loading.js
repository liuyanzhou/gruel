/**
 * 展示提醒消息
 * showToast
 */
function showToast(title,icon="none",callback) {
  wx.showToast({
    title,
    icon: icon,
    success:callback
  })
}

/**
 * 展示加载信息
 * showLoading
 */
function showLoading(title="正在加载") {
  wx.showLoading({
    title: title
  })
}

module.exports = {
  showToast,
  showLoading
}