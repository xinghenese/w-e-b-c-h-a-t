/**
 * Created by Administrator on 2014/12/4.
 */
define(['Coder', 'Utils/CookieUtil', 'Logger/Logger'], function(Coder, CookieUtil, Logger){
    CookieUtil.setCookie("pkey", "NzM2OTcyMjU1NTA0NTA1NDc2Mzk4MTYzODIxMzUwMDY2MjgwNzE1MzY1Nzg3NDIxMzc1NDg1ODk5NjQyNzYyNzA1MzMxNzMwNzc2MzA2MDM2MTU5NzkzNjQ1MzY0MDk0ODI0NjgwMTU3NDIxMzYzMjQwODAxODY4NzE2Mjg4ODQ2MzUzNDczMTQwNzkwMzA1Mjc2NjUyNDYxODk1OTA4MDY0ODYwNjA2NTQ2OTE2NjM4NzAxNjg5Mjc5NzE0ODI3MDc3MzU4ODIyODIxMTE1ODU5OTk5NTA2MzYxNjMwNTY4MTcwNTMyODM0ODYyMzE0NjE0NDU3ODk0NTY4OTM3NDY5MDc1OTUyNjI2MDc2MjExMjYzMzU3MjgyMzMyOTM3NzIyNTgwNTIxNTU0Mjk2ODQ4NTg=");

    var m_httpKey;

    var initKey = function(strKey){
        var baKey = null;
        try{
            baKey = Coder.encodeURL(strKey);
        }
        catch (e){
            Logger.error("e.printStackTrace()");//e.printStackTrace();
        }
        var baState = [];
        for (var i = 0; i < 0xFF; i++){
            baState.push(i);
        }
        var len = baKey.length;
        var index1 = 0;
        var index2 = 0;
        if (baKey == null || baKey.length == 0){
            return [];
        }
        for (i = 0; i < 0xFF; i++){
            index2 = ((baKey[index1] & 0xFF) + (baState[i] & 0xFF) + index2) & 0xFF;
            var tmp = baState[i];
            baState[i] = baState[index2];
            baState[index2] = tmp;
            index1 = (index1 + 1) % len;
        }
        return baState;
    };

    var RC4Base = function(byteArrayInput, strkey){
        var intX = 0;
        var intY = 0;
        var key = initKey(strkey);
        var intXorIndex;
        var result = [];
        for (var i = 0; i < byteArrayInput.length; i++){
            intX = (intX + 1) & 0xFF;
            intY = ((key[intX] & 0xFF) + intY) & 0xFF;
            var temp = key[intX];
            key[intX] = key[intY];
            key[intY] = temp;
            intXorIndex = ((key[intX] & 0xFF) + (key[intY] & 0xFF)) & 0xFF;
            result.push(byteArrayInput[i] ^ key[intXorIndex]);
        }
        return result;
    };

    var RC4Encrpyt = {
        httpRC: function(value){
            m_httpKey = CookieUtil.getCookie("pkey");
            if (value != null && m_httpKey != null){
                return RC4Base(value, m_httpKey);
            }
            return [];
        }
    };
    return RC4Encrpyt;
});