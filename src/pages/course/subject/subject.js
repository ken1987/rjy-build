/*
*课程列表页
* @require /libs/vue.js
* @require /components/components.js
* @require /utils/utils.js
*/


(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var modal = UI.modal;


    var courseListUrl = __uri('/pages/course/list/list.html'); //全部课程

    //状态
    var store = {
    	title:'分类',

    	//菜单分类
    	menus:[],
        isLoading : true,
    };

    //同步函数
    var mutations = {
    	updateCategory: function(data) {
            var n,
                newData = [];

            for (var i = 0, l = data.length; i < l; i++) {
                n = data[i];

                newData.push({
                    name: n.name,
                    id: n.id,
                    items: n.subCategories
                });
            }

        	function addpy(obj){
        		var name = obj.name;
        		switch(name){
        			case "器乐":
        				obj.pyname = "qiyue";
        				break;
        			case "声乐":
        				obj.pyname = "shengyue";	
        				break;
        			case "美术":
        				obj.pyname = "meishu";
        				break;
        			case "舞蹈":
        				obj.pyname = "wudao";
        				break;	
        			case "书法":
        				obj.pyname = "shufa";
        				break;
        			case "体育":
        				obj.pyname = "tiyu";
        				break;
        			case "表演":
        				obj.pyname = "biaoyan";
        				break;
        			case "生活":
        				obj.pyname = "shenghuo";
        				break;
        			case "其他":
        				obj.pyname = " ";
        				break;
                    case "语言表演":
                        obj.pyname = "biaoyan";
                        break;    
        			default:
        				obj.pyname = " ";						
        		}
        	}

            newData.map(addpy);

            store.isLoading = false;
            store.menus = newData;
        },

        // 数据格式化
        hotListFormat : function(data , urlBase){
            if(data && data.length){
                for (var i = 0; i < data.length; i++) {
                    var n = data[i];

                    for (var l = 0; l < n.subCategories.length; l++) {
                    	var m = n.subCategories[l];

                    	m.url = urlBase + m.id +"&subjectName="+m.name;

                    }

                }
            }

            store.menus = data;
        },         
    };

    //包含异步操作的函数

    var actions = {

    };


    //获取课程分类
    xhr({
        url: "{common}/course/category/onlinelist",
        success: function(data){
        	mutations.hotListFormat(data, courseListUrl + '?subjectId=');
        	mutations.updateCategory(data);
        },
        error: function(r, msg) {
            modal.alert({
                title: msg || '网络异常'
            });
        }
    });

    //视图
    new Vue({
        el: '#wrap',
        data: store,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-scroll-top': UI.scrollTop,
            'ui-loading': UI.loading
        },

        methods: actions
    });  

    //加载
    //actions.load();  
}(window));