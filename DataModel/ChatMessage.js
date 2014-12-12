/**
 * Created by Administrator on 2014/12/3.
 */
define(['Proxy', 'CommonUtils'], function(Proxy, CommonUtils){
    var ChatMessageProxy = Proxy.createProxyFromTemplate({
        _constructor:           ConstructorMap.Message,
        strMessageUuid:         CommonUtils.STRING_NOT_SET,
        intSenderId:            CommonUtils.INT_NOT_SET,
        strSenderNickname:      CommonUtils.STRING_NOT_SET,
        intReceiverId:          CommonUtils.INT_NOT_SET,
        strReceiverNickname:    CommonUtils.STRING_NOT_SET,
        strMessageContentType:  CommonUtils.STRING_NOT_SET,
        flDistance:             CommonUtils.FLOAT_NOT_SET,
        strDirection:           CommonUtils.STRING_NOT_SET,
        strAlternativeMessage:  CommonUtils.STRING_NOT_SET,
        intTimestamp:           CommonUtils.INT_NOT_SET,
        intCursor:              CommonUtils.INT_NOT_SET
    });
    return ChatMessageProxy;
});