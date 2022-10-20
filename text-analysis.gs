function textAnalysis(sentence) {
  //形態素解析する文章を変数に格納
  //let sentence = sentence;
  let test_sentence = "赤いふくろうのぬいぐるみが買いたい"; // でばぐ用
  //goo形態素解析APIのリクエストURLとappIdを設定(***部分にIDセット)
  const apiUrl = "https://labs.goo.ne.jp/api/morph";
  const APP_ID = PropertiesService.getScriptProperties().getProperty('APP_ID');
  // console.log(APP_ID); // でばぐ用
  let form = "form|pos";
  //goo形態素解析APIにパラメータをセットし、HTTP POSTするためのoptionsを設定
  let payload = {
    'app_id' : APP_ID,
    'sentence' : sentence,
    'info_filter': 'form|pos'
  };
  let options = {
    'method' : 'post',
    'payload' : payload
  };
  //goo形態素解析APIにHTTP POSTでリクエストし、JSONの結果をパース
  let response = UrlFetchApp.fetch(apiUrl,options).getContentText();
  let json = JSON.parse(response);
  //goo形態素解析APIで処理した結果をログ出力する
  //return '解析したよ！';
  // for (let i = 0; i < json['word_list'][0].length; i++){
  //   console.log(json['word_list'][0][i][0], json['word_list'][0][i][1]);
  // }
  // console.log(json['word_list'][0]);
  return json['word_list'][0];
}

