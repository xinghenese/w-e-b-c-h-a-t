/**
 * Created by Administrator on 2014/12/3.
 */
define(['../Base'], function(Base){
    var EventUtil = {
        addDomLoadEvent: function(fn){
            var _win = window, _doc = _win.document;
            var _init = function(e){
                if(e.type == "DOMContentLoaded"){
                    EventUtil.removeEventListener(_doc, e.type, _init, false);
                    fn.call(_win, e.type || e);
                }
                else if (e.type == "readystatechange" && _doc.readyState == "complete"){
                    EventUtil.removeEventListener(_doc, e.type, _init, false);
                    fn.call(_win, "lazy");
                }
            };
            EventUtil.addEventListener(_doc, "DOMContentLoaded", _init, false);
            EventUtil.addEventListener(_doc, "readystatechange", _init, false);
        },

        //重新设置handler，修复IE中事件注册方法作用域为全局且this指向window而非event.currentTarget的方法。//另外IE6、7、8执行handler顺序非按添加顺序（其中IE8逆序）
        addEventListener: function(element, event, handler, useCapture){
            var _addEvent;
            if(element.addEventListener){

                _addEvent = function(element, type, handler, useCapture){
                    element.addEventListener(type, handler, useCapture || false);
                }
            }
            else if(element.attachEvent){
                _addEvent = function(element, type, handler, useCapture){
                    _createListeners(element, type, handler);
                    _combineHandlers(element, type);
                    element.attachEvent("on" + type, element.listeners["_handler_"]);
                }
            }
            EventUtil.addEventListener = function(element, event, handler, useCapture){
                var _type = event.type || event;
                if(element instanceof Element || element.addEventListener || element.attachComment){
                    _addEvent(element, _type, handler, useCapture || false);
                }
                else{
                    _createListeners(element, _type, handler);
                }
            };
            return EventUtil.addEventListener(element, event, handler, useCapture);

            function _createListeners(element, type, handler){
                element.listeners = element.listeners || {};
                element.listeners[type] = element.listeners[type] || [];
                var _listeners = element.listeners[type];
                _listeners.push(handler);
            }
            function _combineHandlers(element, type){
                var _listeners = element.listeners[type];
                if(!_listeners["_handler_"]){
                    _listeners["_handler_"] = function(e){
                        e = e || window.event;
                        for(var i = 0, fn; fn = _listeners[i++];){
                            fn.call(element, e);
                        }
                    };
                }
            }
        },

        removeEventListener: function(element, event, handler, useCapture){
            var _removeEvent;
            if(element.removeEventListener){
                _removeEvent = function(element, type, handler, useCapture){
                    element.removeEventListener(type, handler, useCapture);
                }
            }
            else if(element.detachEvent){
                _removeEvent = function(element, type, handler, useCapture){
                    _removeListener(element, type, handler);
                    element.attachEvent("on" + type, element.listeners["_handler_"]);
                }
            }
            EventUtil.removeEventListener = function(element, event, handler, useCapture){
                var _type = event.type || event;
                if(element instanceof Element){
                    _removeEvent(element, _type, handler, useCapture);
                }
                else{
                    _removeListener(element, _type, handler);
                }
            };
            return EventUtil.removeEventListener(element, event, handler, useCapture);

            function _removeListener(element, type, handler){
                if(element.listeners && element.listeners[type]){
                    var _listeners = element.listeners[type];
                    var _index = _listeners.indexOf(handler);
                    if(_index > -1){
                        _listeners.splice(i,1);
                    }
                }
            }
        },

        getEventTarget: function(e){
            e = e || window.event;
            return e.target || e.srcElement;
        },

        delegateHandler: function(sourceElement, delegateElement, type, handler){
            if(!handler[type]){
                handler[type] = [sourceElement];
                this.addEventListener(delegateElement, type, function(e){
                    var _index =handler[type].indexOf(EventUtil.getEventTarget(e));
                    if(_index > -1){
                        handler.call(EventUtil.getEventTarget(e), e);
                        handler[type].splice(_index, 1);
                    }
                }, false);
            }
            else if(!handler[type][sourceElement]){
                handler[type].push(sourceElement);
            }
        },

        undelegateHandler: function(sourceElement, delegateElement, type, handler){
            if(!handler[type]){
                return false;
            }
            var _index = handler[type].indexOf(sourceElement);
            if(_index == -1){
                return false;
            }
            handler[type].splice(_index, 1);
            return true;
        },

        dispatchEvent: function(element, event){
            var _dispatch;
            if(element.dispatchEvent){
                _dispatch = function(element, event){
                    element.dispatchEvent(event);
                };
            }
            else if(element.fireEvent){
                _dispatch = function(element, event){
                    element.fireEvent("on" + event.type, event);
                }
            }
            EventUtil.dispatchEvent = function(element, event){
                if(element instanceof Element){
                    _dispatch(element, event);
                }
                else{
                    var _listeners = element.listeners[event.type];
                    for(var i  = 0, _len = _listeners.length; i < _len; i++){
                        _listeners[i].call(element, event);
                    }
                    var _handler = element["on" + event.type];
                    if(_handler){
                        _handler.call(element, event);
                    }
                }
            };
            return EventUtil.dispatchEvent(element, event);
        },

        stopPropogation: function(event){
            if(event.stopPropagation){
                EventUtil.stopPropogation = function(event){
                    event.stopPropogation();
                }
            }
            else{
                EventUtil.stopPropogation = function(event){
                    event.cancelBubble = true;
                }
            }
            EventUtil.stopPropogation(event);
        },

        preventDefault: function(event){
            if(event.preventDefault){
                EventUtil.preventDefault = function(event){
                    event.preventDefault();
                }
            }
            else{
                EventUtil.preventDefault = function(event){
                    event.returnValue = false;
                }
            }
            EventUtil.preventDefault(event);
        },

        createEvent: function(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget){
            if(document.createEvent){
                EventUtil.createEvent = function(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget){
                    var _event = document.createEvent("Events");
                    _event.initEvent(type, bubbles, cancelable);
                    _event.view = view || document.defaultView;
                    _event.detail = detail || CommonUtils.INT_NOT_SET;
                    _event.screenX = screenX || CommonUtils.INT_NOT_SET;
                    _event.screenY = screenY || CommonUtils.INT_NOT_SET;
                    _event.clientX = clientX || CommonUtils.INT_NOT_SET;
                    _event.clientY = clientY || CommonUtils.INT_NOT_SET;
                    _event.altKey = altKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.ctrlKey = ctrlKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.shiftKey = shiftKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.metaKey = metaKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.button = button || CommonUtils.INT_NOT_SET;
                    _event.relatedTarget = relatedTarget;
                    return _event;
                };
            }
            else{
                EventUtil.createEvent = function(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget){
                    var _event = document.createEventObject();
                    _event.type = type;
                    _event.cancelBubble = bubbles || CommonUtils.BOOLEAN_NOT_SET;
                    _event.cancelable = cancelable;
                    _event.view = view || document.defaultView;
                    _event.detail = detail || CommonUtils.INT_NOT_SET;
                    _event.screenX = screenX || CommonUtils.INT_NOT_SET;
                    _event.screenY = screenY || CommonUtils.INT_NOT_SET;
                    _event.clientX = clientX || CommonUtils.INT_NOT_SET;
                    _event.clientY = clientY || CommonUtils.INT_NOT_SET;
                    _event.altKey = altKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.ctrlKey = ctrlKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.shiftKey = shiftKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.metaKey = metaKey || CommonUtils.BOOLEAN_NOT_SET;
                    _event.button = button || CommonUtils.INT_NOT_SET;
                    _event.relatedTarget = relatedTarget;
                    return _event;
                };
            }
            return EventUtil.createEvent(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
        },

        createSimpleEvent: function(type){
            return EventUtil.createEvent(type, false, false);
        },

        createCustomEvent: function(type, bubbles, cancellable, data){
            var _event = EventProxy.createInstance();
            _event.setProperty("type", type).setProperty("bubbles", bubbles).setProperty("cancellable", cancellable).setProperty("data", data).setProperty("timeStamp", +(new Date));
            return _event;
        }
    };

    var EventProxy = Proxy.createProxyFromTemplate({
        type:               CommonUtils.STRING_NOT_SET,
        target:             CommonUtils.OBJECT_NOT_SET,
        currentTarget:      CommonUtils.OBJECT_NOT_SET,
        eventPhase:         CommonUtils.INT_NOT_SET,
        bubbles:            CommonUtils.BOOLEAN_NOT_SET,
        cancellable:        CommonUtils.BOOLEAN_NOT_SET,
        timeStamp:          CommonUtils.INT_NOT_SET,
        data:               CommonUtils.STRING_NOT_SET
    });

    return EventUtil;
});