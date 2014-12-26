/**
 * Created by Administrator on 2014/12/24.
 */
define('TypeCheck',[],function(){
    var toString = {}.toString;
    return {
        isExist: function(variable){
            if(typeof variable == "undefined"){
                try{
                    if(variable == null){
                        return "not set";
                    }
                }
                catch(err){
                    return "not defined";
                }
            }
            else{
                return "set";
            }
// return typeof variable == "undefined";
        },
        isNumber: function(num){
            return num === +num && isFinite(num);
        },
        likeNumber: function(num){
            return num == +num;
        },
        isString: function(str){
            return typeof str == "string";
        },
        isFunction: function(fn){
            return typeof fn == "function";
        },
        isObject: function(obj){
            return toString.call(obj) == "[object Object]";
        },
        isArray: function(arr){
            return toString.call(arr) == "[object Array]";
        },
        likeArray: function(list){
            return typeof list.length == "number";
        },
        isXMLDocument: function(xml){
            return toString.call(xml) == "[object XMLDocument]";
        },
        isXMLElement: function(element){
            return toString.call(element) == "[object Element]";
        },
        isHTMLDocument: function(doc){
            return toString.call(doc) == "[object HTMLDocument]";
        },
        isHTMLElement: function(element){
            return toString.call(element).search(/^\[object HTML.*Element\]$/) != -1;
        },
        isNodeList: function(nodeList){
            return toString.call(nodeList) == "[object NodeList]";
        }
    }
});
/**
 * Created by Administrator on 2014/12/15.
 */
define('TreeType',[],function(){
    return{
        Object: 1,
        Wrapper: 2,
        XMLDocument: 3,
        HTMLDocument: 4
    };
});
/**
 * Created by Administrator on 2014/12/15.
 */
define('CSSUtil',['TypeCheck'], function(TypeCheck){
    return {
        cssFormat: function(input){
            return input.replace(/([A-Z])/g, function(){
                var _s1;
                if(_s1 = RegExp.$1){
                    return '-' + _s1.toLowerCase();
                }
            });
        },
        classify: function(obj){
            if(TypeCheck.isObject(obj)){

            }
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
define('Base',['TreeType', 'TypeCheck', 'CSSUtil'], function(TreeType, TypeCheck, CSSUtil){

    Object.prototype.basicClone = function () {
        var _copy = new this.constructor;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if(!TypeCheck.isFunction(this[prop])){
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
                if(TypeCheck.isFunction(this[prop])) {
                    this[prop] = null;
                }
                else if(!TypeCheck.isObject(this[prop])) {
                    delete prop;
                }
                else{
                    this[prop].clearProperties();
                }
            }
        }
    };

    Object.prototype.superMethod = function(name, args){
        var func = (this.constructor.getAdapter())[name] || (this.constructor.prototype)[name];
        if(TypeCheck.isFunction(func)){
            func.apply(this, args);
        }
        return this;
    };

    Object.prototype.each = function(fn, args){
        if(TypeCheck.likeArray(this)){
            for(var i  = 0, len = this.length; i < len; i++){
                fn.apply(this[i], args);
            }
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
            if (funcObj.hasOwnProperty(key) && TypeCheck.isFunction(funcObj[key])) {
                this.prototype[key] = funcObj[key];
            }
        }
    };

    Function.prototype.inherits = function (protoObj, fConstructor) {
        if(TypeCheck.isObject(protoObj)){
            this.prototype = protoObj;
            this.prototype.constructor = fConstructor || this;
        }
        else if(TypeCheck.isFunction(protoObj)){
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

    /*
         Interface Tree{
             getTreeType();
             getRoot();
         }
         Interface Node{
             checkSubNodes();
             getSubNodeByKey(key);
             parseAttributes(targetNode, mapConversion);
             copyAttributes(key, value);
             createAndAppendChild(tag, tree, mapConversion);
         }
     */

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
                        if(TypeCheck.isArray(_self[key])){
                            var _len = _self[key].length;
                            for(var i = 0; i < _len; i++){
                                _subNodeKeys.push(key + "-" + i);
                            }
                            _hasChild = true;
                        }
                        else if(TypeCheck.isObject(_self[key])){
                            if(key == "style"){
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
//            if(_hasChild){
//                console.info("subNodeKey: ");
//                console.info(_subNodeKeys);
//            }
            return _hasChild ? _subNodeKeys : null;
        },
        getSubNodeByKey: function(key){
            //key = (mapConversion && mapConversion[key]) || key;
            var _info = key.split('-'),
                _key = _info[0],
                _index = _info[1];
            if(TypeCheck.likeNumber(_index)){
                return this[_key][_index];
            }
            return this[_key];
        },
        parseAttributes: function(targetNode, mapConversion){
            var _self = this;
            for(var key in _self){
                if(_self.hasOwnProperty(key)){
                    var _value = _self[key];
                    if(!TypeCheck.isFunction(_value) && !TypeCheck.isObject(_value)  && !TypeCheck.isArray(_value)){
                        key = (mapConversion && mapConversion[key]) || key;
                        targetNode.copyAttributes(key, _value);
                    }
                }
            }
        },
        copyAttributes: function(key, value){
            this[key] = value;
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var _self = this;
            tag = (mapConversion && mapConversion[tag]) || tag;
            _self[tag] = {};
            return _self[tag];
        }
    });

    Document.implementMethods({
        getTreeType: function(){
            return TreeType.XMLDocument;
        },
        getRoot: function(){
            return this.documentElement;
        }
    });

    HTMLDocument.implementMethods({
        getTreeType: function(){
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
                    targetNode.copyAttributes(_key, _attrs[i].value);
                }while(typeof(_attrs[++i]) != "undefined");
            }
        },
        copyAttributes: function(key, value){
            if(key !== "text"){
                this.setAttribute(key, value);
            }
        },
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            return this.appendChild(tree.createElement(tag));
        }
    });

    HTMLElement.implementMethods({
        createAndAppendChild: function(tag, tree, mapConversion){
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
define('DocumentFactory',['Base', 'TreeType'], function(Base, TreeType){
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
            var _sourceNode, _sourceRoot, _sourceRootsInfo = [], _length = 0;
            var _targetNode, _targetRoot, _targetRootsInfo = [], _resultTree;
            //check
            if(!sourceTree.getTreeType || !sourceTree.getTreeType() || sourceTree.getTreeType() == toType){
                console.log("check");
                return sourceTree;
            }
            while(_length > 0 || _initializing()){
                var _rootInfo = _sourceRootsInfo[_length - 1];
                var _sourceNodeKey = _rootInfo[1];
                if(typeof(_sourceNodeKey) != "undefined"){
                    _sourceNode = _rootInfo[0].getSubNodeByKey(_sourceNodeKey); //key is used to search a node
                    var _targetNodeName = _sourceNode.tagName || _sourceNodeKey;    //name is used to create a node
                    _targetNode = _targetRootsInfo[_length - 1].createAndAppendChild(_targetNodeName, _resultTree, mapConversion);
                    var _sourceNodeInfo = _sourceNode.checkSubNodes();  //check whether the sourceNode is a subRoot.
                    _sourceNode.parseAttributes(_targetNode, mapConversion);
                    if(_sourceNodeInfo){
                        _sourceRootsInfo.push(_sourceNodeInfo);
                        _targetRootsInfo.push(_targetNode);
                        _length ++;
//                        _targetNode = _targetNode.getSubNodeByKey(_targetNodeName);//getSubObjectByNodeName(_targetNode, _sourceNode.getName());
                    }
                    else{
                        _rootInfo.splice(1, 1);//_rootInfo: [_slef, key1, key2, key3...]
                    }
                }
                else{
                    _sourceRootsInfo.pop();
                    _targetRootsInfo.pop();
                    _length --;
                    if(_length > 0){
                        _rootInfo = _sourceRootsInfo[_length - 1];
                        _rootInfo.splice(1, 1);
                        _targetNode = _targetRootsInfo[_length - 1];
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
                _targetNode = _targetRoot;

                var _sourceNodeInfo = _sourceNode.checkSubNodes();

                _sourceNode.parseAttributes(_targetNode, mapConversion);
                if(_sourceNodeInfo){
                    _sourceRootsInfo.push(_sourceNodeInfo);
                    _targetRootsInfo.push(_targetNode);
                    _length ++;
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
                        return DocumentFactory.createDocument(_name);
                    case TreeType.HTMLDocument:
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
/**
 * Created by Administrator on 2014/12/24.
 */
define('MathUtil',['TypeCheck'],function(TypeCheck){
    var find = function(array, fn, compare){
        if(compare != -1){
            compare = 1;
        }
        if(TypeCheck.likeArray(array)){
            for(var i = 0, len = array.length, base = 0, ibase = 0, tmp; i < len; i++){
                if((tmp = fn && fn(i) * compare) >= base || (tmp = array[i] * compare) >= base){
                    base = tmp;
                    ibase = i;
                }
            }
        }
        return ibase;
    };

    var MathUtil = {
        isOdd: function(num){
            return num & 1;
        },
        isEven: function(num){
            return this.isOdd(num);
        },
        findMax: function(array, fn){
            return find(array, fn, 1)
        },
        findMin: function(array, fn){
            return find(array, fn, -1)
        }
    };

    return MathUtil;

});
/**
 * Created by Administrator on 2014/12/17.
 */
define('Layout',['Base', 'TypeCheck', 'CSSUtil', 'MathUtil'], function(Base, TypeCheck, CSSUtil, MathUtil){
    HTMLElement.implementMethods({
        getParent: function(){
            return this.parentNode || this.parentElement();
        },
        getStyle: function(type){
            if(window.getComputedStyle){
                HTMLElement.prototype.getStyle = function(type){
//                    console.info("ComputedStyle: " + type);
                    return window.getComputedStyle(this, null).getPropertyValue(CSSUtil.cssFormat(type));
                };
            }
            else if(this.currentStyle){
                HTMLElement.prototype.getStyle = function(type){
//                    console.info("CurrentStyle: " + type);
                    return this.currentStyle[type];
                };
            }
            else {
                HTMLElement.prototype.getStyle = function(type){
//                    console.info("Style: " + type);
                    return this.style[type];
                }
            }
            return this.getStyle(type);
        },
        getMessures: function(type){
            if(type = this.getStyle(type)){
                var arr = type.match(/(\d+)\.*\d*(\D*)$/);
                return {
                    digit: arr[1],
                    unit: arr[2]
                }
            }
        },
        getMessureDigits: function(type){
            if(type = this.getStyle(type)){
                return parseInt(type);
            }
            return 0;
        },
        show: function(){
            this.style.display = "block";
        },
        hide: function(){
            this.style.display = "none";
        },
        borderBox: function(){
            var direction = ["Top", "Right", "Bottom", "Left"],
                messures = ["margin", "border", "padding"],
                _size = [this.getMessureDigits("height"), this.getMessureDigits("width")];
            for(var i = 0, ilen = direction.length; i < ilen; i++){
                for(var j = 0, tmp = _size[MathUtil.isOdd(i)], jlen = messures.length; j < jlen; j++){
                    tmp -= this.getMessureDigits(messures[j] + direction[i]);
                }
                _size[MathUtil.isOdd(i)] = tmp;
            }
            this.style.height = _size[0] + "px";
            this.style.width = _size[1] + "px";
        },
        modifyStyle: function(fn, args){
            if(TypeCheck.isFunction(fn)){
                this.hide();
//                this[fn]();
                fn(args);
                this.show();
            }
        },
        setCenter: function(){
            var _style = this.style, _parent = this.getParent();
            if(_style.position == "static"){
                _style.margin = "auto";
                _style.marginTop = (_parent.getMessureDigits("width") - _parent.getMessureDigits("height"))/2 + "px";
            }
            else{
                _style.left = _parent.getMessureDigits("width")/2 + "px";
                _style.top = _parent.getMessureDigits("height")/2 + "px";
                _style.marginLeft = -parseInt(this.getMessureDigits("width"))/2 + "px";
                _style.marginTop = -parseInt(this.getMessureDigits("height"))/2 + "px";
            }
            return this;
        },
        setVerticalAlign: function(baseElement, direction){
            if(TypeCheck.isHTMLElement(baseElement)){
                direction = direction != "right";
                if(direction){
                    var margin = baseElement.getMessureDigits("marginLeft");
                }
                else{
                    margin = baseElement.getMessureDigits("marginLeft") + baseElement.getMessureDigits("width") -
                        (margin = this.getMessures("width")).digit + margin.unit;
                }
                this.style.marginLeft = margin;
            }
            return this;
        },
        setTextCenter: function(){
            this.style.textAlign = "center";
            this.style.lineHeight = this.getMessureDigits("height") + "px";
            return this;
        }
    });

    NodeList.implementMethods({
        show: function(){
            return this.each(function(){
                this.show();
            })
        },
        hide: function(){
            return this.each(function(){
                this.hide();
            })
        },
        setVerticalAlign: function(baseElement, direction){
            var _self = this, len = _self.length;
            if(TypeCheck.isString(baseElement)){
                direction = baseElement;
                if (direction != "right") {
//                    console.info("direction: " + direction);
                    var ibase = MathUtil.findMin(_self, function (i) {
//                        console.info("marginLeft: " + _self[i].getMessureDigits("marginLeft"));
                        return _self[i].getMessureDigits("marginLeft");
                    });
                }
                else {
                    ibase = MathUtil.findMax(_self, function (i) {
                        return _self[i].getMessureDigits("marginLeft") + _self[i].getMessureDigits("width");
                    });
                }
                baseElement = _self[ibase];
            }
            return _self.each(function(){
                this.setVerticalAlign(baseElement, direction);
            });
        },
        setTextCenter: function(){
            return this.each(function(){
                this.setTextCenter();
            });
        },
        borderBox: function(){
            return this.each(function(){
                this.borderBox();
            });
        },
        float: function(){
            return this.each(function(){
                this.style.display = "inline-block";
            });
        }
    });

});
/**
 * Created by Administrator on 2014/12/15.
 */
define('$',['TypeCheck', 'DocumentFactory', 'TreeType', 'CSSUtil', 'Layout'], function(TypeCheck, DocumentFactory, TreeType, CSSUtil, Layout){
    var slice = [].slice, concat = [].concat;

    Object.prototype.each = function(fn, args){
        if(TypeCheck.likeArray(this)){
            for(var i  = 0, len = this.length; i < len; i++){
                fn.apply(this[i], args);
            }
        }
        return this;
    };

    var $ = function(selector, context, count){
        context = context && context.nodeType == 1 && context || document;
        var nodeList = context.querySelectorAll(selector);
        if(nodeList.length > 1){
            return nodeList;
        }
        else if(nodeList.length == 1){
            return nodeList[0];
        }
        return null;
    };

    $.each = function(obj, fn, args){
        obj.each(fn, args);
        return obj;
    };

    $.createPanel = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            return DocumentFactory.parseTree(obj, TreeType.HTMLDocument, mapConversion);
        }
    };

    $.createXMLDocument = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            return DocumentFactory.parseTree(obj, TreeType.XMLDocument, mapConversion);
        }
    };

    $.parseXMLToString = function(xml){
        if(TypeCheck.isXMLDocument(xml)){
            return DocumentFactory.parseXMLToString(xml);
        }
    };

    $.merge = function(){
        for(var i = 0, len = arguments.length, arr = []; i < len; i++){
            if(TypeCheck.likeArray(arguments[i])) {
                concat.call(arr, slice.call(arguments[i]));
            }
        }
        return arr;
    };

    return $;
});
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
define("main", function(){});

