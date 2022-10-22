/**
 * ユーザからメッセージを受け取った時に、「今調べてるところだよ！\n少し待ってね🦉」というメッセージをまず返す関数
 */
async function sendWaitMessage() {
  const url = 'https://api.line.me/v2/bot/message/push';

  const payload = {
    to: userId,　//ユーザーID
    messages: [
      { 
        'type': 'text',
        'text': "今調べてるところだよ！\n少し待ってね🦉",  
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
}
