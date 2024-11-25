let Cookie
let bodyToken
// =  $persistentStore.read("115PanCookie")
function getSignInData() {
    Cookie = $response.headers
    bodyToken = $response.body
    $persistentStore.write(JSON.stringify(Cookie),'115PanCookie')
    $persistentStore.write(bodyToken,'115PanBody')
    $notification.post('115CheckInScript', '获取签到数据成功！', '');
}$done({})

getSignInData()