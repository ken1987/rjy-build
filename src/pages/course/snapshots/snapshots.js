/*
 * 活动详情
 * @require '/libs/vue.js'
 * @require "/components/components.js"
 * @require "/utils/utils.js"
 */
(function(window) {
    var Vue = window.Vue;
    var UI = window.RUI;
    var utils = window.RUtils;
    var modal = UI.modal;
    var xhr = utils.xhr;
    var id = utils.urlParse().search['id'];

    //状态
    var status = {
        name: "课程详情",
        isLoading: false,
        info: null,
        oldposition: 0,
    };

    //同步函数
    var mutations = {
        afterUpdate: function() {
            status.isLoading = false;
        },
        beforeUpdate: function() {
            status.isLoading = true;
        },
        onUpdate: function(data) {
            status.info = data;
        }
    };

    //包含异步操作的函数
    var actions = {
        load: function() {
            if (status.isLoading) return;

            mutations.beforeUpdate();

            xhr({
                url: "{student}/order/course",
                data: {
                    orderId: id
                },
                success: function(data) {
                    mutations.onUpdate(data);
                    mutations.afterUpdate();
                },
                error: function(r, msg) {
                    mutations.afterUpdate();
                    modal.alert({
                        title: msg || '网络异常'
                    });
                }
            });
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

        methods: {
            getDefaultGroupImg: function() {
                this.info.group.logo = __uri('/components/default/jigou_logo@2x.png');
            },
            getDefaultTeacherImg: function(item) {
                item.profileImg = __uri('/components/default/laoshi@2x.png');
            },
            getDefaultCourseImg: function(item) {
                item.uri = __uri('/components/default/jigoukecheng_list@2x.png');
            },

            //展示蒙层
            bigPic: function(event,index){

                var layer = document.getElementById('checkLayer');

                if(event.target.nodeName == "IMG"){
                    layer.style.display="block";
                //给layer 设置宽高
                    layer.style.width = document.body.clientWidth + "px";
                    layer.style.height = document.body.clientHeight - document.body.scrollTop + "px";
                //给蒙层的 img src 赋值
                    var layerImg = document.getElementById("showPic");
                    layerImg.style.width = document.body.clientWidth * 10 + "px";

                //控制当前 图片的显示
                    var showPicHtml = document.getElementsByClassName("mengImg");

                    for (var i = 0, l = showPicHtml.length; i < l; ++i) {
                        showPicHtml[i].style.width = document.body.clientWidth + "px";

                        var indexImg = showPicHtml[i].getElementsByTagName('IMG')[0];
                        var newimg = new Image();
                        newimg.src = indexImg.src;
                        var bili = document.body.clientWidth / newimg.width;
                        indexImg.style.top = (parseInt(window.screen.height) - newimg.height * bili - 80) / 2 + "px";
                    }

                    layerImg.style.left = - document.body.clientWidth * index + "px";

                    //设置初始的页码
                    document.getElementsByClassName("imgsIndex")[0].innerHTML = index + 1;
                } 
            },

            //在此点击 隐藏蒙层 
            hiddenPic:function(){
                var layer = document.getElementById('checkLayer');
                var showPicHtml = document.getElementsByClassName("mengImg");
                
                for (var i = 0, l = showPicHtml.length; i < l; ++i) {
                     showPicHtml[i].removeAttribute('style'); 
                }

                layer.style.display = "none";
            },

            touchstarPic: function(e){
                //测试数据用
                var bigimg = this.info.pics;
                if(bigimg.length>=0){
                    e.preventDefault(); //处理微信中，不能一直触发touchmove的问题
                    this.starX = e.changedTouches[0].clientX;
                    console.log(this.starX);
                }
            },

            touchmovePic: function(e,index){
                var showPicHtml = document.getElementsByClassName("mengImg");
                this.movedX = e.changedTouches[0].clientX;
                var fromX = this.movedX - this.starX;
                if(index>0){
                    if(fromX>0){

                        showPicHtml[index - 1].style.webkitTransform = 'translateX('+fromX+'px)';
                        showPicHtml[index].style.webkitTransform = 'translateX('+fromX+'px)';

                    }
                }
            },

            touchendPic: function(e,index){
               var showPicHtml = document.getElementsByClassName("mengImg");
               var layerImg = document.getElementById("showPic");

               this.endX = e.changedTouches[0].clientX;
               var oldX = this.starX;
               var moveX = this.endX - oldX;
               //查看便宜 move 的距离
               //console.log(moveX);
               var lastMove = document.body.clientWidth - moveX;

               var bigimg = this.info.pics;
               if(moveX > 0){  // 向右滑
                 if(index>0){
                    //过度效果
                     layerImg.style.left = - document.body.clientWidth * (index-1) + "px";
                     showPicHtml[index - 1].style.webkitTransform = "translateX("+lastMove+"px)";
                     showPicHtml[index - 1].style.webkitTransform = 'translateX(0px)';
                     document.getElementsByClassName("imgsIndex")[0].innerHTML = index;
                 }else{
                    console.log("已经到第一页了");
                 }
                   

               } else if(moveX < 0){  // 向左滑

                 if(index<bigimg.length-1){
                    //过度效果
                     layerImg.style.left = - document.body.clientWidth * (index+1) + "px";
                     showPicHtml[index].style.webkitTransform = "translateX("+ -lastMove+"px)";
                     showPicHtml[index + 1].style.webkitTransform = 'translateX(0px)';
                     document.getElementsByClassName("imgsIndex")[0].innerHTML = index + 2;

                 }else{
                    console.log("已经到最后一页了");
                 }

               }else{
                 this.hiddenPic();
               }
            },

            touchUIstart:function(e){
                //绑定事件
                var dom = this.$els.content;
                var bigimg = this.info.pics;
                if(bigimg.length>=0){
                    e.preventDefault(); //处理微信中，不能一直触发touchmove的问题
                    this.starX = e.changedTouches[0].clientX;
                }
                
            },


            touchUImove:function(e,index){
                //绑定事件
                var dom = this.$els.content;

                this.touchMove = e.changedTouches[0].clientX;

                this.movedX = this.touchMove - this.starX;

                var movedX = status.oldposition + this.movedX;

                console.log(movedX,this.movedX);

                var testUL = document.getElementById("courseImages");
                var UlWidth = testUL.clientWidth;  // 874
                var lookWidth = document.body.clientWidth; //414
                var leftMaxdistance = UlWidth - lookWidth;

                   if(movedX < 0){  // 向右滑
                    //过度效果  
                        if(movedX > - parseInt(leftMaxdistance)){
                            dom.style.webkitTransform = "translateX("+ movedX +"px)"; 
                        }else{
                            dom.style.webkitTransform = "translateX("+  - parseInt(leftMaxdistance) +"px)"; 
                        }
                         

                   }else if(movedX > 0){  // 向左滑
                        
                        dom.style.webkitTransform = "translateX("+ 0 +"px)";  
                        
                   }else{

                        dom.style.webkitTransform = "translateX("+ movedX +"px)";
                   }
                   
                
            },

            touchUIend:function(e,index){
                //绑定事件
                var bigimg = this.info.pics;
                var dom = this.$els.content;
                this.endX = e.changedTouches[0].clientX;

                var oldX = this.starX;
                var moveX = this.endX - oldX;
                status.oldposition = status.oldposition + moveX;
            },    

            //移动事件
            onPan: function(distance) {
                var dom = this.$els.content;

                var testUL = document.getElementById("courseImages");
                var allimg = document.getElementById("allimg");
                var UlWidth = testUL.clientWidth;  // 874
                var lookWidth = document.body.clientWidth; //414
                var leftMaxdistance = UlWidth - lookWidth;

                this.distance -= distance;

                console.log(this.distance,leftMaxdistance);

                if(this.distance < 0 ){    //向左推
                    testUL.style.webkitTransform = 'translateX(0px)';
                    this.distance = 0;
                    
                }else{

                   if(this.distance < leftMaxdistance){
                        testUL.style.webkitTransform = 'translateX('+ -this.distance +'px)'; 

                    }else{
                        testUL.style.webkitTransform = 'translateX('+ -leftMaxdistance +'px)';
                        //this.distance  = -leftMaxdistance;
                    }
                     
                }
            },

        
        },

        ready: function() {
            //绑定事件
            var dom = this.$els.content;
            //var dom = document.getElementById("courseImages");
            console.log(dom);
            var callback = this.onPan;
            var startX, endX, curX, oldX;

            var _start = function(e) {
                var t = e.changedTouches[0]; // 获取当前 事件的
                startX = curX = t.clientX; //开始的坐标和 当前的坐标相等
                console.log(startX);
                this.addEventListener('touchmove', _move, false);
                this.addEventListener('touchend', _end, false);
            };

            var _move = function(e) {
                var t = e.changedTouches[0];
                endX = t.clientX; // 此时为结束的坐标
                oldX = parseInt(this.style.left);
                //兼容 安卓手机 QQ 浏览器滑动不顺滑的bug
                e.preventDefault();

                callback(endX - curX, curX - startX, oldX);
                curX = endX; //此时当前的 坐标等于 结束时候的坐标
            };

            var _end = function(e) {
                this.removeEventListener('touchmove', _move);
                this.removeEventListener('touchend', _end);
            };
        //dom.addEventListener('touchstart', _start, false);
        },

    });

    
    //初始化
    actions.load();

}(window));
