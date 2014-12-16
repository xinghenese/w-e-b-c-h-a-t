/**
 * Created by Administrator on 2014/12/15.
 */
define('TreeType', function(){
    return{
        Object: 1,
        Wrapper: 2,
        XMLDocument: 3,
        HTMLDocument: 4
    };
});

define('CSSUtil', function(){
    return {
        cssFormat: function(input){
            return input.replace(/([A-Z])/g, function(){
                var _s1;
                if(_s1 = RegExp.$1){
                    return '-' + _s1.toLowerCase();
                }
            });
        },
        toCSSText: function(obj){
            var result = "";
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    result += this.cssFormat(key) + ":" + obj[key] + ";";
                }
            }
            return result;
        }
    };
});

/**
 * Created by Administrator on 2014/12/3.
 */
define('Base', ['TreeType', 'CSSUtil'], function(TreeType, CSSUtil){

    Object.prototype.basicClone = function () {
        var _copy = new this.constructor;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (typeof(this[prop]) != "function") {
                    _copy[prop] = this[prop];
                }
            }
        }
        return  _copy;
    };

    Object.prototype.addProperty = function (key, value) {
        if (typeof(this[key]) == "undefined") {
            this[key] = value;
        }
        return this;
    };

    Object.prototype.addPropFromTemplate = function (objTemplate) {
        for (var prop in objTemplate) {
            if (objTemplate.hasOwnProperty(prop)) {
                this[prop] = objTemplate[prop];
            }
        }
        return this;
    };

    Object.prototype.clearProperties = function () {
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (typeof(this[prop]) == "function") {
                    this[prop] = null;
                }
                else if (typeof(this[prop]) != "object") {
                    delete prop;
                }
                else {
                    this[prop].clearProperties();
                }
            }
        }
    };

    Object.prototype.superMethod = function(name, args){
        var func = (this.constructor.getAdapter())[name] || (this.constructor.prototype)[name];
        if(typeof func === 'function'){
            func.apply(this, args);
        }
        return this;
    };

    Function.prototype.method = function (type, func) {
        if (!this.prototype[type]) {
            this.prototype[type] = func;
        }
        return this;
    };

    Function.prototype.superMethod = function(name){
        return (this.getAdapter() || this.prototype)[name];
    };

    Function.prototype.implementMethods = function (funcObj) {
        for (var key in funcObj) {
            if (funcObj.hasOwnProperty(key) && typeof funcObj[key] == "function") {
                this.prototype[key] = funcObj[key];
            }
        }
    };

    Function.prototype.inherits = function (protoObj, fConstructor) {
        if(typeof protoObj == "object"){
            this.prototype = protoObj;
            this.prototype.constructor = fConstructor || this;
        }
        else if(typeof protoObj == "function"){
            this.prototype = new protoObj();
            this.prototype.constructor = fConstructor || protoObj || this;
        }
        return this;
    };

    Function.prototype.staticMethod = function (type, func) {
        if (!this[type]) {
            this[type] = func;
        }
        return this;
    };

//    Interface Tree{
//        getTreeType();
//        getRoot();
//    }
//    Interface Node{
//        checkSubNodes();
//        getSubNodeByKey(key);
//        parseAttributes(targetNode, mapConversion);
//        copyAttributes(key, value);
//        createAndAppendChild(tag, tree, mapConversion);
//      }

    Object.implementMethods({
        getTreeType: function(){
            return TreeType.Object;
        },
        getRoot: function(){
            return this;
        }
    });

    Object.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _hasChild = false;
            var _subNodeKeys = [_self];
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    if(_self[key]){
                        if(Object.prototype.toString.call(_self[key]) == "[object Array]"){
                            var _len = _self[key].length;
                            for(var i = 0; i < _len; i++){
                                _subNodeKeys.push(key + "-" + i);
                            }
//                            console.log("checkSubNodes: " + _subNodeKeys);
                            _hasChild = true;
                        }
                        else if(typeof(_self[key]) == "object"){
                            if(key == "style"){
//                                console.log(_self[key]);
                                _self[key] = CSSUtil.toCSSText(_self[key]);
                            }
                            else{
                                _subNodeKeys.push(key);
                                _hasChild = true;
                            }
                        }
                        else if(key == "text"){
                            _subNodeKeys.push(key + '-' + _self[key]);
                            _hasChild = true;
                        }
                    }
                }
            }
            return _hasChild ? _subNodeKeys : null;
        },
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
//            console.log("key: " + key);
//            console.log("getSubNodeByKey: " + this[key]);
            var _info = key.split('-'),
                _key = _info[0],
                _index = _info[1];
//            console.log("_key: " + _key + "\t _index: " + _index);
            if(_index == +_index){
//                console.log("this[" + _key + "][" + _index+ "]: " + this[_key][_index]);
                return this[_key][_index];
            }
            return this[_key];
        },
        parseAttributes: function(targetNode, mapConversion){
            var _self = this;
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    var _value = _self[key];
                    if(typeof(_value) != "function" && typeof(_value) != "object"){
                        key = (mapConversion && mapConversion[key]) || key;
//                        console.log("key: " + key);
                        targetNode.copyAttributes(key, _value);
                    }
                }
            }
        },
        copyAttributes: function(key, value){
//            this[key] = ClassMap[value] ? {} : value;
            this[key] = value;
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var _self = this;
            tag = (mapConversion && mapConversion[tag]) || tag;
//        console.log("tag: " + tag);
            _self[tag] = {};
            return _self[tag];
        }
    });

    Document.implementMethods({
        getTreeType: function(){
//            console.log("XMLDocument");
            return TreeType.XMLDocument;
        },
        getRoot: function(root){
            return this.documentElement;
        }
    });

    HTMLDocument.implementMethods({
        getTreeType: function(){
//            console.log("HTMLDocument");
            return TreeType.HTMLDocument;
        },
        getRoot: function(){
            return document.createElement("div");
        }
    });

    Element.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _subNodeKeys = [_self];
            if(_self.hasChildNodes()){
                var _len = _self.childNodes.length;
                for(var i = 0; i < _len; i++){
                    _subNodeKeys.push(i);
                }
                return _subNodeKeys;
            }
            return null;
        },
        getSubNodeByKey: function(key){
            return this.childNodes[key];
        },
        parseAttributes: function(targetNode, toType, mapConversion){
            if(this.hasAttributes()){
                var _attrs = this.attributes, i = 0;
                do{
                    var _key = (mapConversion && mapConversion[_attrs[i].name]) || _attrs[i].name;
//                console.log("_key: " + _key);
                    targetNode.copyAttributes(_key, _attrs[i].value);
                }while(typeof(_attrs[++i]) != "undefined");
            }
        },
        copyAttributes: function(key, value){
//            this.setAttribute(key, (ClassMap[value] ? "" : value));
            this.setAttribute(key, value);
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            tag = (mapConversion && mapConversion[tag.split('-')[0]]) || tag.split('-')[0];
            return this.appendChild(tree.createElement(tag));
        }
    });

    HTMLElement.implementMethods({
        createAndAppendChild: function(tag, tree, mapConversion){
//            console.log("createAndAppendChild: tag: " + tag);
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            if(tag == "text"){
                return this.appendChild(tree.createTextNode(arr[1] || ""));
            }
            return this.appendChild(tree.createElement(tag));
        }
    });

    Document.prototype.simpleParse = function(){
        return this.documentElement.parseAttributes();
    };

});

/**
 * Created by Administrator on 2014/12/3.
 */
define('DocumentFactory', ['Base', 'TreeType'], function(Base, TreeType){
    var DocumentFactory = {
        createDocument: function(root){
            if (window.ActiveXObject){
                var _versions = ["MSXML2.HTMLDocument.6.0", "MSXML2.HTMLDocument.3.0", "MSXML2.HTMLDocument"];
                var _versionString;
                var _len = _versions.length;
                for(var i = 0; i < _len; i++){
                    try{
                        new ActiveXObject(_versions[i]);
                        _versionString = _versions[i];
                    }
                    catch(e){}
                }
                this.createDocument = function(root){
                    var _doc = new ActiveXObject(_versionString);
                    _doc.loadXML("<" + root + "/>");
                    return _doc;
                };
//                xmlObject.async = "false";
//                xmlObject.loadXML(xmlstring);
            }
            else{
                this.createDocument = function(root){
                    return document.implementation.createDocument("", root, null);
                };
            }
            return this.createDocument(root);
        },
        parseFromString: function(strXml, objDoc){
            if (window.ActiveXObject){
                this.parseFromString = function(strXml, objDoc){
                    var _doc = objDoc || this.createDocument();
                    _doc.loadXML(strXml);
                    return _doc;
                };
            }
            else{
                this.parseFromString = function(strXml, objDoc){
                    var _doc = objDoc || this.createDocument();
                    _doc = (new DOMParser()).parseFromString(strXml, "text/xml");
                    return _doc;
                };
            }
            return this.parseFromString(strXml, objDoc);
        },
        parseXMLToString: function(xmlDoc){
            if(window.ActiveXObject){
                this.parseXMLToString = function(xmlDoc){
                    return xmlDoc.xml;
                }
            }
            else{
                this.parseXMLToString = function(xmlDoc){
                    return (new XMLSerializer()).serializeToString(xmlDoc);
                }
            }
            return this.parseXMLToString(xmlDoc);
        },

        parseTree: function(sourceTree, toType, mapConversion){    //initRoot: get the rootNode of the document
            var _sourceNode, _sourceRoot, _sourceRootsInfo = [], _len = 0;
            var _targetNode, _targetRoot, _targetRootsInfo = [], _resultTree;
            //check
            if(!sourceTree.getTreeType || !sourceTree.getTreeType() || sourceTree.getTreeType() == toType){
//                console.log("check");
                return sourceTree;
            }
            while(_len > 0 || _initializing()){
                var _rootInfo = _sourceRootsInfo[_len - 1];
                var _sourceNodeKey = _rootInfo[1];
                if(typeof(_sourceNodeKey) != "undefined"){
                    _sourceNode = _rootInfo[0].getSubNodeByKey(_sourceNodeKey); //key is used to search a node
                    var _targetNodeName = _sourceNode.tagName || _sourceNodeKey;    //name is used to create a node
                    _targetNode = _targetRootsInfo[_len - 1].createAndAppendChild(_targetNodeName, _resultTree, mapConversion);
                    var _sourceNodeInfo = _sourceNode.checkSubNodes();  //check whether the sourceNode is a subRoot.
                    _sourceNode.parseAttributes(_targetNode, mapConversion);
                    if(_sourceNodeInfo){
                        _sourceRootsInfo.push(_sourceNodeInfo);
                        _targetRootsInfo.push(_targetNode);
                        _len ++;
                        _targetNode = _targetNode.getSubNodeByKey(_targetNodeName);//getSubObjectByNodeName(_targetNode, _sourceNode.getName());
                    }
                    else{
                        _rootInfo.splice(1, 1);
                    }
                }
                else{
                    _sourceRootsInfo.pop();
                    _targetRootsInfo.pop();
                    _len --;
                    if(_len > 0){
                        _rootInfo = _sourceRootsInfo[_len - 1];
                        _rootInfo.splice(1, 1);
                        _targetNode = _targetRootsInfo[_len - 1];
                    }
                }
            }
            if(_resultTree.getTreeType() == TreeType.HTMLDocument){
                if(_targetRoot){
                    return document.body.appendChild(_targetRoot);
                }
            }
            return _resultTree;

            function _initializing(){
                _sourceRoot = sourceTree.getRoot();
                _sourceNode = _sourceRoot;

                _resultTree = _createEmptyTree(_sourceRoot, toType, mapConversion);
                _targetRoot = _resultTree.getRoot();
//                console.info(_targetRoot);
                _targetNode = _targetRoot;

                var _sourceNodeInfo = _sourceNode.checkSubNodes();
                _sourceNode.parseAttributes(_targetNode, mapConversion);
//                console.log("id: " + _targetNode.getAttribute("id"));
//                console.info(_targetRoot);

                if(_sourceNodeInfo){
                    _sourceRootsInfo.push(_sourceNodeInfo);
                    _targetRootsInfo.push(_targetNode);
                    _len ++;
                    _initializing = function(){return false;};
                    return true;
                }
                return false;
            }
            function _createEmptyTree(sourceRoot, toType, mapConversion){
                var _name = sourceRoot.tagName || (sourceRoot.getName && sourceRoot.getName()) || "ROOT";
                _name = (mapConversion && mapConversion[_name]) || _name;
//                console.log("_name: " + _name);
//                console.log("ClassMap[_name]: " + ClassMap[_name]);
                switch(toType){
                    case TreeType.XMLDocument:
//                        console.info("XMLDocument");
                        return DocumentFactory.createDocument(_name);
                    case TreeType.HTMLDocument:
//                        console.info("HTMLDocument");
                        return document;
//                    case TypeMap.Wrapper:
//                        return (ClassMap[_name] && ClassMap[_name].createInstance()) || {};
                    case TreeType.Object:
                        return {};
                }
            }
        }
    };
    return DocumentFactory;
});


require(['DocumentFactory', 'TreeType', '$', '../TypeCheck'], function(DocumentFactory, TreeType, $, TypeCheck){
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
            style: {
                width: "464px",
                height: "243px",
                position: "absolute",
                color: "#1d1d1d",
                backgroundColor: "#FFFFFF"
            },
            div: [{
                    id: "box_title",
                    text: "意见反馈",
                    style: {
                        width: "100%",
                        height: "52px",
                        backgroundColor: "#F8F8F4",
                        font: "14px 宋体"
                    }
                },{
                    id: "box_content",
                    style: {
                        width: "422px",
                        height: "125px",
                        margin: "16px 20px 0",
                        backgroundColor: "#F8F8F7"
                    }
                },{
                    id: "btnSend",
                    text: "发送",
                    style: {
                        width: "82px",
                        height: "30px",
                        marginTop: "10px",
                        backgroundColor: "#21b69d",
                        color: "#FFFFFF",
                        font: "14px 宋体",
                        cursor: "pointer"
                    }
                }, {
                    id: "btnClose",
                    text: "\u00D7",
                    style: {
                        width: "52px",
                        height: "52px",
                        position: "absolute",
                        top: "0",
                        right: "0",
                        color: "#181818",
                        font: "40px 宋体",
                        cursor: "pointer"
                    }
                }]
        }, TreeType.HTMLDocument);

        box.setCenter();
        $('#box_title, #btnClose', box).setTextCenter();
        $('#box_content, #btnSend', box).setVerticalAlign('right').setTextCenter();

        return box;

//        var _xml = DocumentFactory.parseTree({
//            div: {
//                id: "msgBox",
//                div: [
//                    {
//                        id: "title"
//                    },
//                    {
//                        id: "content"
//                    },
//                    {
//                        id: "btnSend",
//                        style: {
//                            width: "200px",
//                            height: "80px",
//                            backgroundColor: "#DDDDDD"
//                        }
//                    }
//                ]
//            }
//        }, TreeType.XMLDocument);
//        console.log(DocumentFactory.parseXMLToString(_xml));
    }


    function createUserList(){
        var view = $.createPanel({
            id: "userlist",
            style: {
                width: "280px",
                height: "800px",
                position: "absolute",
                top: "100px",
                left: "200px",
                backgroundColor: "#e9eee3"
            },
            div: [{
                id: "list_title",
                style: {
                    width: "100%",
                    height: "52px",
                    backgroundColor: "#2fd5d9"
                }
            }, {
                id: "myAvatar",
                style: {
                    width: "58px",
                    height: "58px",
                    position: "absolute",
                    top: "11px",
                    left: "14px",
                    borderRadius: "29px",
                    backgroundColor: "#FFFFFF"
                }
            }, {
                id: "myName",
                text: "佳宁",
                style: {
                    width: "80px",
                    height: "14px",
                    position: "absolute",
                    left: "91px",
                    top: "22px",
                    color: "#0d6359",
                    font: "14px 宋体",
                    lineHeight: "14px"
                }
           }, {
                id: "search_bar",
                style: {
                    width: "auto",
                    height: "33px",
                    margin: "42px 13px 7px 9px"
                },
                input: {
                    type: "text",
                    id: "search",
                    value: "请输入呢称\\聊聊号",
                    style: {
                        width:"auto",
                        height: "100%",
                        margin: "0 39px 0 0",
                        border: "1px #d0d5ca solid",
                        padding: "6px 10px",
                        font: "14px 宋体",
                        lineHeight: "21px",
                        color: "#bfc4b9"
                    }
                }//,
//                div: {
//                    id: "search_button",
//                    text: "\u25CB",
//                    style: {
//                        width: "39px",
//                        height: "100%",
//                        position: "relative",
//                        top: "-100%",
//                        left: "219px",
//                        border: "1px #d0d5ca solid",
//                        backgroundColor: "#FAFFF4"
//                    }
//                }
            }]

        });

//        $('#search', view).modifyStyle(function(){
////            this.borderBox();
//            this.style.width = "200px";
//        });
//        $('#search_button', view).modifyStyle(function(){
//            this.borderBox();
//        });
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

    function createMsgBox(){
        var _doc = document;
        var msgbox = _doc.createElement("div");
        msgbox.style.cssText = "width: 466px; height: 245px; position: absolute; background-color: #FFFFFF;";
        setCenter(msgbox);
        var title = _doc.createElement("div");
        title.style.cssText = "width: 100%; height: 50px; background-color: #F8F8F4";
        var content = _doc.createElement("div");
        content.style.cssText = "width: 422px; height: 125px; margin: 22px; margin-bottom: 0;background-color: #F8F8F7";
//        var btnClose = _doc.createElement("div");
//        var btnConfirm = _doc.createElement("div");
//        var btnCancel = _doc.createElement("div");
        var btnSend = _doc.createElement("div");
        btnSend.style.cssText = "width: 82px; height: 30px; margin-top: 10px; background-color: #42D9C7";


        msgbox.appendChild(title);
        msgbox.appendChild(content);
        msgbox.appendChild(btnSend);

        setVerticalAlign([content, btnSend], "right");

        _doc.body.appendChild(msgbox);
        return msgbox;
    }

    function createConatiner(){

    }

    function setStyle(cssText){

    }

    function isArray(array){
        return Object.prototype.toString.call(array) == "[object Array]";
    }

    function findMax(array, prop, elementOrValue){
        var _max = 0, _i_max = 0, len = array.length, _value;
        for(var i = 0; i < len; i++){
            if((_value = prop && prop(i) || array[i]) >= _max){
                _i_max = i;
                _max = _value;
            }
        }
        return elementOrValue ? _max : _i_max;
    }

    function setVerticalAlign(arrElement, direction){
        if(arrElement && TypeCheck.isArray(arrElement)){
            direction = direction != "right";
            var len = arrElement.length,
                max = findMax(arrElement, function(i){
                    return parseInt(arrElement[i].style.marginLeft) + (direction ? 0 : parseInt(arrElement[i].style.width));
                }, true);
            for(var i = 0; i < len; i++){
                arrElement[i].style.marginLeft = max - (direction ? 0 : parseInt(arrElement[i].style.width)) + "px";
            }
        }
    }

    function setCenter(element){
        var _style = element.style;
        if(_style){
            if(_style.position == "static"){
                var _parent = element.parentNode || element.parentElement();
                _style.margin = "auto";
                _style.marginTop = (parseInt(_parent.style.height) - parseInt(_style.height))/2 + "px";
            }
            else{
                var _width = parseInt(_style.width);
                var _height = parseInt(_style.height);
                _style.left = "50%";
                _style.top = "50%";
                _style.marginLeft = -_width/2 + "px";
                _style.marginTop = -_height/2 + "px";
            }
        }
    }

    function setTextCenter(element){
        if(element && element.nodeType == 1){
//            console.log("element");
            element.style.textAlign = "center";
            element.style.lineHeight = element.style.height;
        }
    }



    function bindEventHandler(){

    }

    showDialog();

//    createBox();
});