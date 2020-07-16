var config = module.exports = {
  port: 2000,
  requireHttps: false,

  timeout: 2100, // # of seconds until kicked for afk (35min)

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

  // Default room settings
  difficulty: "normal",
  mode: "casual",
  consensus: "single",

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

  defaultCardPacks: ["English (Original)"],
  cardPacks: [
    {name: "English (Original)", jsonName: "English (Original)"},
    {name: "English (Duet)", jsonName: "English (Duet)"},
    // The Undercover word list is slightly different in words.json.
    {name: "English (Undercover) [NSFW]", filename: "./server/undercover-words.txt"},
    {name: "Czech", jsonName: "Czech"},
    {name: "German (Original)", jsonName: "German (Original)"},
    {name: "German (Duett)", jsonName: "German (Duett)"},
    {name: "French", jsonName: "French"},
    {name: "Italian", jsonName: "Italian"},
    {name: "Spanish", jsonName: "Spanish"},
    {name: "Catalan", jsonName: "Catalan"},
    {name: "Hungarian", jsonName: "Hungarian"},
    {name: "Polish", jsonName: "Polish"},
    {name: "Greek", jsonName: "Greek"},
    {name: "Portuguese", jsonName: "Portuguese"},
    {name: "Hebrew", jsonName: "Hebrew"},
    {name: "Slovak", jsonName: "Slovak"},
    {name: "Swedish", jsonName: "Swedish"},
    {name: "Dutch", jsonName: "Dutch"},
    {name: "Japanese", jsonName: "Japanese"},
    {name: "Simplified Chinese", jsonName: "Simplified Chinese"},
    {name: "Korean", jsonName: "Korean"},
    {name: "Serbian", jsonName: "Serbian"},
    {name: "Russian", jsonName: "Russian"},
    {name: "Albanian", jsonName: "Albanian"},
    {name: "Hullor Pack", filename: "./server/hullor-words.txt"},
    {name: "Bengali Pack", filename: "./server/bengali-words.txt"},
  ],
  // additionalCardPacks is appended to the cardPacks list. It's left
  // blank here so it can be set in local_settings.js without overriding
  // cardPacks.
  additionalCardPacks: [],
}
