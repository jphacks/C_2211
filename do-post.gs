const CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN');

async function doPost(e) {
  // console.log(CHANNEL_ACCESS_TOKEN); // でばぐ用
  const replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  const userId = JSON.parse(e.postData.contents).events[0].source.userId;
  if (typeof replyToken === 'undefined') {
    // debug("強制終了");
    return;
  }

  debug(JSON.parse(e.postData.contents));
  debug('userId_1: ', userId)

  const input = JSON.parse(e.postData.contents).events[0].message;
  const userMessageType = input.type;
  // debug(userMessageType); // 問題なく取得できている
  const userMessageText = input.text;
  const url = 'https://api.line.me/v2/bot/message/reply';

  let message;
  if (userMessageType === 'text') {
    debug("テキストメッセージ_ver.47_1");
    message = [{
          'type': 'text',
          'text': "今調べてるところだよ！\n少し待ってね🦉_1",
        }];
  }
  if (userMessageType == 'sticker'){
    debug("テキスト以外");
    message = [{
      'type': 'text',
      'text': "文字で知りたいことを送ってね！🦉",
    }];
  } 
  debug(message);

  // UrlFetchApp.fetch(url, {
  //   'headers': {
  //     'Content-Type': 'application/json; charset=UTF-8',
  //     'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  //   },
  //   'method': 'post',
  //   'payload': JSON.stringify({
  //     'replyToken': replyToken,
  //     'messages': message,
  //   }),
  // });

  await _doPost_sub(e);


  let queryList = await generateSearchQuery(userMessageText);
  let returnMessage = "調べてきたよ！\n調べた結果は👇から見てね！\n" + await generateSearchUrl(queryList);

  // let message = (userMessageType === "text") ? [{
  //         'type': 'text',
  //         'text': "今調べてるところだよ！\n少し待ってね🦉",
  //       }, {
  //         'type': 'text',
  //         'text': returnMessage,
  //       }] : [{
  //     'type': 'text',
  //     'text': "文字で知りたいことを送ってね！🦉",
  //   }];

  let message_2
  message_2 = [{
      'type': 'text',
      'text': returnMessage,
    }];
  
  

  console.log(returnMessage);
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
  debug(message_2);

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}


async function _doPost_sub(e) {
  // console.log(CHANNEL_ACCESS_TOKEN); // でばぐ用
  const replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  const userId = JSON.parse(e.postData.contents).events[0].source.userId;
  if (typeof replyToken === 'undefined') {
    // debug("強制終了");
    return;
  }

  const input = JSON.parse(e.postData.contents).events[0].message;
  const userMessageType = input.type;
  // debug(userMessageType); // 問題なく取得できている
  const userMessageText = input.text;
  const url = 'https://api.line.me/v2/bot/message/push';

  debug('userId:', userId);

  let message;
  // if (userMessageType === 'text') {
  //   debug("テキストメッセージ_ver.47_2");
  //   message = [{
  //         'type': 'text',
  //         'text': "今調べてるところだよ！\n少し待ってね🦉",
  //       }];
  // }
  // if (userMessageType == 'sticker'){
  //   debug("テキスト以外");
  //   message = [{
  //     'type': 'text',
  //     'text': "文字で知りたいことを送ってね！🦉",
  //   }];
  // } 
  // debug(message);

  // UrlFetchApp.fetch(url, {
  //   'headers': {
  //     'Content-Type': 'application/json; charset=UTF-8',
  //     'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  //   },
  //   'method': 'post',
  //   'payload': JSON.stringify({
  //     'replyToken': replyToken,
  //     'messages': message,
  //   }),
  // });

  const payload = {
    to: userId,　//ユーザーID
    messages: [
      { 
        'type': 'text',
        'text': "文字で知りたいことを送ってね！🦉",  
      }
    ]
  };

  const params = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(url, params);



  // let queryList = await generateSearchQuery(userMessageText);
  // let returnMessage = "調べてきたよ！_2\n調べた結果は👇から見てね！\n" + await generateSearchUrl(queryList);

  // let message = (userMessageType === "text") ? [{
  //         'type': 'text',
  //         'text': "今調べてるところだよ！\n少し待ってね🦉",
  //       }, {
  //         'type': 'text',
  //         'text': returnMessage,
  //       }] : [{
  //     'type': 'text',
  //     'text': "文字で知りたいことを送ってね！🦉",
  //   }];

  // let message_2
  // message_2 = [{
  //     'type': 'text',
  //     'text': returnMessage,
  //   }];
  
  // debug(message_2);

  // console.log(returnMessage);
  // UrlFetchApp.fetch(url, {
  //   'headers': {
  //     'Content-Type': 'application/json; charset=UTF-8',
  //     'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  //   },
  //   'method': 'post',
  //   'payload': JSON.stringify({
  //     'replyToken': replyToken,
  //     'messages': message_2,
  //   }),
  // });
  // debug(message_2);

  // return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}




function debug(value='デバッグテスト') {
  const sheet = SpreadsheetApp.openById('17Fd5bUIrAI3I73yuRffYPyCoZhuh9vPJmztzlp0rmXs');
  const ss = sheet.getSheetByName('logs');
  const date = new Date();
  const targetRow = ss.getLastRow() + 1;
  ss.getRange('A' + targetRow).setValue(date);
  ss.getRange('B' + targetRow).setValue(value);
}