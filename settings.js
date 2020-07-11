var config = module.exports = {
  port: 2000,
  requireHttps: false,

  // Daily Server Restart time
  // UTC 01:30:00 = 7AM IST
  doDailyRestart: false,
  restartHour: 1,
  restartMinute: 30,
  restartSecond: 5,
  // restart warning time
  restartWarningHour: 1,
  restartWarningMinute: 20,
  restartWarningSecond: 2,
  
}
