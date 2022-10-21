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
  let returnMessage = "調べてきたよ！\n調べた結果は👇をタッチ！\n" + await generateSearchUrl(queryList);

  let message_2
  message_2 = [{
      'type': 'text',
      'text': returnMessage,
    }];
  
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': message_2,
    }),
  });

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}


function debug(value='デバッグテスト') {
  const sheet = SpreadsheetApp.openById('17Fd5bUIrAI3I73yuRffYPyCoZhuh9vPJmztzlp0rmXs');
  const ss = sheet.getSheetByName('logs');
  const date = new Date();
  const targetRow = ss.getLastRow() + 1;
  ss.getRange('A' + targetRow).setValue(date);
  ss.getRange('B' + targetRow).setValue(value);
}