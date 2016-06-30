/*
 * 课程评论
 * @require /libs/vue.js
 * @require /components/components.js
 * @require /utils/utils.js
 */

(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var id = utils.urlParse().search['id'];
    var modal = UI.modal;
    var h5uploader = utils.h5uploader;

    //七牛上传地址
    var qiniuUploadUrl = window.location.protocol === 'https:' ? 'https://up.qbox.me' : 'http://upload.qiniu.com';

    //获取token的url地址
    var tokenUrl = '{common}/upload/token';
    
    //错误提示文本
    var ERROR_TIP = {
        "F_DUPLICATE": "重复提交"
    };

    //状态
    var status = {
        isLoading: false,
        imgs: [],
        info: {
            orderId: id,
            content: '', //内容
            serviceScore: '', //服务态度
            courseScore: '', //课程内容
            envScore: '', // 教学环境
            proScore: '', // 专业水平
            imgs: [],
            percent: 0,
            isUpload: false,
        },
    };

    //同步函数
    var mutations = {
        beforeUpdate: function() {
            status.isLoading = true;
        },
        afterUpdate: function() {
            status.isLoading = false;
        },
        onUpdate: function() {
            modal.alert({
                title: '评论成功'
            });
            //window.location.href = __uri('/pages/user/order/order.html') + '?id=' + id;
            window.location.href = __uri('/user');
        }
    };

    //包含异步操作的函数
    var actions = {
        //添加评论
        addComment: function() {
            var info = status.info;
            if (!info.content) {
                modal.alert({
                    title: '请输入评论'
                });
                return;
            }
            if (info.content.length < 5) {
                modal.alert({
                    title: '评论长度不能少于5个字符'
                });
                return;
            }
            if (!info.serviceScore) {
                modal.alert({
                    title: '请为服务态度打分'
                });
                return;
            }
            if (!info.courseScore) {
                modal.alert({
                    title: '请为课程内容打分'
                });
                return;
            }
            if (!info.envScore) {
                modal.alert({
                    title: '请为教学环境打分'
                });
                return;
            }
            if (!info.proScore) {
                modal.alert({
                    title: '请为专业水平打分'
                });
                return;
            }

            mutations.beforeUpdate();

            info.imgs = info.imgs.join(",");

            xhr({
                url: "{student}/order/comment",
                type: 'post',
                data: info,
                success: function(data) {
                    mutations.afterUpdate();
                    mutations.onUpdate();
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
        },

        uploadImgs: function(event){
            if(status.imgs.length > 4){
                modal.alert({
                    title:"上传图片数量不能超过五张",
                });
                return;
            }else{
                var inputImg = document.getElementById('uploadImg');
                var imgPath = event.target.value;
                //console.log(inputImg.files[0]);
                xhr({
                    url: tokenUrl,
                    success: function(data) {
                        console.log("请求上传的token成功");
                        //console.log(data);
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
            }
        },

        closeImg:function(index){
            var inputValue = document.getElementById("uploadImg");
            status.imgs.splice(index,1);
            status.info.imgs.splice(index,1);
            inputValue.value = "";
        }, 

    };

    //视图
    new Vue({
        el: '#wrap',
        data: status,
        components: {
            'ui-header': UI.header,
            'ui-header-back': UI.headerBack
        },
        methods: actions
    });

    var uploadImg = function(key,token,actionUrl,accessURL,file){
       var info = status.info;
       info.percent = 0;

           var xhrs = new XMLHttpRequest();
           var formData = new FormData;

           xhrs.open('POST', actionUrl, true); 

           //进度条
           var progressbar = document.getElementById("progressbar");

            xhrs.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    console.log(evt.loaded);
                    var percentComplete = Math.round(evt.loaded  / evt.total * 100);

                    info.percent = percentComplete;
                    // console && console.log(percentComplete, ",", formatSpeed);
                    if(info.percent > 0){
                        info.isUpload = false;
                    }
                }
            }, false);


           if (key !== null && key !== undefined){
            formData.append('key', key);
            formData.append('token', token);
            formData.append('file', file);     
           } 
           

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
                        status.imgs.push(qiuniu_imgs_lookUrl);
                        status.info.imgs.push(body.key);
                    } else {
                        modal.alert({
                            title:"提示信息",
                            content:"网络异常,请重新上传"
                         });
                    }
                }
           };
    };

}(window));

