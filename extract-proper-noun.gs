/**
 * 文章から固有名詞を抽出する関数
 * @param {String} inputMessage 入力された文章
 * @return {Json} json 固有名詞とその種類が記されたJSON
 */
async function extractProperNoun(inputMessage) {
  // 固有名詞抽出
  const apiUrl = "https://labs.goo.ne.jp/api/entity";
  try {
    var appId;
    while (!appId) {
      appId = await PropertiesService.getScriptProperties().getProperty('APP_ID');
      Utilities.sleep(100);
    }
    
    let payload = {
      'app_id' : appId,
      'sentence' : inputMessage,
    };
    let options = {
      'method' : 'post',
      'payload' : payload
    };

    try {
      let response = UrlFetchApp.fetch(apiUrl,options).getContentText();
      let json = JSON.parse(response);
      return json;
    } catch(error) {
      sendAgainMessage(userId);
      return 1;
    }} catch (error) {
    sendAgainMessage();
  }
}
