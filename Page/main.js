/**
 * Created by Administrator on 2014/12/24.
 */
require(['$'], function($){
    var dialog, userlist;
    function showDialog(msg){
        if(!dialog){
            dialog = createBox();
        }
        if(!userlist){
            userlist = createUserList();
        }
    }

    function createBox(){
        var box = $.createPanel({
            id: "msgBox",
            "class": "msgBox",
            div: [{
                id: "box_title",
                "class": "box_title",
                text: "意见反馈"
            },{
                id: "box_content",
                "class": "box_content"
            },{
                id: "btnSend",
                "class": "btnSend",
                text: "发送"
            }, {
                id: "btnClose",
                "class": "btnClose",
                text: "\u00D7"
            }]
        });

        box.setCenter();
        $('#box_title, #btnClose', box).setTextCenter();
        $('#box_content, #btnSend', box).setVerticalAlign('right').setTextCenter();

        var _xml = $.createXMLDocument({
            div: {
                id: "msgBox",
                div: [{
                    id: "title"
                },{
                    id: "content"
                },{
                    id: "btnSend",
                    style: {
                        width: "200px",
                        height: "80px",
                        backgroundColor: "#DDDDDD"
                    }
                }
                ]
            }
        });
        console.log($.parseXMLToString(_xml));

        return box;
    }

    function createUserList(){
        var view = $.createPanel({
            id: "userlist",
            "class": "userlist",
            div: [{
                id: "list_title",
                "class": "list_title"
            }, {
                id: "myAvatar",
                "class": "myAvatar"
            }, {
                id: "myName",
                "class": "myName",
                text: "佳宁"
            }, {
                id: "select",
                "class": "select",
                text: "\u2714"
            },{
                id: "search_bar",
                "class": "search_bar",
                input: {
                    type: "text",
                    "class": "text",
                    id: "search",
                    value: "请输入呢称\\聊聊号"
                },
                div: [//{
//                    id: "search",
//                    text: "请输入呢称\\聊聊号",
//                    style: {
//                        width:"159px",
//                        height: "100%",
//                        backgroundColor: "#FFFFFF",
//                        marginRight: "1px",
//                        padding: "6px 10px",
//                        font: "14px 宋体",
//                        color: "#bfc4b9"
//                    }
//                },
                    {
                        id: "search_button",
                        "class": "search_button",
                        text: "s"
                    }, {
                        id: "search_button2",
                        "class": "search_button2",
                        text: "sa"
                    }]
            }]
        });

        $('#search, #search_button, #search_button2', view).float().borderBox().setTextCenter();
//        $('#search, #search_button, #search_button2', view).borderBox().setTextCenter();
        $('#select', view).setTextCenter();

    }


    /*
     UI Component
     1. create container and expose its id or class: id for single instance, class for otherwise
     2. create subElements, arrange their affiliation and append to container
     3. set style including:
     layout: size(width, height, border) and location(position, margin, padding...)
     appearance: background
     text: arrangement(line-height, text-align) and font...
     4. set behavior
     bind event handler
     5. append container to document and expose its id or class
     */







    showDialog();

//    createBox();
});