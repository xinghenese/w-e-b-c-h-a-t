/**
 * Created by Administrator on 2014/12/30.
 */
require(['CollectionPrototype', 'DataModel/ConstructorProxy', 'DataModel/UserTemplate', 'DataModel/GroupTemplate', '../Logger/Logger'], function(Proxy, ConstructorProxy, UserTemplate, GroupTemplate, Logger){
    var userCollection = Proxy.createCollectionProxy(ConstructorProxy.createConstructor(UserTemplate));
    var user1 = userCollection.createItem({
        intUserId: 54321,
        strNickName: "Tome",
        strGender: "Male"
    });
    var groupProxy = Proxy.createProxyFromTemplate(ConstructorProxy.createConstructor(GroupTemplate));
    var group1 = groupProxy.createInstance({
        strGroupName: "Arsenal",
        strDescription: "a great football club",
        userOwner: user1
    });

    var user2 = userCollection.createItem({
        intUserId: 12345,
        strNickName: "Jack",
        groupFavourite: group1
    });

    var user3 = userCollection.createItem({
        intUserId: 1007,
        strNickName: "Mary",
        groupFavourite: group1
    });

    Logger.info("user1.id", user1.getProperty("intUserId"));
    Logger.info("user1.id", userCollection.getItemProperty(0, "intUserId"));

});