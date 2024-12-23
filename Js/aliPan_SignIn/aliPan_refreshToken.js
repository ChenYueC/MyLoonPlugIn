function getCookie() {
    if (isEmpty($persistentStore.read('aliPanRefreshToken'))){
        console.log(`开始获取cookie`)
        let data = $request.body

        try {
            data = JSON.parse(data)
            console.log(data)
            let refreshToken = data.refresh_token
            console.log(refreshToken)
            if (!isEmpty(refreshToken)) {
                $persistentStore.write(refreshToken, 'aliPanRefreshToken')
                $notification.post('aliPanSignIn','','🎉成功获取阿里云盘refresh_token')
                $done({})
            } else {
                $notification.post('aliPanSignIn','','❌获取阿里云盘token失败，请稍后再试')
                $done({})
            }
        } catch (e) {
            $notification.post('aliPanSignIn','','❌获取阿里云盘token失败')
            $done({})
        }
    }else {
        $done({})
    }

}
function hasPath(url) {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.pathname.includes('/v2/account/token')) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

function isEmpty(cont) {
    if (cont == null) {
        return true;
    }
    return typeof cont === "string" && cont.trim().length === 0;
}



getCookie()