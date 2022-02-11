// Returns date in "2022-02-08T02:26:04.977Z" format
function getNowInISOString(){
  return new Date().toISOString()
}

function getYesterdayDate() {
  return new Date(new Date().getTime() - 24*60*60*1000);
}

function getYesterdayAt9HoursInISOString(){
  const yesterday = getYesterdayDate()
  yesterday.setHours(9 - yesterday.getTimezoneOffset() / 60, 0, 0)

  return yesterday.toISOString()
}

function getTodayAt9HoursInISOString(){
  const today = new Date()
  today.setHours(9 - today.getTimezoneOffset() / 60, 0, 0)

  return today.toISOString()
}

module.exports = {
  getNowInISOString,
  getYesterdayAt9HoursInISOString,
  getTodayAt9HoursInISOString
}