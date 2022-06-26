// 定义MVC
let MVC = (function(){
    // 三部分
    let Model = (function() {
        // 1.存储数据
        let _model = {};
        // 暴露接口
        return {
            // 存储数据
            set(key,value) {
                // 基于.切割属性名称
                let keys = key.split('.')     
                // 定义内部属性对象               
                let result = _model;
                // 获取最后一个属性
                let saveKey = keys.pop();
                // 遍历属性添加属性值
                keys.forEach(item => {
                    if(result[item] === undefined) {
                        // 默认属性值对象
                        result[item] = {};
                    }
                    // 如果属性值是引用类型可以添加
                    if(result[item] !== null && (typeof result[item] === 'object' || typeof result[item] === 'function')) { // 函数?
                        // 存储内部属性对象
                        result = result[item]
                    } else {
                        // 抛出错误
                        throw new Error (`属性 ${item}的数据类型是 ${typeof result[item]} ;不能添加属性!`)
                    }
                });
                // 存储最后一个属性
                result[saveKey] = value;
                // console.log(_model,this.get('ee.obj.msg.b'));
            },
            // 获取属性
            get (key) {
                let keys = key.split('.');
                let result = _model;
                // 遍历所有属性
                // keys.forEach(item => {
                //     result = result[item]; 
                //     if(result === undefined) {
                //         throw new Error(`属性 ${item} 值是undefined,不能继续遍历`)
                //     }   
                // })
                keys.some(item => {
                    result = result[item]
                    // return result === undefined;
                })

                // 返回结果
                return result;
            }
        }
    })()
    // 视图
    let View = (function() {
        // 存储渲染视图的方法
        let _view = {};
        // 暴露接口
        return {
            // 添加视图
            add(key,fn) {
                // 存储渲染视图的函数
                _view[key] = fn;
            },
            // 渲染方法
            render(key) {
                // 获取渲染方法,并传递对象
                return  _view[key] && _view[key](Model)
            }
        }
    })()
    // 控制器
    let Ctrl = (function() {
        let _ctrl = {};
        // 暴露接口
        return {
            //存储控制器
            add(key, fn) {
                // 直接存储
                _ctrl[key] = fn;
            },
            // 安装一个控制器
            init(key){
                // 获取控制器并执行
                return _ctrl[key] && _ctrl[key](Model, View)
            },
            //安装所有模块
            install() {
                // 遍历每一个控制器,将其安装
                for(let key in _ctrl) {
                    // 将其安装
                    this.init(key)
                }
            }
        };
    })()

    //暴露接口
    return {
        // 添加模型
        addModel(key,value) {
            Model.set(key,value)
            // 
        },
        // 添加视图
        addView(key,fn) {
            View.add(key,fn);
        },
        // 添加控制器
        addCtrl(key,value) {
            // 添加控制器
            Ctrl.add(key,value)
        },
        // 启动项目
        install() {
            // 执行控制器方法,安装所有的模块
            Ctrl.install();
        }
    }
})()