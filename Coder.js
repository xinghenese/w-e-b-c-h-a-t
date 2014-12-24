/**
 * Created by Administrator on 2014/11/25.
 */
define(function(){
    var Coder = (function () {
//        var parse16 = "0123456789ABCDEF";
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var base64DecodeChars = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1,
            -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];

        return {
            encodeURLOnHexBase: function (input, simple) {
                var output = encodeURIComponent(input);
                if (simple) {
                    return output;
                }
//                console.log("encodeURIComponent: " + output);
                return output.replace(/^([^%]+)|(%[A-F0-9]{2})([^%]+)/g, function(){
                    var _s1 = RegExp.$1 || RegExp.$3 || "";
                    var _s2 = RegExp.$2 || "";
                    return _s2 + _s1.replace(/./g, function(match, p){
//                        var _code = _s1.charCodeAt(p);
//                        return '%' + parse16[_code >> 4] + parse16[_code & 0x0F];
                        return '%' + _s1.charCodeAt(p).toString(16);
                    });
                });
            },

            encodeURLOnDecBase: function (input, simple) {
                var output = encodeURIComponent(input);
                if (simple) {
                    return output;
                }
//                console.log("encodeURIComponent: " + output);
                return output.replace(/^([^%]*)|(%[A-F0-9]{2})([^%]*)/g, function(){
                    var _s1 = RegExp.$1 || RegExp.$3 || "";
                    var _s2 = RegExp.$2 || "";
                    return _s2.replace(/([^%]{2})/, function(){
                        return parseInt(RegExp.$1, 16)
                    }) + _s1.replace(/./g, function (match, p){
                        return '%' + _s1.charCodeAt(p);
                    });
                });
            },

            encodeURL: function (input, omit) {
                return this.encodeURLOnHexBase(input, omit);
            },

            decodeURL: function (input) {
                return decodeURIComponent(input);
            },

            encodeBase64: function (input) {
                console.log("Hex: " + Coder.encodeURLOnHexBase(input));
                console.log("Dec: " + Coder.encodeURLOnDecBase(input));
                var arr = Coder.encodeURLOnDecBase(input).substring(1).split("%");
                console.log(arr);
                var len = arr.push(0, 0);
                var end = ["", "=", "=="], output = "";
                for (var i = 0; i + 3 <= len; i = i + 3) {
                    var a1 = arr[i] >> 2;
                    var a2 = ((arr[i] & 0x0003) << 4) ^ (arr[i + 1] >> 4);
                    var a3 = ((arr[i + 1] & 0x000F) << 2) ^ (arr[i + 2] >> 6);
                    var a4 = (arr[i + 2]) & 0x003F;
                    output = output + base64EncodeChars[a1] + base64EncodeChars[a2] + base64EncodeChars[a3] + base64EncodeChars[a4];
                }
                var n = (i - (len - 2)) % 3;
                output = output.substring(0, output.length - n) + end[n];
                return output;
            },

            decodeBase64: function (input) {
                var len = input.length;
                var n = input[len - 1] != "=" ? 0 : input[len - 2] != "=" ? 1 : 2;
                var output = "";
                for (var i = 0; i + 4 <= len; i = i + 4) {
                    var a1 = ((base64DecodeChars[input.charCodeAt(i)] & 0x003F) << 2) ^ (base64DecodeChars[input.charCodeAt(i + 1)] >> 4);
                    var a2 = ((base64DecodeChars[input.charCodeAt(i + 1)] & 0x000F) << 4) ^ (base64DecodeChars[input.charCodeAt(i + 2)] >> 2);
                    var a3 = ((base64DecodeChars[input.charCodeAt(i + 2)] & 0x0003) << 6) ^ (base64DecodeChars[input.charCodeAt(i + 3)] & 0x003F);
                    var c1 = "%" + a1.toString(16);
                    var c2 = "%" + a2.toString(16);
                    var c3 = "%" + a3.toString(16);
                    output = output + c1 + c2 + c3;
                }
                console.log("n: " + n + "\noutput: " + output);
                //console.log("decode: " + decodeURIComponent(output));
                output = decodeURIComponent(output.substring(0, output.length - 3 * n));
                console.log("output: " + output);
                return output;
            }
        };

    })();
    return Coder;
});

