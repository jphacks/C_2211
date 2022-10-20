function extractProperNoun(inputMessage) {
  // 固有名詞抽出
  const apiUrl = "https://labs.goo.ne.jp/api/entity";
  const APP_ID = PropertiesService.getScriptProperties().getProperty('APP_ID');
  
  let payload = {
    'app_id' : APP_ID,
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
    debug("固有名詞抽出APIにてエラー");
    debug(error);
    return 1;
  }
}
