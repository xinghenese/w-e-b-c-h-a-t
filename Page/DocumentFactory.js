/**
 * Created by Administrator on 2014/12/3.
 */
define(['Base', 'TypeCheckExtender', 'TreeImpl', 'TreeType'], function(Base, TypeCheck, TreeImpl, TreeType){
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
                        _targetNode = _targetNode.getSubNodeByKey(_targetNodeName);//!!Never Used. getSubObjectByNodeName(_targetNode, _sourceNode.getName());
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