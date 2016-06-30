<ui-header :title='info.name'>
    <ui-header-back slot='left'></ui-header-back>
</ui-header>


<div class="course-detail">
    <!-- 课程简介 -->
    <div class="m-box">
        <div class="m-box__text">
            <div class="name">{{info.name}}</div>
            <div>适学人群：{{info.suitPerson}}</div>
            <div class="tip">
                <span class="highlight">￥</span><span class="highlight price">{{info.discountPrice}}</span>
                <span v-if="info.classNum">联盟优惠价({{info.classNum}}节课)</span>
                <span v-else>联盟优惠价</span>
                <del>￥{{info.orginPrice}}</del>
            </div>
            <div class="shield-con f-clearfix f-mt10">
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
    <!-- 机构信息 -->
    <div class="m-box">
        <a class="m-box__flex" :href='info.groupUrl'>
            <img class="size2" :src="info.group.logo" @error='getDefaultGroupImg'>
            <div class="item">
                <div class="name">{{info.group.groupName}}</div>
                <div class="tip">
                    综合评分 <span class="highlight3">{{info.group.groupScore>0?info.group.groupScore+"分":"暂无"}}</span>
                </div>
                <div class="tip">
                教学地点：{{info.address}}
                </div>
            </div>
            <i class="icon-arr-right"></i>
        </a>
    </div>
    <!-- 课程信息 -->
    <div class="m-box">
        <div class="m-box__title">
            课程信息
        </div>

        <div class="course-images" id="allimg" style="">

            <div class="img-con" id="courseImages" v-el:content >
                <img v-for="img in info.pics" :src="img.uri" alt="" @click="bigPic($event,$index)"/>
            </div>
            
            <div class="checkbigPic" id="checkLayer" style="display:none" 
            @click="hiddenPic()" >
                <div class="showPic" id="showPic">
                    <div class="mengImg" v-for="imgs in info.pics"             
                         @touchstart = "touchstarPic($event)" 
                         @touchmove = "touchmovePic($event,$index)"
                         @touchend="touchendPic($event,$index)">
                        <img  :src="imgs.uri" />
                    </div>
                </div>

                <p style="color:#fff;position:fixed;bottom:95px;text-align: center;width:100%">
                    <span class="imgsIndex"> </span> / {{info.pics.length}}
                </p>
            </div>
        </div>

        <div class="m-box__text">
            <div class="gray" v-if="info.provideTrial">此课程支持试听课，详情请电话咨询或在线咨询</div>
            <div class="gray f-mt10">班级人数</div>
            <div class="black">{{info.studentNum}}人</div>
            <div class="gray f-mt10" v-show="info.period">课程周期</div>
            <div class="black" v-show="info.period">{{info.period}}</div>
            <div class="gray f-mt10">上课时间</div>
            <div class="black">{{info.classRemark}}</div>
            <div class="gray f-mt10">课程介绍</div>
            <div class="black">{{{info.remark}}}</div>
        </div>
    </div>
    <!-- 机构老师 -->
    <div class="m-box" v-show="info.teacher">
        <div class="m-box__title">主讲老师</div>
        <a class="m-box__flex" v-for="item in info.teacher" :href='info.teacherUrl+"?id="+item.id'>
            <img class="size1" :src="item.profileImg"  @error='getDefaultTeacherImg(item)'>
            <div class="item">
                <div class="name">{{item.name}}</div>
                <div class="tip">{{item.teacherAge}}年教龄</div>
            </div>
            <i class="icon-arr-right"></i>
        </a>
    </div>
    
    <!-- 服务说明 -->
<!--     <div class="m-box">
        <div class="m-box__title">服务说明</div>
        <div class="m-box__text">{{{info.tos}}}</div>
    </div> -->

    <!-- 课程照片 要去掉 -->
    <!-- <div class="m-box" v-if='info.pics.length'>
        <div class="m-box__title">课程照片</div>
        <div class="course-images" id="courseImages">
            <img v-for="item in info.pics" :src="item.uri" @click="bigPic($event,$index)" @error='getDefaultCourseImg(item)'>
        </div>

        <div class="checkbigPic" id="checkLayer" style="display:none" 
            @click="hiddenPic()" >

            <div class="showPic" id="showPic">
                <div class="mengImg" v-for="items in info.pics"             
                     @touchstart = "touchstarPic($event)" 
                     @touchmove = "touchmovePic($event,$index)"
                     @touchend="touchendPic($event,$index)">
                    <img  :src="items.uri" />
                </div>
            </div>

            <span style="color:#fff;position:absolute;bottom:95px;text-align: center;width:100%">
                <span class="imgsIndex"> </span> / {{info.pics.length}}
            </span>
        </div>
    </div> -->

    <div class="m-b-div"></div>
    <div class="m-b-con">
        <div class="content">
            <a class="call" href="tel:{{info.group.telephone}}">
                <i class="icon-tel"></i>
                <div>电话咨询</div>
            </a>
            <button class="btn btn_big btn_block btn_orange" @click="submit">
                {{isSubmit?"正在提交...":"报名"}}
            </button>
        </div>
    </div>
</div>