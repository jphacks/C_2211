/**
 * 形態素解析を行う関数
 * @param {String} sentence 入力された文章
 * @return {String[][]} 分解された文章中のワードと形態素の種類
 * returnの例
  [ [ 'ギター', '名詞' ],
  [ 'って', '格助詞' ],
  [ 'どう', '連用詞' ],
  [ 'すれ', '動詞語幹' ],
  [ 'ば', '動詞接尾辞' ],
  [ '弾け', '動詞語幹' ],
  [ 'る', '動詞接尾辞' ],
  [ 'の', '終助詞' ],
  [ '？', '句点' ] ]
 */
async function textAnalysis(sentence) {
  //形態素解析する文章を変数に格納
  //let sentence = sentence;
  // let test_sentence = "赤いふくろうのぬいぐるみが買いたい"; // でばぐ用

  //goo形態素解析APIのリクエストURLとappIdを設定(***部分にIDセット)
  const apiUrl = "https://labs.goo.ne.jp/api/morph";

  try {
    const appId = await PropertiesService.getScriptProperties().getProperty('APP_ID');
    //goo形態素解析APIにパラメータをセットし、HTTP POSTするためのoptionsを設定
    let payload = {
      'app_id' : appId,
      'sentence' : sentence,
      'info_filter': 'form|pos'
    };
    let options = {
      'method' : 'post',
      'payload' : payload
    };

    try {
      //goo形態素解析APIにHTTP POSTでリクエストし、JSONの結果をパース
      let response = await UrlFetchApp.fetch(apiUrl,options).getContentText();
      let json = JSON.parse(response);
      return (json['word_list'][0]);
    } catch (error) {
      sendAgainMessage();
    }
  } catch (error) {
    sendAgainMessage();
  }
}

