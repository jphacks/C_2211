const CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN');

var userId;
var isErrorHandling = true;

/**
 * いろんな関数を呼び出してメッセージを送信する関数
 * @param {Object} e LINE Botのお作法的な
 * @return {Object} LINE Botのお作法的な
 */
async function doPost(e) {
  const replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    // TODO: ここでエラーメッセージ送ってあげた方がいい？そもそもAPIが取れなかったから無理？
    return;
  }

  const input = JSON.parse(e.postData.contents).events[0].message;
  const userMessageType = input.type;
  const userMessageText = input.text;
  const url = 'https://api.line.me/v2/bot/message/reply';
  userId = JSON.parse(e.postData.contents).events[0].source.userId;

  let message;
  if (userMessageType != 'text'){
    message = [{
      'type': 'text',
      'text': "文字で知りたいことを送ってね！🦉",
    }];
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': message,
      }),
    });
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  } 

  //「ちょっとまってね」と送信
  await sendWaitMessage(userId);

  let queryList = await generateSearchQuery(userMessageText);
  debug(typeof queryList)

  // generateSearchQuery(userMessageText).then( function(value) {
  //   // ここでプロミスオブジェクトの中身をああだこうだする。
  //   queryList.push(value);
  //   debug(value);
  // })

  while(queryList == undefined){
    Utilities.sleep(100);
  }

  let returnUrl = await encodeURI(generateSearchUrl(queryList));
  let returnMessage = "調べてきたよ！\n調べた結果は👇をタッチ！\n" + returnUrl;
  debug(queryList);
  let suggestWordList = await getSuggestions(queryList);

  

  let tileText_1 = "「 ";
  for(let query of queryList){
    tileText_1 = tileText_1 + query + " "; 
  }
  tileText_1 += "」🔎";
  debug(tileText_1);
  
  debug(suggestWordList[0]);
  let columnList = [{
            "thumbnailImageUrl": "https://raw.githubusercontent.com/jphacks/C_2211/develop/images/check_url.png",
            // "imageBackgroundColor": "#FFFFFF",
            // "title": "タイトルの文字列（最大40文字）",
            "text": "調べてきたよ！\n" + tileText_1,
            "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": returnUrl,
            },
            "actions": [
                {
                    "type": "uri",
                    "label": "ここを押してね",
                    "uri": returnUrl,
                }
            ]
          }];
          
  if(suggestWordList[0] != "u"){
    let tileText_2 = "「 " + suggestWordList[0] + " 」🔎";
    debug(tileText_2);
    let suggestQueryList = suggestWordList[0].split(" ");
    debug(suggestQueryList)
    const suggestUrl_1 =  encodeURI(generateSearchUrl(suggestQueryList));

    columnList.push({
            "thumbnailImageUrl": "https://raw.githubusercontent.com/jphacks/C_2211/develop/images/check_more_url.png",
            "text": "見つからなければこちらもチェック！\n" + tileText_2,
            "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": suggestUrl_1,
            },
            "actions": [
                {
                    "type": "uri",
                    "label": "ここを押してね",
                    "uri": suggestUrl_1,
                }
            ]
          },
    )

    if(suggestWordList.length == 2){
      let tileText_3 = "「 " + suggestWordList[1] + " 」🔎";
      debug(tileText_3);
      suggestQueryList = suggestWordList[1].split(" ");
      debug(suggestQueryList)
      const suggestUrl_2 =  encodeURI(generateSearchUrl(suggestQueryList));
      columnList.push({
            "thumbnailImageUrl": "https://raw.githubusercontent.com/jphacks/C_2211/develop/images/check_more_url.png",
            "text": "見つからなければこちらもチェック！\n" + tileText_3,
            "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": suggestUrl_2,
            },
            "actions": [
                {
                    "type": "uri",
                    "label": "ここを押してね",
                    "uri": suggestUrl_2,
                }
            ]
          },
      )
    }
  }


  debug("messageTileを用意");
  debug(typeof returnUrl);
  let messageTile;
  messageTile = [{
    "type": "template",
    "altText": tileText_1,
    "template": {
      "type": "carousel",
      "columns": columnList,
    }
  }];
  
  debug("返信を実行");
  debug(messageTile);
  try{
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': messageTile,
      }),
    });
    debug("返信を実行終了");
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  }catch(e){
    debug("返信できず");
    debug(e);
    sendAgainMessage();
  }


  
}


function debug(value='デバッグテスト') {
  const sheet = SpreadsheetApp.openById('17Fd5bUIrAI3I73yuRffYPyCoZhuh9vPJmztzlp0rmXs');
  const ss = sheet.getSheetByName('logs');
  const date = new Date();
  const targetRow = ss.getLastRow() + 1;
  ss.getRange('A' + targetRow).setValue(date);
  ss.getRange('B' + targetRow).setValue(value);
}