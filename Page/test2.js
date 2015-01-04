/**
 * Created by Administrator on 2014/12/15.
 */
define('TypeCheck',[],function(){
    var toString = ({}.toString),
        test = function(type, suffix){
            suffix = suffix && ("\\w*" + suffix);
            return function(variable){
                return toString.call(variable).search(new RegExp("\\[object\\s\\w*" + type + suffix +  "\\w*\\]$")) == 0;
            }
        },
        arrType = ["Undefined", "Number", "String", "Object", "Function", "Array", "Document", "Element",
            "XMLDocument", "XMLElement", "HTMLDocument", "HTML-Element", "NodeList"],
        TypeCheck = {};

    for(var i = 0, len = arrType.length; i < len; i++){
        var _type = arrType[i].split('-'), tmp = _type[1] || "";
        TypeCheck["is" + _type[0] + tmp] = test(_type[0], tmp);
    }

    return TypeCheck;

});
/**
 * Created by Administrator on 2014/12/3.
 */
define('Base',['TypeCheck'], function(TypeCheck){
    Object.prototype.iterate = function(fn, args){
        for(var key in this){
            if(this.hasOwnProperty(key)){
                fn.call(this, key, this[key], args);
            }
        }
        return this;
    };

    Array.prototype.each = function(fn, args){
        if(TypeCheck.isFunction(fn)){
            var _fn = fn.length ?
                //needs more info about the items and array
                function(item, index, args){
                    return fn(item, index, args);
                } :
                //needs no other info except for items.
                //items treated as subjects more than objects of the process.
                function(item){
                    return fn.call(item);
                };
            for(var i  = 0, len = this.length; i < len; i++){
                if(_fn(this[i], i, args)){
                    break;
                }
            }
        }
        return this;
    };

    Array.prototype.contains = function(item){
        var _contains = false;
        this.each(function(_item){
            return (_contains = _item == item);
        });
        return _contains;
    };

    NodeList.prototype.each = function(fn, args){
        return Array.prototype.each.call(this, fn, args);
    };

    Object.prototype.basicClone = function(){
        var _copy = new this.constructor;
        this.iterate(function(key){
            if(!TypeCheck.isFunction(this[key])){
                _copy[key] = this[key];
            }
        });
        return  _copy;
    };

    Object.prototype.addProperty = function(key, value){
        if (TypeCheck.isUndefined(this[key])){
            this[key] = value;
        }
        return this;
    };

    Object.prototype.addPropFromTemplate = function(objTemplate){
        var _self = this;
        objTemplate.iterate(function(key){
            _self[key] = objTemplate[key];
        });
        return this;
    };

    Object.prototype.merge = function(objTemplate){
        var _self = this;
        objTemplate.iterate(function(key){
            _self[key] = objTemplate[key];
        });
        return this;
    };

    Object.prototype.clearProperties = function(){
        for (var prop in this){
            if (this.hasOwnProperty(prop)){
                if(TypeCheck.isFunction(this[prop])){
                    this[prop] = null;
                }
                else if(!TypeCheck.isObject(this[prop])){
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

    Function.prototype.method = function(type, func){
        if (!this.prototype[type]){
            this.prototype[type] = func;
        }
        return this;
    };

    Function.prototype.superMethod = function(name){
        return (this.getAdapter() || this.prototype)[name];
    };

    Function.prototype.getName = function(){
        return ((this.toString()).match(/function\s(.*?)\(/))[1] || "Anonymous";
    };

    var _topClass = [];

    Function.prototype.implementMethods = function(funcObj, arrMethods, fnProcess){
        if(TypeCheck.isObject(funcObj) && funcObj){
            var _proto = this.prototype, _methods, _name;
            if(!this.hasOwnProperty("_methods")){
                this._methods = [];
            }
            _methods = this._methods;

            var _fn = function(process){
                return function(key){
                    var _method = funcObj[key];
                    if(TypeCheck.isFunction(_method)){
                        _proto[key] = process && process(_method) || _method;
                        _methods.push(key);
                    }
                }
            };

            if(TypeCheck.isArray(arrMethods) && arrMethods){
                if(TypeCheck.isFunction(fnProcess) && fnProcess){
                    console.info(fnProcess);
                    arrMethods.each(_fn(fnProcess));
                }
                else{
                    arrMethods.each(_fn());
                }
            }
            else{
                funcObj.iterate(_fn());
            }

            if(!_topClass.contains(_name = this.getName())){
                _topClass.unshift(_name);
            }
        console.info("_topClass: ");
        console.log("[" + _topClass + "]");
        console.log(_name + "  %cImplements: ", "color:green; font-weight:bold;");
        console.log("[" + _methods + "]");
        }
        return this;
    };

    Function.prototype.overrides = function(funcObj){
        var _proto = this.prototype, _methods, _super_methods, _name;
        if(!this.hasOwnProperty("_methods")){
            this._methods = [];
        }
        _methods = this._methods;

        //Test
        var _item = "";

        _topClass.each(function(item){
            return (_proto instanceof (item = window[_item = item])) && (_super_methods = item._methods);
        });

        if(_super_methods){
            _super_methods.each(function(item){
                if(funcObj.hasOwnProperty(item)){
                    _proto[item] = funcObj[item];
                    _methods.push(item);
                }
            });

            if(!_topClass.contains(_name = this.getName())){
                _topClass.unshift(_name);
            }
            console.info("_topClass: ");
            console.log("[" + _topClass + "]");
            console.log(_name + "  %cOverrides: ", "color:red; font-weight:bold;", _item);
//
            console.log("[" + _methods + "]");
        }


//        else{
//            funcObj.iterate(function(key){
//                if(TypeCheck.isFunction(_proto[key])){
//                    _proto[key] = this[key];
//                }
//            });
//        }


        return this;
    };

    Function.prototype.inherits = function(protoObj, fConstructor){
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

    Function.prototype.staticMethod = function(type, func){
        if (!this[type]){
            this[type] = func;
        }
        return this;
    };

});
/**
 * Created by Administrator on 2014/12/18.
 */
define('TypeCheckExtender',['Base', 'TypeCheck'], function(Base, TypeCheck){

    var TypeCheckExtender = new ((function(){
        this.isObjectReference = function(ref){
            return typeof ref === "object";
        };
        this.isNumber = function(num){
            return num === +num && isFinite(num);
        };
        this.likeNumber = function(num){
            return num == +num;
        };
        this.likeArray = function(list){
            return this.isNumber(list.length) && list[0];
        };
        this.isEmptyArray = function(array){
            return this.isArray(array) && !array;
        };
        this.isNonEmptyArray = function(array){
            return this.isArray(array) && array;
        };
        this.isEmptyObject = function(obj){
            return this.isObject(obj) && !obj;
        };
        this.isNonEmptyObject = function(obj){
            return this.isObject(obj) && obj;
        };
    }).inherits(TypeCheck));

//    TypeCheckExtender.isPrimitive = function(variables){
//        return typeof variables !== "object" && typeof variables !== "function";
//    };

//    TypeCheckExtender.isObjectReference = function(ref){
//        return typeof ref === "object";
//    };
//
//    TypeCheckExtender.isNumber = function(num){
//        return num === +num && isFinite(num);
//    };
//
//    TypeCheckExtender.likeNumber = function(num){
//        return num == +num;
//    };
//
//    TypeCheckExtender.likeArray = function(list){
//        return this.isNumber(list.length);
//    };
//
//    TypeCheckExtender.isEmptyArray = function(array){
//        return this.isArray(array) && !array;
//    };
//
//    TypeCheckExtender.isEmptyObject = function(obj){
//        return this.isObject(obj) && !obj;
//    };

    return TypeCheckExtender;

});
/**
 * Created by Administrator on 2015/1/1.
 */
define('BaseExtender',['Base', 'TypeCheckExtender'], function(Base, TypeCheck){
//    Array.prototype.each = function(fn, args){
//        if(TypeCheck.isFunction(fn)){
//            var _fn = fn.length ?
//                //needs more info about the items and array
//                function(item, index, args){
//                    fn(item, index, args);
//                } :
//                //needs no other info except for items.
//                //items treated as subjects more than objects of the process.
//                function(item){
//                    fn.call(item);
//                };
//            for(var i  = 0, len = this.length; i < len; i++){
//                _fn(this[i], i, args);
//            }
//        }
//        return this;
//    };
//    NodeList.prototype.each = function(fn, args){
//        return Array.prototype.each.call(this, fn, args);
//    };
//    Object.prototype.each = function(fn, args){
//        if(TypeCheck.likeArray(this)){
//            for(var i  = 0, len = this.length; i < len; i++){
////                if(fn.length){
////                    fn(this[i], i, args);
////                }
////                else{
////                    fn.apply(window, [this[i], i, args]);
////                }
//                fn.apply(this[i], args);//fn(this[i], args);   function(item, index, args);
//                //fn.call(this[i]); fn(this[i], i, args)
//            }
//        }
//        return this;
//    };
});
/**
 * Created by Administrator on 2014/12/15.
 */
define('TreeType',[],function(){
    return{
        Object: 1,
        Wrapper: 2,
        XMLDocument: 3,
        HTMLDocument: 4,
        DocumentFragment: 5
    };
});
/**
 * Created by Administrator on 2014/12/15.
 */
define('CSSUtil',['TypeCheckExtender'], function(TypeCheck){
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
            var result = "", _self = this;
            obj.iterate(function(key){
                result += _self.cssFormat(key) + ":" + obj[key] + ";";
            });
            return result;
        }
    };
});
/**
 * Created by Administrator on 2014/12/29.
 */
define('TreeImpl',['Base', 'TypeCheckExtender', 'TreeType', 'CSSUtil'], function(Base, TypeCheck, TreeType, CSSUtil){
    /*
     Interface Tree{
         getTreeType();
         getRoot();
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

    Document.overrides({
        getTreeType: function(){
            return TreeType.XMLDocument;
        },
        getRoot: function(){
            return this.documentElement;
        }
    });

    HTMLDocument.overrides({
        getTreeType: function(){
            return TreeType.HTMLDocument;
        },
        getRoot: function(){
//            return this.appendChild(document.createElement("div"));
            return document.createElement("div");
        }
    });

    DocumentFragment.overrides({
        getTreeType: function(){
            return TreeType.DocumentFragment;
        },
        getRoot: function(){
            if(!this.root){
                this.root = this.appendChild(document.createElement("div"));
            }
            return this.root;
        }
    });


    /*
     Interface Node{
         checkSubNodes();
         getSubNodeByKey(key);
         parseAttributes(targetNode, mapConversion);
         copyAttributes(key, value);
         createAndAppendChild(tag, tree, mapConversion);
     }
     */
    Object.implementMethods({
        checkSubNodes: function(){
            var _self = this;
            var _hasChild = false;
            var _subNodeKeys = [_self];
            _self.iterate(function(key){
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
            });
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
            this.iterate(function(key){
                var _value = this[key];
                if(!TypeCheck.isFunction(_value) && !TypeCheck.isObject(_value)  && !TypeCheck.isArray(_value)){
                    key = (mapConversion && mapConversion[key]) || key;
                    targetNode.copyAttributes(key, _value);
                }
            });
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

    Element.overrides({
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
                }while(!TypeCheck.isUndefined(_attrs[++i]));
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

    HTMLElement.overrides({
        createAndAppendChild: function(tag, tree, mapConversion){
            var arr = tag.split('-');
            tag = (mapConversion && mapConversion[arr[0]]) || arr[0];
            if(tag == "text"){
                return this.appendChild(document.createTextNode(arr[1] || ""));
            }
            return this.appendChild(document.createElement(tag));
        }
    });

    /*
    Invoke this method When the document has only one childnode, which results in heigher performance as
    useless steps omitted.
     */
    Document.prototype.simpleParse = function(){
        return this.documentElement.parseAttributes();
    };

});
/**
 * Created by Administrator on 2014/12/3.
 */
define('DocumentFactory',['BaseExtender', 'TypeCheckExtender', 'TreeImpl', 'TreeType'], function(Base, TypeCheck, TreeImpl, TreeType){
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
                if(!TypeCheck.isUndefined(_sourceNodeKey)){
                    _sourceNode = _rootInfo[0].getSubNodeByKey(_sourceNodeKey); //key is used to search a node
                    var _targetNodeName = _sourceNode.tagName || _sourceNodeKey;    //name is used to create a node
                    _targetNode = _targetRootsInfo[_length - 1].createAndAppendChild(_targetNodeName, _resultTree, mapConversion);
                    var _sourceNodeInfo = _sourceNode.checkSubNodes();  //check whether the sourceNode is a subRoot.
                    _sourceNode.parseAttributes(_targetNode, mapConversion);
                    if(_sourceNodeInfo){
                        _sourceRootsInfo.push(_sourceNodeInfo);
                        _targetRootsInfo.push(_targetNode);
                        _length ++;
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
                    case TreeType.DocumentFragment:
                        return document.createDocumentFragment();
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
define('MathUtil',['TypeCheckExtender'], function(TypeCheck){
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
define('Layout',['BaseExtender', 'TypeCheckExtender', 'CSSUtil', 'MathUtil'], function(Base, TypeCheck, CSSUtil, MathUtil){
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
            if(type = this.fetchOriginalStyle(type) || this.getStyle(type)){
                var arr = type.match(/(\d+)\.*\d*(\D*)$/);
                return {
                    digit: arr[1],
                    unit: arr[2]
                }
            }
        },
        getMessureDigits: function(type){
            if(type = this.fetchOriginalStyle(type) || this.getStyle(type)){
                return parseInt(type);
            }
            return 0;
        },
        //only cache the last-modified style
        cacheOriginalStyle: function(type){
            var _self = this;
            this.o_style = this.o_style || {};
            if(TypeCheck.isString(type)){
                _cacheSingleStyle(type);
            }
            else if(TypeCheck.isNonEmptyArray(type)){
                type.each(function(){
                    _cacheSingleStyle(this);
                })
            }
            return this;

            function _cacheSingleStyle(type){
                if(type && _self.getStyle(type)){
                    _self.o_style[type] = _self.getStyle(type);
                }
            }
        },
        fetchOriginalStyle: function(type){
            return type && this.o_style && this.o_style[type] || "";
        },
        show: function(value){
            this.style.display = value || this.fetchOriginalStyle("display") || "block";
            return this;
        },
        hide: function(){
            this.cacheOriginalStyle(["display", "width", "height", "top", "left", "font-size"]).style.display = "none";
            return this;
        },
        float: function(){
            this.style.display = "inline-block";
            return this;
        },
        borderBox: function(){
            var direction = ["Top", "Right", "Bottom", "Left"],
                messures = ["margin", "border", "padding"],
                _size = [this.getMessureDigits("height"), this.getMessureDigits("width")];
//            console.info("origin_width: " + _size[1]);
//            console.info("origin_height: " + _size[0]);
            for(var i = 0, ilen = direction.length; i < ilen; i++){
                for(var j = 0, tmp = _size[MathUtil.isOdd(i)], jlen = messures.length; j < jlen; j++){
                    tmp -= this.getMessureDigits(messures[j] + direction[i]);
//                    console.log(messures[j] + direction[i] + ": " + this.getMessureDigits(messures[j] + direction[i]));
//                    console.log("tmp: " + tmp);
                }
                _size[MathUtil.isOdd(i)] = tmp;
            }
//            console.info("_height: " + _size[0]);
//            console.info("_width: " + _size[1]);
            this.style.height = _size[0] + "px";
            this.style.width = _size[1] + "px";
            return this;
        },
        modifyStyle: function(fn, args){
            if(TypeCheck.isFunction(fn) || TypeCheck.isString(fn) && TypeCheck.isFunction(fn = this[fn])){
                this.hide();
//                this[fn]();
                fn.apply(this, args);
                this.show();
            }
            return this;
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

//    console.log(HTMLElement.prototype);
    NodeList.implementMethods({
        each: function(fn, args){
            return Array.prototype.each.call(this, fn, args);
        },
        setVerticalAlign: function (baseElement, direction) {
            var _self = this, len = _self.length;
            if (TypeCheck.isString(baseElement)) {
                direction = baseElement;
                if (direction != "right") {
                    var ibase = MathUtil.findMin(_self, function (i) {
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
            return _self.each(function () {
                this.setVerticalAlign(baseElement, direction);
            });
        },
        modifyStyle: function(fn, args){
            return HTMLElement.prototype.modifyStyle.call(this, fn, args);
        }
    });

    var arrElementMethods = ["show", "hide", "float", "borderBox", "setCenter", "setTextCenter"];

    NodeList.implementMethods(HTMLElement.prototype, ["show", "hide", "float", "borderBox", "setCenter", "setTextCenter"], function(method, self){
        return function(){
//            console.log("invoke");
            var args = arguments;   //cache arguments of outer anonymous function
            return this.each(function(){
                method.apply(this, args); //use apply method 'cause args: Arguments Object in nature
                //is an Array-like Object
            })
        }
    });

    console.log("show");
    console.log(NodeList.prototype.show);

});
/**
 * Created by Administrator on 2014/12/15.
 */
define('$',['TypeCheckExtender', 'DocumentFactory', 'TreeType', 'CSSUtil', 'Layout'], function(TypeCheck, DocumentFactory, TreeType, CSSUtil, Layout){
    var slice = [].slice, concat = [].concat;

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
//        if(TypeCheck.likeArray(obj)){
//            for(var i  = 0, len = obj.length; i < len; i++){
//                fn.apply(obj[i], args);
//            }
//        }
//        return obj;
        return  obj.each(fn, args);
    };

    $.createPanel = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            var _time = +(new Date());
            var fragment =  DocumentFactory.parseTree(obj, TreeType.DocumentFragment, mapConversion);
//            var fragment =  DocumentFactory.parseTree(obj, TreeType.HTMLDocument, mapConversion);
            console.log("time: " + ((+new Date()) - _time) + "ms");
//            return fragment;
            document.body.appendChild(fragment);
            return fragment.getRoot();
        }
        return null;
    };

    $.createXMLDocument = function(obj, mapConversion){
        if(TypeCheck.isObject(obj)){
            return DocumentFactory.parseTree(obj, TreeType.XMLDocument, mapConversion);
        }
        return null;
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
        $('#box_content, #btnSend', box).modifyStyle(function(){
            this.setVerticalAlign('right').setTextCenter();
        });

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

        $('#search, #search_button, #search_button2', view).float().modifyStyle(function(){
            this.borderBox().setTextCenter();
        });
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

