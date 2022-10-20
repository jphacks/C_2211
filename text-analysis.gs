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
  debug(apiUrl);

  try {
    debug("tryにはいったよーん");
    const appId = await PropertiesService.getScriptProperties().getProperty('APP_ID');
    // console.log(APP_ID); // でばぐ用
    debug(appId);
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
    debug("25行目まできた");

    try {
      //goo形態素解析APIにHTTP POSTでリクエストし、JSONの結果をパース
      let response = await UrlFetchApp.fetch(apiUrl,options).getContentText();
      let json = JSON.parse(response);
      debug("jsonの中身");
      return (json['word_list'][0]);
    } catch (error) {
      debug("goo形態素解析APIでつまづいた");
      sendAgainMessage();
    }
  } catch (error) {
    debug("形態素解析用のAPP_IDの取得に失敗");
    sendAgainMessage();
  }
}

