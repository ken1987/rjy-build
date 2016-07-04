<div class="group" :class='tpl'>
    <ui-header title='机构主页' type='2'>
        <ui-header-back slot='left' type='2'></ui-header-back>
    </ui-header>
    <div class="group__hd" @click='click'>
        <div class="logo">
            <img :src="logo" @error='getDefaultImg'>
        </div>
        <div class="name">
            {{groupName}}
        </div>
        <div class="score">
            综合评分：<span v-if="groupScore == 0 ">暂无</span>
            <span v-else>{{groupScore}}</span>
        </div>
        <div class="purpose">
            <i class="icon-bookmark"></i> {{tag}}
        </div>
    </div>
    <div class="group__bd">
        <div class="nav f-clearfix">
            <a class="about" href='./about'>
                <span>简介</span>
            </a>
            <a class="course" href='courses'>
                <span>课程</span>
            </a>
            <a class="comment" href='comment'>
                <span>学员评价</span>
            </a>
            <a class="activity" href='activitys'>
                <span>活动</span>
            </a>
            <a class="wall" href='wall'>
                <span>荣誉墙</span>
            </a>
            <a class="teacher" href='teacher'>
                <span>老师</span>
            </a>
            <a class="phone" :href='"tel://"+telephone'>
                <span>电话</span>
            </a>
            <a class="address" :href='mapUrl'>
                <span>{{address}}</span>
            </a>
        </div>
        <a class="sweepstake" v-for="item in broadcasts" :href='item.url'>
            <img :src="item.imgUrl">
        </a>
        <div class="course-list f-clearfix">
            <a class="item" v-for='item in recCourses' :href='courseUrl+"?id="+item.id'>
                <img :src="item.coverImg">
                <div class="title">{{item.title}}</div>
            </a>
            <a class="item" v-for='item in recActivities' :href='activityUrl+"?id="+item.id'>
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
