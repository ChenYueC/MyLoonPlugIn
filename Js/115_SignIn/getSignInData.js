let Cookie
let bodyToken
// =  $persistentStore.read("115PanCookie")
function getSignInData() {
    Cookie = $response.headers
    bodyToken = $response.body
    $persistentStore.write(Cookie,'115PanCookie')
    $persistentStore.write(bodyToken,'115PanBody')
}$done()

getSignInData()