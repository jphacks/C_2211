/**
 * 文章から固有名詞を抽出する関数
 * @param {String} inputMessage 入力された文章
 * @return {Json} json 固有名詞とその種類が記されたJSON
 */
async function extractProperNoun(inputMessage) {
  // 固有名詞抽出
  const apiUrl = "https://labs.goo.ne.jp/api/entity";
  try {
    debug("APP_IDを取得したーい！");
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
    debug("extractProperNounに渡された引数");
    debug(inputMessage);

    try {
      let response = UrlFetchApp.fetch(apiUrl,options).getContentText();
      let json = JSON.parse(response);
      debug("固有名詞");
      debug(json);
      return json;
    } catch(error) {
      sendAgainMessage(userId);
      debug(appId);
      debug("固有名詞抽出APIにてエラー");
      debug(error);
      return 1;
    }} catch (error) {
    debug("固有名詞抽出用のAPP_IDの取得でつまづいた！");
    sendAgainMessage();
  }
}
