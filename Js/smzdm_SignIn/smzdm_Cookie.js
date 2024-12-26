function getCookie() {
    if (isEmpty($persistentStore.read('smzdmCookie'))){
        console.log(`开始获取cookie`)
        let data = $request.headers
        // console.log(data)
        // console.log(typeof data)
        try {
            // data = JSON.parse(data)
            console.log(data)
            let Cookie = data.cookie
            console.log(Cookie)
            if (!isEmpty(Cookie)) {
                $persistentStore.write(Cookie, 'smzdmCookie')
                $notification.post('smzdmCheckIn','','成功获取什么值得买Cookie')
            } else {
                $notification.post('smzdmCheckIn','','什么值得买获取Cookie失败，请稍后再试！')
            }
        } catch (e) {
            $notification.post('smzdmCheckIn','','获取什么值得买Cookie失败！！！')
        }finally {
            $done({})
        }
    }else {
        $done({})
    }

}

function isEmpty(cont) {
    if (cont == null) {
        return true;
    }
    return typeof cont === "string" && cont.trim().length === 0;
}



getCookie()