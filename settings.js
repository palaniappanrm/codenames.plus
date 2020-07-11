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

  // Set to non-null to use fixed team names instead of using color names
  redTeamName: null,
  blueTeamName: null,

  redPalette: [
    {name: "red", deep: "#B32728", light: "rgb(236, 170, 170)"},
    {name: "purple", deep: "#AA69DD", light: "rgb(216, 191, 216)"},
  ],
  bluePalette: [
    {name: "blue", deep: "#11779F", light: "rgb(168, 216, 235)"},
    {name: "green", deep: "#008000", light: "rgb(168, 235, 216)"},
  ],
}
