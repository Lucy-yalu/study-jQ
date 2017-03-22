(function (g) {
    var document = g.document,
        arr = [],
        push = arr.push,
        slice = arr.slice;

    function createInit(selector) {
        return new createInit.fn.init(selector);
    }

    createInit.fn = createInit.prototype = {
        constructor: createInit,
        length: 0,  // 保持createInit对象是位数组对象， 伪数组对象的特性 length为0
        // 将伪数组对象转化为真数组方法 <createInit对象>.toArray();
        toArray: function () {
            return slice.call(this);
            // slice方法 返回一个新的数组
            // slice() 方法可从已有的数组中返回选定的元素。
        },
        // get方法 获取索引对应的dom元素 若传入null和undefined 返回一个数组
        // 若传入 正值 返回该索引等一应的dom元素
        // 若传入负值 返回从伪数组倒着数索引对应的dom元素（-1是伪数组的最后一个元素， ）
        get: function (index) {
            if(index == null){
                return this.toArray();
            }else {
                // return index < 0 ? this[this.length + index] : this[index];
                return this[index < 0 ? this.length + index : index];
            }
        },
        // eq方法 根据索引返回dom元素 返回值是createInit类型（对象）
        // dom对象转化为createInit（jquery）对象
        eq: function (index) {
            return createInit(this[index < 0 ? this.length + index : index]);

        },
        // 获取createInit对象上的第一个元素 返回值为createInit类型
        first: function () {
            return this.eq(0);
        },
        // 获取createInit对象上的最后一个元素 返回值为createInit类型
        last: function () {
            return this.eq(-1);
        },
        // 遍历this上的dom元素 返回被遍历的对象
        each: function (callback) {
            createInit.each(this, callback);
            return this;
        },
        // 让伪数组对象在控制台上以真数组形式输出
        // 那么该对象就要有length属性 用splice方法
        splice: arr.splice
    };
    var init = createInit.fn.init = function (selector) {
        // push.apply(this, document.querySelectorAll( selector ));
        // selector 类型
        // 1无效值 null undefined ''
        if (!selector) {
            return this;
            // 2. 字符串
        } else if (createInit.isString(selector)) {
            // a html字符串->转化为dom元素
            if (createInit.isHTML(selector)) {
                push.apply(this, createInit.parseHTML(selector));
                // b 选择器
            } else {
                push.apply(this, document.querySelectorAll(selector));
            }
            //3. dom 将dom对象转化为createInit（jQuery对象）
        } else if (createInit.isDOM(selector)) {
            this[0] = selector;
            this.length = 1;
            // 4. dom数组或者维数组
        } else if (createInit.isArrayLike(selector)) {
            push.apply(this, selector);
            // 5. 函数 入口函数
        } else if (createInit.isFunction(selector)) {
            document.addEventListener('DOMContentLoaded', function () {
                selector();
            })
        }
    };

    init.prototype = createInit.fn;

    // 混入是继承  // 让原型上也有extend 实例对象也可以用
    createInit.extend = createInit.fn.extend = function () {
        var args = arguments,
            l = args.length,
            obj;
        for (var i = 0; i < l; i++) {
            obj = args[i];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    this[k] = obj[k];
                }
            }
        }
        return this;
    };
    createInit.extend({
        // 用来遍历数组 伪数组 对象
        each: function (obj, callback) {
            if(createInit.isArrayLike( obj )){
                // 师叔祖或是维数组 用for循环
                for(var i=0; i<obj.length; i++){
                    // 每次循环都要执行回调函数 改变this为当前元素 同时传入 当前元素索引和当前元素
                    // 判断回调函数的返回值 如果为false 结束循环break
                    if(callback.call(obj[i],i,obj[i]) === false) {
                        break;
                    }
                }
            }else {
                for(var i in obj){
                    if(callback.call(obj[i], i, obj[i])===false){
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
        unique: function ( arr ) {
            var ret = [];
            createInit.each(arr, function () {
                // this 当前遍历到的元素
                if(ret.indexOf(this)===-1){
                    ret.push(this);
                }
            })
            return ret;
        }
    })

    // 字符串类型判断
    createInit.extend({
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
            var type = createInit.type(obj),  // 获取obj的类型
                length = !!obj && 'length' in obj && obj.length;  // 获取obj的length属性值
            // 过滤函数和window
            if (type === 'function' || createInit.isWindow(obj)) {
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
    createInit.fn.extend({
        appendTo: function (target) {
            var that = this,
                ret = [],
                node;
            target = createInit(target);
            // target有三种类型 选择器 dom元素 dom数组  需要统一类型 昂便操作
            // 让target 在createInit函数内走一圈会返回一个createInit对象 就同意了类型
            target.each(function (i,elem) {  // 遍历目标
                that.each(function () {  // 遍历方法调用者
                    node = i == 0 ? this : this.cloneNode( true );
                    // 方法调用者只有一个 要添加到 多个目标身上 要拷贝
                    ret.push(node);
                    elem.appendChild(node);
                });
            });
            // 实现链式编程（每一个方法返回该方法的调用者或者返回一个新的createInit对象）
            return createInit(ret);
        },
        append: function ( sourse ) {
            sourse = createInit( sourse );
            sourse.appendTo(this);
            return this;
        },
        prependTo: function (target) {
            var ret = [],
                node;
            var that = this;
            target = createInit(target);
            target.each(function (i,elem) {
                // 获取当前目标的第一个子节点
                var firstChild = elem.firstChild;
                that.each(function () {
                    node = i == 0 ? this : this.cloneNode(true);
                    ret.push(node);
                    // 将得到的新节点，在firstChild前边给elem添加
                    elem.insertBefore(node,firstChild);
                })
            })
        return createInit(ret);
        },
        prepend: function ( sourse ) {
            sourse = createInit( sourse );
            sourse.prependTo(this);
            return this;
        },
        // 下一个元素节点 返回节点对象
        next: function () {
            var ret = [];
            this.each(function (i, elem) {
                var node = elem.nextSibling;
                while(node){
                    if(node.nodeType ===1){
                        ret.push(node);
                        break;
                    }
                    node = node.nextSibling;
                }
            })
            return createInit(ret);
        },
        // 所有的兄弟节点
        nextAll: function () {
            var ret = [];
            this.each(function (i, elem) {
                var node = elem.nextSibling;
                while (node){
                    if(node.nodeType ===1){
                        ret.push(node);
                    }
                    node = node.nextSibling;
                }
            });
            return createInit(createInit.unique(ret));
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
                // 传入的如果是字符串 要创建一个文本节点 插入 否则插入节点  要保证是createinit对象
                node = createInit(createInit.isString(node) ? document.createTextNode(node) : node);
                node.each(function (j, cur) {
                    elem.parentNode.insertBefore(i===0? cur:cur.cloneNode(true), elem);
                })
            })
        },
        after: function (node) {
            return this.each(function (i, elem) {
                var nextSibling = elem.nextSibling;
                node = createInit(createInit.isString(node)?document.createTextNode(node): node);
                node.each(function (j, cur) {
                    elem.parentNode.insertBefore(i===0?cur:cur.cloneNode(true),nextSibling);
                })
            })
        }

    });

    if (typeof define === 'function') {
        define(function () {
            return createInit;
        })
    } else if (typeof exports !== 'undefined') {
        module.exports = createInit;
    } else {
        g.$ = createInit;
    }

}(window));


