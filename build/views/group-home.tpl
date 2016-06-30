<!DOCTYPE html>
<html>

<head>
    <title>润教育-专业才艺教学服务平台 [好机构 尽在润教育联盟] | 润·教育才艺教学服务联盟</title>
    <meta charset="UTF-8">
    <meta name="keywords" content="钢琴培训,美术培训,器乐培训,声乐培训,舞蹈培训,古琴培训,书法培训,古筝培训">
    <meta name="description" content="为加入到联盟的各个才艺类教学培训机构提供强大的品牌、广告宣传、线上线下引流、活动比赛、技术支撑等服务，提升联盟机构的招生率、利润率、营业收入、知名度等。促进整个联盟更好地为学员提供高品质的才艺教学服务，让才艺学习变得更加便捷、高效、安全、有趣，从而提升联盟整体才艺教学服务水平！">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="renderer" content="webkit">
    <link rel="icon" href="//h5.runjiaoyu.com.cn/static/components/head/favicon_2879a17.ico">
    <script>
        ! function(N, M) {
            function L() {
                var a = I.getBoundingClientRect().width;
                a / F > 540 && (a = 540 * F);
                var d = a / 10;
                I.style.fontSize = d + "px", D.rem = N.rem = d
            }
            var K, J = N.document,
                I = J.documentElement,
                H = J.querySelector('meta[name="viewport"]'),
                G = J.querySelector('meta[name="flexible"]'),
                F = 0,
                E = 0,
                D = M.flexible || (M.flexible = {});
            if (H) {
                console.warn("将根据已有的meta标签来设置缩放比例");
                var C = H.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
                C && (E = parseFloat(C[1]), F = parseInt(1 / E))
            } else {
                if (G) {
                    var B = G.getAttribute("content");
                    if (B) {
                        var A = B.match(/initial\-dpr=([\d\.]+)/),
                            z = B.match(/maximum\-dpr=([\d\.]+)/);
                        A && (F = parseFloat(A[1]), E = parseFloat((1 / F).toFixed(2))), z && (F = parseFloat(z[1]), E = parseFloat((1 / F).toFixed(2)))
                    }
                }
            }
            if (!F && !E) {
                var y = N.navigator.userAgent,
                    x = (!!y.match(/android/gi), !!y.match(/iphone/gi)),
                    w = x && !!y.match(/OS 9_3/),
                    v = N.devicePixelRatio;
                F = x && !w ? v >= 3 && (!F || F >= 3) ? 3 : v >= 2 && (!F || F >= 2) ? 2 : 1 : 1, E = 1 / F
            }
            if (I.setAttribute("data-dpr", F), !H) {
                if (H = J.createElement("meta"), H.setAttribute("name", "viewport"), H.setAttribute("content", "initial-scale=" + E + ", maximum-scale=" + E + ", minimum-scale=" + E + ", user-scalable=no"), I.firstElementChild) {
                    I.firstElementChild.appendChild(H)
                } else {
                    var u = J.createElement("div");
                    u.appendChild(H), J.write(u.innerHTML)
                }
            }
            N.addEventListener("resize", function() {
                clearTimeout(K), K = setTimeout(L, 300)
            }, !1), N.addEventListener("pageshow", function(b) {
                b.persisted && (clearTimeout(K), K = setTimeout(L, 300))
            }, !1), "complete" === J.readyState ? J.body.style.fontSize = 14 * F + "px" : J.addEventListener("DOMContentLoaded", function() {
                J.body.style.fontSize = 14 * F + "px"
            }, !1), L(), D.dpr = N.dpr = F, D.refreshRem = L, D.rem2px = function(d) {
                var c = parseFloat(d) * this.rem;
                return "string" == typeof d && d.match(/rem$/) && (c += "px"), c
            }, D.px2rem = function(d) {
                var c = parseFloat(d) / this.rem;
                return "string" == typeof d && d.match(/px$/) && (c += "rem"), c
            }
        }(window, window.lib || (window.lib = {}));

    </script>
    <link rel="stylesheet" href="//h5.runjiaoyu.com.cn/static/base_dbd3271.css" />
    <link rel="stylesheet" href="//h5.runjiaoyu.com.cn/static/pages/group/index/index_aae90cd.css" />
</head>

<body id="wrap">
    <div class="group" :class='template'>
        <ui-header title='机构主页' type='2'>
            <ui-header-back slot='left' type='2'></ui-header-back>
        </ui-header>
        <div class="group__hd">
            <div class="logo">
                <img :src="info.logo" @error='getDefaultImg'>
            </div>
            <div class="name">
                {{info.groupName}}
            </div>
            <div class="score">
                综合评分：<span v-if="info.groupScore == 0 ">暂无</span>
                <span v-else>{{info.groupScore}}</span>
            </div>
            <div class="purpose">
                <i class="icon-bookmark"></i> {{info.tag}}
            </div>
        </div>
        <div class="group__bd">
            <div class="nav f-clearfix">
                <a class="about" :href='aboutUrl'>
                    <span>简介</span>
                </a>
                <a class="course" :href='courseListUrl'>
                    <span>课程</span>
                </a>
                <a class="comment" :href='commentUrl'>
                    <span>学员评价</span>
                </a>
                <a class="activity" :href='activityListUrl'>
                    <span>活动</span>
                </a>
                <a class="wall" :href='wallUrl'>
                    <span>荣誉墙</span>
                </a>
                <a class="teacher" :href='teacherUrl'>
                    <span>老师</span>
                </a>
                <a class="phone" :href='"tel://"+info.telephone'>
                    <span>电话</span>
                </a>
                <a class="address" :href='mapUrl'>
                    <span>{{info.address}}</span>
                </a>
            </div>
            <div class="course-list f-clearfix">
                <a class="item" v-for='item in info.recCourses' :href='courseUrl+"?id="+item.id'>
                    <img :src="item.coverImg">
                    <div class="title">{{item.title}}</div>
                </a>
                <a class="item" v-for='item in info.recActivities' :href='activityUrl+"?id="+item.id'>
                    <img :src="item.coverImg">
                    <div class="title">{{item.title}}</div>
                </a>
            </div>
        </div>
        <div class="group__ft">
            <div class="title">润教育联盟机构</div>
            <div class="shield-con f-clearfix">
                <div class="shield">
                    <i class="icon-shield"></i>认证机构
                </div>
                <div class="shield">
                    <i class="icon-shield"></i>底价承诺
                </div>
                <div class="shield">
                    <i class="icon-shield"></i>消费保障
                </div>
                <div class="shield">
                    <i class="icon-shield"></i>无忧售后
                </div>
            </div>
        </div>
    </div>

    <script src="//h5.runjiaoyu.com.cn/static/base_6165191.js"></script>
    <script src="//h5.runjiaoyu.com.cn/static/pages/group/index/index_87fffb9.js"></script>
    <script>
        //百度统计
        (function() {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?1f38589f2608c598151499fb0b1f27c7";
            var s = document.getElementsByTagName("body")[0];
            s.appendChild(hm);
        })();

    </script>
</body>

</html>
