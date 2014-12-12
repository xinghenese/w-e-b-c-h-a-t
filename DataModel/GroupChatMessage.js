/**
 * Created by Administrator on 2014/12/3.
 */
define(['Proxy', 'CommonUtils', 'ChatMessage'], function(Proxy, CommonUtils, ChatMessage){
    var GroupChatMessageProxy = Proxy.createProxyFromTemplate({
        _constructor:   ConstructorMap.GroupChatMessage,
        _parent:        ClassMap.CLASS_MESSAGE,
        intGroupId:     CommonUtils.INT_NOT_SET,
        strGroupName:   CommonUtils.STRING_NOT_SET,
        bBeAt:          CommonUtils.BOOLEAN_NOT_SET
    });
    return GroupChatMessageProxy;
});