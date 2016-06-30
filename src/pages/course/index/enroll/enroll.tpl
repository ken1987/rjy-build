<!-- 头部 -->
<ui-header title='报名'>
    <ui-header-back slot='left'></ui-header-back>
</ui-header>
<!-- 简介 -->
<div class="m-box">
    <div class="m-box__flex">
        <img class="size2" :src="info.group.logo" @error='getDefaultGroupImg'>
        <div class="item">
            <div class="name">{{info.name}}</div>
            <div class="tip">{{info.group.groupName}}</div>
        </div>
    </div>
    <a class="m-box__flex" :href='"tel:"+info.group.telephone'>
        <i class="icon-call"></i>
        <div class="item">
            {{info.group.telephone}}
        </div>
        <i class="icon-arr-right"></i>
    </a>
</div>
<!-- 上课时间 -->
<div class="m-box">
    <div class="m-box__title">上课时间</div>
    <div class="m-box__text">
        <div class="black">{{info.classRemark}}</div>
    </div>
    <div class="m-box__text">
        <div class="highlight3">
            当您报名成功后，机构将与您联系并确定具体的上课时间
        </div>
    </div>
</div>
<!-- 课程介绍 -->
<div class="m-box">
    <div class="m-box__flex">
        <div class="item2">
            <div class="name">联盟优惠价</div>
        </div>
        <div class="item2 f-tar">
            <div class="tip">
                <span class="highlight">￥</span>
                <span class="price highlight">{{info.discountPrice}}</span>
            </div>
        </div>
    </div>
    <div class="m-box__text">
        <div class="black">
            底价承诺，欢迎举报，举报成功全额补差价
            <br>
            举报电话<span class="highlight3">4006822188</span>
        </div>
    </div>
</div>
<div class="g-con-b">
    <a class="btn btn_big btn_block" @click='enroll'>下一步</a>
</div>
