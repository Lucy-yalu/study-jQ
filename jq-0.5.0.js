(function (g) {
    var document = g.document,
        arr = [],
        push = arr.push,
        slice = arr.slice;

    function jQuery(selector) {
        return new jQuery.fn.init(selector);
    }

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        length: 0,  // 保持jQuery对象是位数组对象， 伪数组对象的特性 length为0
        // 将伪数组对象转化为真数组方法 <jQuery对象>.toArray();
        toArray: function () {
            return slice.call(this);
            // slice方法 返回一个新的数组
            // slice() 方法可从已有的数组中返回选定的元素。
        },
        // get方法 获取索引对应的dom元素 若传入null和undefined 返回一个数组
        // 若传入 正值 返回该索引等一应的dom元素
        // 若传入负值 返回从伪数组倒着数索引对应的dom元素（-1是伪数组的最后一个元素， ）
        get: function (index) {
            if (index == null) {
                return this.toArray();
            } else {
                // return index < 0 ? this[this.length + index] : this[index];
                return this[index < 0 ? this.length + index : index];
            }
        },
        // eq方法 根据索引返回dom元素 返回值是jQuery类型（对象）
        // dom对象转化为jQuery（jquery）对象
        eq: function (index) {
            return jQuery(this[index < 0 ? this.length + index : index]);

        },
        // 获取jQuery对象上的第一个元素 返回值为jQuery类型
        first: function () {
            return this.eq(0);
        },
        // 获取jQuery对象上的最后一个元素 返回值为jQuery类型
        last: function () {
            return this.eq(-1);
        },
        // 遍历this上的dom元素 返回被遍历的对象
        each: function (callback) {
            jQuery.each(this, callback);
            return this;
        },
        // 让伪数组对象在控制台上以真数组形式输出
        // 那么该对象就要有length属性 用splice方法
        splice: arr.splice
    };
    var init = jQuery.fn.init = function (selector) {
        // push.apply(this, document.querySelectorAll( selector ));
        // selector 类型
        // 1无效值 null undefined ''
        if (!selector) {
            return this;
            // 2. 字符串
        } else if (jQuery.isString(selector)) {
            // a html字符串->转化为dom元素
            if (jQuery.isHTML(selector)) {
                push.apply(this, jQuery.parseHTML(selector));
                // b 选择器
            } else {
                push.apply(this, document.querySelectorAll(selector));
            }
            //3. dom 将dom对象转化为jQuery（jQuery对象）
        } else if (jQuery.isDOM(selector)) {
            this[0] = selector;
            this.length = 1;
            // 4. dom数组或者维数组
        } else if (jQuery.isArrayLike(selector)) {
            push.apply(this, selector);
            // 5. 函数 入口函数
        } else if (jQuery.isFunction(selector)) {
            document.addEventListener('DOMContentLoaded', function () {
                selector();
            })
        }
    };

    init.prototype = jQuery.fn;

    // 混入是继承  // 让原型上也有extend 实例对象也可以用
    jQuery.extend = jQuery.fn.extend = function () {
        var args = arguments,
            l = args.length,
            i = 0,
            obj,
            target = this;  // 默认给this扩展  若果传参个数大于1  给第一个参数扩展
        if(l>1){
            target = args[0] || {};
            i = 1;
        }
        for (; i < l; i++) {
            obj = args[i];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    target[k] = obj[k];
                }
            }
        }
        return target;
    };
    jQuery.extend({
        // 用来遍历数组 伪数组 对象
        each: function (obj, callback) {
            if (jQuery.isArrayLike(obj)) {
                // 师叔祖或是维数组 用for循环
                for (var i = 0; i < obj.length; i++) {
                    // 每次循环都要执行回调函数 改变this为当前元素 同时传入 当前元素索引和当前元素
                    // 判断回调函数的返回值 如果为false 结束循环break
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (var i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        // 获取内置对象类型
        type: function (obj) {
            if (obj == null) {
                return obj + '';
            }
            return typeof obj !== 'object' ? typeof obj : Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        },
        // 将html字符串转换为dom元素节点
        parseHTML: function (html) {
            var ret = [], // 存储所有创建的dom元素
                div,
                node;
            div = document.createElement('div');
            div.innerHTML = html;
            for (node = div.firstChild; node; node = node.nextSibling) {
                if (node.nodeType === 1) {
                    ret.push(node);
                }
            }
            return ret;
        },
        // 对数组去重
        unique: function (arr) {
            var ret = [];
            jQuery.each(arr, function () {
                // this 当前遍历到的元素
                if (ret.indexOf(this) === -1) {
                    ret.push(this);
                }
            })
            return ret;
        }
    })

    // 字符串类型判断
    jQuery.extend({
        // 是否为字符串
        isString: function (obj) {
            return typeof obj === 'string';
        },
        // 是否为html html标签的特点 <字母>
        isHTML: function (obj) {
            return obj.charAt(0) === '<' && obj.charAt(obj.length - 1) === '>' && obj.length >= 3;
        },
        // 是否为数组或者是伪数组 伪数组的判断： 过滤函数和window 因为他们的length属性不表示元素的个数
        // （函数的length表示形参的个数 window的lengt表示页面中ifame的个数）
        // length = 0 就认为是伪数组
        // length大于0 必须保证 obj具有length-1索引
        // 因为不管是普通数组还是稀疏数组都必须具有length-1索引
        isArrayLike: function (obj) {
            var type = jQuery.type(obj),  // 获取obj的类型
                length = !!obj && 'length' in obj && obj.length;  // 获取obj的length属性值
            // 过滤函数和window
            if (type === 'function' || jQuery.isWindow(obj)) {
                return false;
            }
            return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;

        },
        // 是否为Dom元素 Dom元素的特点 不能为null 和undefined  并且具有nodeType属性
        isDOM: function (obj) {
            // （1）!!obj 若是null或undefined 加一个！会转化为true  在加一个！会转化为false
            // false不往下执行&&  会过滤掉null 和undefined 情况
            // （2）obj.nodeType 是一个数字 要转化为 true 或 false 用!!转化
            return !!obj && !!obj.nodeType;
        },
        // 是否为函数
        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        // 是否为window对象 window对象有一个特性 window对象上有一个window属性指向自己
        isWindow: function (obj) {
            // 保证不是null或是undefined
            return !!obj && obj.window === obj;
        }
    });
    // DOM操作模块
    jQuery.fn.extend({
        appendTo: function (target) {
            var that = this,
                ret = [],
                node;
            target = jQuery(target);
            // target有三种类型 选择器 dom元素 dom数组  需要统一类型 昂便操作
            // 让target 在jQuery函数内走一圈会返回一个jQuery对象 就同意了类型
            target.each(function (i, elem) {  // 遍历目标
                that.each(function () {  // 遍历方法调用者
                    node = i == 0 ? this : this.cloneNode(true);
                    // 方法调用者只有一个 要添加到 多个目标身上 要拷贝
                    ret.push(node);
                    elem.appendChild(node);
                });
            });
            // 实现链式编程（每一个方法返回该方法的调用者或者返回一个新的jQuery对象）
            return jQuery(ret);
        },
        append: function (sourse) {
            sourse = jQuery(sourse);
            sourse.appendTo(this);
            return this;
        },
        prependTo: function (target) {
            var ret = [],
                node;
            var that = this;
            target = jQuery(target);
            target.each(function (i, elem) {
                // 获取当前目标的第一个子节点
                var firstChild = elem.firstChild;
                that.each(function () {
                    node = i == 0 ? this : this.cloneNode(true);
                    ret.push(node);
                    // 将得到的新节点，在firstChild前边给elem添加
                    elem.insertBefore(node, firstChild);
                })
            })
            return jQuery(ret);
        },
        prepend: function (sourse) {
            sourse = jQuery(sourse);
            sourse.prependTo(this);
            return this;
        },
        // 下一个元素节点 返回节点对象
        next: function () {
            var ret = [];
            this.each(function (i, elem) {
                var node = elem.nextSibling;
                while (node) {
                    if (node.nodeType === 1) {
                        ret.push(node);
                        break;
                    }
                    node = node.nextSibling;
                }
            })
            return jQuery(ret);
        },
        // 所有的兄弟节点
        nextAll: function () {
            var ret = [];
            this.each(function (i, elem) {
                var node = elem.nextSibling;
                while (node) {
                    if (node.nodeType === 1) {
                        ret.push(node);
                    }
                    node = node.nextSibling;
                }
            });
            return jQuery(jQuery.unique(ret));
        },
        // 删除节点  连自己也删除
        remove: function () {
            return this.each(function () {  // this是指调用者  each方法的返回值是调用者this
                this.parentNode.removeChild(this);  // this是指遍历当前元素
            });
        },
        // 清空元素 清空除了自己的子节点
        empty: function () {
            return this.each(function () {
                this.innerHTML = '';
            });
        },
        // 在指定的节点前面插入新的节点
        before: function (node) {
            return this.each(function (i, elem) {
                // 传入的如果是字符串 要创建一个文本节点 插入 否则插入节点  要保证是jQuery对象
                node = jQuery(jQuery.isString(node) ? document.createTextNode(node) : node);
                node.each(function (j, cur) {
                    elem.parentNode.insertBefore(i === 0 ? cur : cur.cloneNode(true), elem);
                })
            })
        },
        after: function (node) {
            return this.each(function (i, elem) {
                var nextSibling = elem.nextSibling;
                node = jQuery(jQuery.isString(node) ? document.createTextNode(node) : node);
                node.each(function (j, cur) {
                    elem.parentNode.insertBefore(i === 0 ? cur : cur.cloneNode(true), nextSibling);
                })
            })
        },
        prev: function () {
            var ret = [];
            this.each(function (i, elem) {
                while( (elem = elem.previousSibling) &&  (elem.nodeType !== 1)){}
                if(elem){
                    ret.push(elem);
                }
            });
            return jQuery(ret);
        },
        prevAll: function () {
            var ret = [];
            this.each(function (i, elem) {
                while (elem = elem.previousSibling){
                    if(elem.nodeType === 1){
                        ret.push(elem);
                    }
                }
            });
            return jQuery(jQuery.unique(ret));
        },
        parent: function () {
            var ret = [];
            this.each(function () {
               if(this.parentNode){
                   ret.push(this.parentNode);
               }
            });
            return jQuery(jQuery.unique(ret));
        },
        parents: function () {
            var ret = [];
            this.each(function (i, elem) {
                while (elem = elem.parentNode){
                    ret.push(elem);
                }
            });
            return jQuery(jQuery.unique(ret));
        },
        siblings: function () {
            var ret = [];
            this.each(function (i, elem) {
                var node = elem.parentNode.firstChild;
                while (node){
                    if(node !== elem &&　node.nodeType === 1){
                        ret.push(node);
                    }
                    node = node.nextSibling;
                }
            });
            return jQuery(jQuery.unique(ret));
        }

    });
    // 控制属性的驼峰命名法
    jQuery.propFix = {
        'class': 'className',
        'for': 'htmlFor'
    };
    jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function () {
        jQuery.propFix[this.toLowerCase()] = this;
    });

    // 属性模块 jQuery实例 设置 或 获取
    jQuery.fn.extend({
        // attr 获取或设置指定元素的属性
        // 参数只有一个的时候 若为对象-设置属性  若不是对象-获取属性
        // 参数有两个的时候 是设置属性
        attr: function (name, value) {
            // 只有一个参数
            if (value == undefined) {
                // 参数只有一个而且是对象 是设置属性
                if (typeof name === 'object') {
                    this.each(function (i, elem) {
                        for (var k in name) {
                            elem.setAttribute(k, name[k]);
                        }
                    });
                    // 参数只有一个 不是对象 是获取属性
                } else {
                    return this.length === 0 ? undefined : this[0].getAttribute(name);
                }
                // 两个参数 是设置属性
            } else {
                this.each(function () {
                    this.setAttribute(name, value);
                });
            }
            return this;
        },
        // 由于attr只有获取修改set/getAttribute设置的属性 而和用户交互的属性不能获取设置
        // 所以封装prop方法 不使用set/getAttribute 直接使用对象的方式添加属性
        prop: function (name, value) {
            var propName;
            if (value == undefined) {
                if (typeof name === 'object') {
                    this.each(function (i, elem) {
                        for (var k in name) {
                            propName = jQuery.propFix[k] || k;
                            elem[propName] = name[k];
                        }
                    });
                } else {
                    propName = jQuery.propFix[name] || name;
                    return this.length === 0 ? undefined : this[0][propName];
                }
            } else {
                this.each(function () {
                    propName = jQuery.propFix[name] || name;
                    this[propName] = value;
                });
            }
            return this;
        },
        // 获取或设置value属性值
        val: function (value) {
            // 没有参数  表示获取value的值
            if (value == undefined) {
                return this.length === 0 ? undefined : this[0].value;
            } else {
                return this.each(function () {
                    this.value = value;
                });
            }
        },
        // 获取或设置内容 要是html标签字符串 会解析成标签
        html: function (html) {
            // 获取内容
            if (html == undefined) {
                return this.length === 0 ? undefined : this[0].innerHTML;
                // 设置内容
            } else {
                return this.each(function () {
                    this.innerHTML = html;
                });
            }
        },
        text: function (txt) {
            var ret = '';
            if (txt == undefined) {
                this.each(function () {
                    ret += this.textContent;
                });
                return ret;
            } else {
                return this.each(function () {
                    this.textContent = txt;
                });
            }
        }

    });
    // 样式模块  jQuery实例调用 方法写在暴露在外面的函数原型上
    jQuery.fn.extend({
        // 判断指定的元素上是否有该类名 有返回true 没有返回false
        hasClass: function (className) {
            var ret = false;
            this.each(function () {
                if (this.classList.contains(className)) {
                    // 判断正确  不能直接return 若是return 是return each 并不是该放法的返回值
                    ret = true;
                    return false;
                }
            });
            return ret;
        },
        // 给指定的元素添加类名
        addClass: function (className) {
            return this.each(function () {
                if (!jQuery(this).hasClass(className)) {
                    this.classList.add(className);
                }
            });
        },
        // 删除指定的样式 若不传参数表示全部删除
        removeClass: function (className) {
            return this.each(function () {
                className == undefined ? this.className = '' : this.classList.remove(className);
            });
        },
        // 切换指定类  如果指定的元素含有该类 则删除  没有则添加 （有则删除， 无则添加）
        toggleClass: function (className) {
            return this.each(function () {
                // 1 使用封装好的方法
                // if(jQuery(this).hasClass(className)){
                //     jQuery(this).removeClass(className);
                // }else {
                //     jQuery(this).addClass(className);
                // }
                //  2 原生
                if (this.classList.contains(className)) {
                    this.classList.remove(className);
                } else {
                    this.classList.add(className);
                }
            });
        },
        // 获取或设置样式 一个参数 参数类型为对象时 是设置  为字符串时为获取 两参数是设置
        // 设置时可以使用style  获取不可以
        css: function (name, value) {
            if (value == undefined) {
                if (typeof name === 'object') {
                    this.each(function () {
                        for (var k in name) {
                            (this.nodeType === 1) && (this.style[k] = name[k]);
                        }
                    });
                } else {
                    return this.length === 0 ? undefined : g.getComputedStyle(this[0])[name];
                }
            } else {
                this.each(function () {
                    this.style[name] = value;
                });
            }
            return this;
        }
    });
    // 事件模块
    jQuery.fn.extend({
        // // 点击事件   一些快捷的事件都是一样的代码 只是事件名字不一样样而已 改变一种方法书写
        // click: function (callback) {
        //     return this.each(function () {
        //         this.addEventListener('click', callback);
        //     });
        // },
        // dblclick: function (callback) {
        //     return this.each(function () {
        //         this.addEventListener('dblclick', callback);
        //     });
        // }

        on: function (type, callback) {
            return this.each(function () {
               this.addEventListener(type, callback);
            });
        },
        off: function (type, callback) {
            return this.each(function () {
                this.removeEventListener(type, callback);
            });
        }
    });
    // split 把字符串分割成一个数组  遍历这个数组
    jQuery.each(('click dblclick keydown keypress keyup mouseover mouseout mouseenter mouseleave mousemove' +
    'mousedown mouseup focus blur load').split(' '),function (i, type) {
        // 给jQuery的原型添加放法 并赋值
        // this-> 数组元素
        jQuery.fn[type] = function (callback) {
            return this.on(type,callback);
        };
    });

    // ajax模块
    // 创建请求对象
    function createRequest() {
        // XMLHttpRequest是兼容其他浏览器 ActiveXObject是兼容IE的
        return window.XMLHttpRequest ? new window.XMLHttpRequest() :
               new window.ActiveXObject('XMLHTTP');
    };
    // 格式化数据 将字{name: yang, age: 18} 转化为 name=yang&age=18
    function formateData(data) {
        var ret = [];
        for(var k in data){
            ret.push(window.encodeURIComponent(k) + '=' + window.encodeURIComponent(data[k]));
        }
        return ret.join('&');
    };
    jQuery.extend({
        ajaxSettings: {
            url: '',
            type: 'get',
            data: {},
            dataType: 'json',
            success: null,
            fail: null,
            async: true,
            contentType: 'application/x-www-form-urlencoded',
            jsonp: 'callback',  // 指定参数名字
            jsonpCallback: 'cd', // 指定全局函数名字
            timeout: 0
        },
        ajax: function (config) {
            // 过滤无效值 必须传参 必须传url
            if(!config || !config.url){
                return;
            }
            // 用户配置信息和默认信息的整合
            // 用户手动添加选项config放在后面 若放在前面会被默认的选项配置ajaxSettings覆盖
            var context = {};
            jQuery.extend(context, jQuery.ajaxSettings, config);

            // 跨域
            if(context.dataType.toLowerCase() === 'jsonp'){
                // 创建请求对象
                // 创建script标签 在全局下
                var scriptElem = document.createElement('script'),
                    headElem = document.getElementsByTagName('head')[0];
                headElem.appendChild(scriptElem);

                // 创建全局函数
                var callbackName = context.jsonpCallback || ('jsonp_'+Math.random()).replace('.', '');
                // 给data对象添加一个属性 为jsonp对应的值 并赋值为全局回调函数的名字
                context.data[context.jsonp] = callbackName;
                // 创建全局函数
                g[callbackName] = function (data) {
                    // 成功

                    // 清除延时函数
                    g.clearTimeout(scriptElem.timer);
                    // 请求完成（成功或失败都是完成）删除script标签 避免太多 页面越来越大  删除回调函数
                    headElem.removeChild(scriptElem);
                    delete g[callbackName];

                    context.success && context.success(data);

                }

                // 格式化数据
                context.url += '?' + formateData(context.data);
                // console.log(context.url);

                // 监听请求状态
                if(context.timeout){
                    scriptElem.timer = g.setTimeout(function () {
                        // 失败

                        // 请求完成 卸磨杀驴
                        headElem.remove(scriptElem);
                        delete g[callbackName];

                        context.fail && context.fail({'message':'请求超时'});

                    },context.timeout);
                }
                // 发送请求
                scriptElem.src = context.url;

            }else {
                // 创建请求对象
                var xhr = createRequest();

                // 格式化数据
                var postData = formateData(context.data);

                // 请求方式 请求地址
                if(context.type.toLowerCase() === 'get'){
                    context.url += '?' + postData;
                    postData = null;
                }
                xhr.open(context.type.toLowerCase(), context.url, context.async);

                // 设置请求头
                ( context.type.toLowerCase() === 'post' ) &&
                (xhr.setRequestHeader('Content-Type',context.contentType));

                // 监听并处理处理响应
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === 4){
                        if(xhr.status >= 200 && xhr.status <300 || xhr.status === 304){
                            // 根据用户配置的数据类型左转换
                            var data = context.dataType.toLowerCase() === 'json' ?
                                JSON.parse(xhr.responseText) : xhr.responseText;
                            // 如果指定了成功的回调函数 就执行
                            context.success && context.success(data, context, xhr);
                        }else {

                            context.fail && context.fail({'message': '请求失败'}, context, xhr);
                        }
                    }
                }

                // 发送请求
                xhr.send();
            }


        }
    })


    if (typeof define === 'function') {
        define(function () {
            return jQuery;
        })
    } else if (typeof exports !== 'undefined') {
        module.exports = jQuery;
    } else {
        g.$ = jQuery;
    }

}(window));



