function getCookie() {
    if (isEmpty($persistentStore.read('aliYunPanRefreshTokenKey'))){
        console.log(`开始获取cookie`)
        let data = $request.body

        try {
            data = JSON.parse(data)
            let refreshToken = data.refresh_token
            if (refreshToken) {
                $persistentStore.write(aliYunPanRefreshTokenKey, refreshToken)
                $notification.post('aliPanSignIn','','🎉成功获取阿里云盘refresh_token，可以关闭相应脚本')
            } else {
                $done({})
                $notification.post('aliPanSignIn','','❌获取阿里云盘token失败，请稍后再试')
            }
        } catch (e) {
            $done({})
            $notification.post('aliPanSignIn','','❌获取阿里云盘token失败')
        }
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