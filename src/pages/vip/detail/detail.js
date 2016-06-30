/*
 * 投诉
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 * @require "/libs/vue-validator.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var id = utils.urlParse().search['id'];
    var modal = UI.modal;
    var validators = utils.validators;
    var VueValidator = window.VueValidator;

    //七牛上传地址
    var qiniuUploadUrl = window.location.protocol === 'https:' ? 'https://up.qbox.me' : 'http://upload.qiniu.com';

    //获取token的url地址
    var tokenUrl = '{common}/upload/token';

    //图片上传的方法
    var uploadImg = function(key,token,actionUrl,accessURL,file){
           var info = status.info;

           var xhrs = new XMLHttpRequest();
           var formData = new FormData;

           xhrs.open('POST', actionUrl, true); 

           if (key !== null && key !== undefined) formData.append('key', key);
           formData.append('token', token);
           formData.append('file', file);

           xhrs.send(formData); 
           xhrs.onreadystatechange = function() {
                if (xhrs.readyState == 4) {
                    var body = xhrs.responseText;
                    if (xhrs.status >= 200 && xhrs.status < 300 ||
                        xhrs.status == 304) {
                        if(body){
                            body = JSON.parse(body);
                        }
                        var qiuniu_imgs_lookUrl = accessURL +"/"+ body.key;
                        
                        xhr({
                            type:"post",
                            url: "{customer}/vip/update",
                            data: {
                                id: status.info.id,
                                type: 1,
                                value: body.key
                            },
                            success: function(data){
                                info.logo = qiuniu_imgs_lookUrl;
                            },
                            error: function(r, msg) {
                                mutations.afterUpdata();
                                modal.alert({
                                    title: msg || '网络异常'
                                });
                            }
                        });
                        

                    } else {
                        modal.alert({
                            title:"提示信息",
                            content:"网络异常,请重新上传"
                         });
                    }
                }
           };
    };

    //状态
    var status = {
        info: {
            mobile: "",
            bgcovor:"covor",
        },
        isLoading: false,
        dialog: null,
        show: {
            show:false,
            title: "",
            index: null,
            type: "confirm",
            confirmText: "保存",
            context: null,
        },
        editText:["logo","address","hours","mobile","intro"],
    };


    var mutations = {
        afterUpdata: function(){
        },

        onUpdata: function(data){
            if(!data.logo){
                data.logo = __uri('/components/default/vip.png');
            }

            if(!data.background){
                data.background = __uri('/components/default/vip-bg.png');

            }
            
            status.info = data;
        }   
    };



    //包含异步操作的函数
    var actions = {
        load: function(){
            xhr({
                url: "{customer}/vip/info",
                data: "",
                success: function(data){
                    mutations.onUpdata(data);
                },
                error: function(r, msg) {
                    mutations.afterUpdata();
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },

        editInfo: function(index){  
            status.show.show = true;
            status.show.index = index;
                switch (index){
                    case 1:
                        status.show.title = "logo";
                        status.show.aretext = status.info;
                        break;
                    case 2:
                        status.show.title = "地址";
                        status.show.aretext = status.info.address; 
                        break;  
                    case 3:
                        status.show.title = "营业时间";  
                        status.show.aretext = status.info.hours;
                        break;
                    case 4:
                        status.show.title = "电话";  
                        status.show.aretext = status.info.mobile;
                        break;
                    case 5:
                        status.show.title = "简介";  
                        status.show.aretext = status.info.intro;
                        break;
                    default:
                        status.show.title = "修改信息";   
                        status.show.aretext = "";            
                }
        },

        confirm: function(){
            status.show.show = false;
            var typeIndex = status.show.index;
            var chengeText = status.editText[typeIndex -1];

            if(!this.$validation.valid){
                modal.alert({
                    title:"输入内容不能为空",
                });
                return;
            }else{
                xhr({
                    type:"post",
                    url: "{customer}/vip/update",
                    data: {
                        id: status.info.id,
                        type: typeIndex,
                        value: status.show.context
                    },
                    success: function(data){
                        console.log(data);    
                            status.info[chengeText] = status.show.context;
                        status.show.context = undefined;
                    },

                    error: function(r, msg) {
                        mutations.afterUpdata();
                        modal.alert({
                            title: '输入内容过多或者格式不对' || '网络异常'
                        });
                    }
                });  
            }
        },

        cancel: function(){
            status.show.show = false;
            status.show.context = undefined;
        },

        uploadImgs: function(event){
            var inputImg = document.getElementById('uploadImg');
            var imgPath = event.target.value;

            var info = status.info;
            
            //上传之前设置token
            xhr({
                url: tokenUrl,
                success: function(data) {
                    console.log("请求上传的token成功");
                    var d = data[0];

                    if(d){
                       status.info.isUpload = true; 
                       //传入四个参数
                       var key = d.key;
                       var token = d.uploadToken;
                       var accessURL = d.accessUrl; //上传后预览地址
                       var Qiniu_UploadUrl = "http://upload.qiniu.com"; //上传地址
                       var file = inputImg.files[0]; //上传内容

                       uploadImg(key,token,Qiniu_UploadUrl,accessURL,file);
                        
                    }
                    
                },
                error: function() {
                    console.log("请求上传的token失败");
                }
            });
        },        
    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        validators: validators, //扩展验证方法
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack,
            'ui-dialog': UI.dialog,
        },
        methods: actions
    });
    
    //初始化
    actions.load();

}(window));
