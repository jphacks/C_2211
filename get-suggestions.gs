/**
 * 検索ワードの一覧から、Google検索でのサジェストを取得する
 * @param {String[]} keywords 検索ワードが入った1次元配列
 * @return {String[]} suggestLists サジェストの検索ワードが入っている
 * return例 : [ '今日 天気 東京', '今日 天気 大阪', '今日 天気 横浜' ]
 */
function getSuggestions(keywords) {
  // 引数: 検索クエリが入っているリスト
  const _testKeywords = ["今日", "天気"];
  let apiUrl = "http://www.google.com/complete/search?hl=ja&output=toolbar&q=";

  for (let i = 0; i < _testKeywords.length; i++) {
    apiUrl += _testKeywords[i] + "+";
  }
  
  try {
    let response = UrlFetchApp.fetch(apiUrl)  // <- XML形式
    let res = xmlToJson(response);            // <- JSONに変換

    let suggestLists = [];
    for (let i = 0; i < 3; i++) { //サジェスト3つ目までとってるので、適当に数字は変えてもろて。。
      suggestLists.push(res["toplevel"]["CompleteSuggestion"][i]["suggestion"]["data"]);
    }
    console.log(suggestLists);
    // 出力: [ '今日 天気 東京', '今日 天気 大阪', '今日 天気 横浜' ]
    return suggestLists;
  } catch(error) {
    sendAgainMessage(userId);
    debug("GoogleSuggestAPI取得でエラー出ちゃった");
    return 1;
  }
}

/**
 * XMLをパースしてJSONに変換する関数
 * @param {String} xml XML形式
 * @return {Json} result XMLをJSONに変換したもの 
 */
function xmlToJson(xml) { 
  //XMLをパースして変換関数に引き渡し結果を取得する
  var doc = XmlService.parse(xml);
  var result = {};
  var root = doc.getRootElement();
  result[root.getName()] = elementToJson(root);
  return result;
}

/**
 * XMLの各要素をJSONに変換？
 */
function elementToJson(element) {
  //結果を格納する箱を用意
  var result = {};

  // Attributesを取得する
  element.getAttributes().forEach(function(attribute) {
    result[attribute.getName()] = attribute.getValue();
  });

  //Child Elementを取得する
  element.getChildren().forEach(function(child) {
  //キーを取得する
  var key = child.getName();

  //再帰的にもう一度この関数を実行して判定
  var value = elementToJson(child);
  
  //XMLをJSONに変換する
  if (result[key]) {
    if (!(result[key] instanceof Array)) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  });

  //タグ内のテキストデータを取得する
  if (element.getText()) {
    result['data'] = element.getText();
  }
  return result;
}
