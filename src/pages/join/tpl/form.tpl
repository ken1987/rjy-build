<!--@require ../css/data.less -->
<div class='p-form'>
    <div class="pact-data-tip">
        请您完善下列信息，有助于提高审核通过机率，谢谢！
    </div>
    <div class="pact-data">
        <validator name="validation">
            <span class="u-title">基本信息</span>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required">机构名称</label>
                    <div class="bd">
                        <input 
                            class="txt-input" 
                            type="text"
                            v-model="groupName"
                            v-validate:group-name="{required:true}"
                            @touched="blur($validation.groupName)"
                            @focus='focus($validation.groupName)'
                        >
                    </div>
                </div>
                <div class="form-group__tip" v-if="groupNameMsg">{{groupNameMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required">品牌名称</label>
                    <div class="bd">
                        <input 
                            class="txt-input" 
                            type="text"
                            v-model="brandName"
                            v-validate:brand-name="{required:true}"
                            @touched="blur($validation.brandName)"
                            @focus='focus($validation.brandName)'
                        >
                    </div>
                </div>
                <div class="form-group__tip" v-if="brandNameMsg">{{brandNameMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required">是否有营业执照</label>
                    <div class="bd">
                        <div class="m-choose_ib">
                            <label class="m-choose__item w50" :class='license==1?"on":""'>
                                <input 
                                    type="radio" 
                                    name='license' 
                                    value='1' 
                                    v-model="license">
                                是
                            </label>
                            <label class="m-choose__item w50" :class='license==0?"on":""'>
                                <input 
                                    type="radio" 
                                    name='license' 
                                    value='0' 
                                    v-model="license">
                                否
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required chain">是否连锁</label>
                    <div class="bd">
                        <div class="m-choose_ib f-mb10">
                            <label class="m-choose__item w50" :class='chain==1?"on":""'>
                                <input 
                                    type="radio" 
                                    name='chain' 
                                    value='1' 
                                    v-model="chain">
                                是
                            </label>
                            <label class="m-choose__item w50" :class='chain==0?"on":""'>
                                <input 
                                    type="radio" 
                                    name='chain' 
                                    value='0' 
                                    v-model="chain">
                                否
                            </label>
                        </div>
                        <div v-show='chain==1'>
                            <input 
                                class="txt-input" 
                                type="text" 
                                name='chainCount' 
                                style="width:46%;"
                                v-model='chainCount'
                                v-validate:chain-count=""
                                @touched="blur($validation.chainCount)"
                                @focus='focus($validation.chainCount)'> 
                            家
                        </div>
                    </div>
                </div>
                <div class="form-group__tip" v-if="chainCountMsg">{{chainCountMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required mt3">法定代表人</label>
                    <div class="bd">
                        <input 
                            class="txt-input" 
                            type="text"
                            v-model='legalPerson'
                            v-validate:legal-person="{required:true}"
                            @touched="blur($validation.legalPerson)"
                            @focus='focus($validation.legalPerson)'
                        >
                    </div>
                </div>
                <div class="form-group__tip" v-if="legalPersonMsg">{{legalPersonMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required">法定联系电话</label>
                    <div class="bd">
                        <input 
                            class="txt-input" 
                            type="text"
                            v-model='legalPhone'
                            v-validate:legal-phone="{required:true,mobile:true}"
                            @touched="blur($validation.legalPhone)"
                            @focus='focus($validation.legalPhone)'
                        >
                    </div>
                </div>
                <div class="form-group__tip" v-if="legalPhoneMsg">{{legalPhoneMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required">E-mail</label>
                    <div class="bd">
                        <input 
                            class="txt-input" 
                            type="text"
                            v-model='email'
                            v-validate:email="{required:true,email:true}" 
                            @touched="blur($validation)" 
                            @focus='focus($validation)'
                        >
                    </div>
                </div>
                <div class="form-group__tip" v-if="emailMsg">{{emailMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required">座机号</label>
                    <div class="bd">
                        <input 
                            class="txt-input" 
                            type="text"
                            v-model='telphone'
                            v-validate:telphone="{required:true,landlines:true}"
                            @touched="blur($validation.telphone)"
                            @focus='focus($validation.telphone)'
                        >
                    </div>
                </div>
                <div class="form-group__tip" v-if="telphoneMsg">{{telphoneMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item area">
                    <label class="form-group__title z-required">教学区域</label>
                    <div class="bd">
                        <select 
                            class="f-mb10" 
                            v-model='city' 
                            v-validate:city="{required:true}"
                            @touched="blur($validation.city)"
                        >
                            <option value=''>选择城市</option>
                            <option v-for='item in citys' :value='item.id'>{{item.name}}</option>
                        </select>
                        <br>
                        <select 
                            class="f-mb10" 
                            v-model='area'
                            v-validate:area="{required:true}"
                            @touched="blur($validation.area)"
                        >
                            <option value=''>选择地区</option>
                            <option v-for='item in areas' :value='item.id'>{{item.name}}</option>
                        </select>
                        <br>
                        <select 
                            v-model='region'
                            v-validate:region="{required:true}"
                            @touched="blur($validation.region)"
                        >
                            <option value=''>选择商圈</option>
                            <option v-for='item in regions' :value='item.id'>{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group__tip" v-if="areaMsg">{{areaMsg}}</div>
            </div>
            <div class="form-group">
                <div class="form-group__item">
                    <label class="form-group__title z-required mt3">详细地址</label>
                    <div class="bd">
                        <input class="txt-input" type="text"
                            v-model='address'
                            v-validate:address="{required:true}"
                            @touched="blur($validation.address)"
                            @focus='focus($validation.address)'>
                    </div>
                </div>
                <div class="form-group__tip" v-if="addressMsg">{{addressMsg}}</div>
            </div>
            <div class="form-group f-mb10">
                <div class="form-group__item">
                    <label class="form-group__title z-required">教学科目</label>
                    <div class="bd course">
                        <a class="btn btn_small btn_primary f-fr" @click='addSubject'>添加</a>
                        <input type="hidden"
                            v-model='subjects'
                            v-validate:subjects="{required:true}">
                        <select v-model='curSubject'>
                            <option selected value=''>选择科目</option>
                            <option v-for="item in allSubjects" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="tags">
                    <a class="u-tag" v-for="item in selectedSubjects">
                        {{item.name}}
                        <i @click='removeSubject($index)'>x</i>
                    </a>
                </div>
                <div class="form-group__tip" v-if="subjectsMsg">{{subjectsMsg}}</div>
            </div>
            <div class="f-mb10">
                <span class="u-title">星级申请</span>
                <span>（不同星级保证金不同）</span>
            </div>
            <div>请选择你想申请的星级</div>
            <div class="star-list">
                <a :class='grade==3?"on":""' @click='changeGrade(3)'>
                    <div class="title">申请三星级</div>
                    <div class="text">标准
                        <br>1.机构现有学生数量：100名~250名
                        <br>2.近一年整体销售额：60万~120万
                        <br>3.机构现有老师数量：3人以上
                        <br>4.教室数量：综合类4间以上；美术/舞蹈/语言表演2间以上；器乐5间以上；体育1间以上；
                        <br>5.经营时间：连续经营1年以上; 如营业执照无法达到1年，可提供租赁合同达到1年以上均可； 如提供租赁合同做为经营时间资质材料，要求租赁合同需与企业法人姓名一致。
                        <br>
                        <br>
                        立享服务
                        <br>1、润教育九项服务
                        <br>2、1次深圳电台栏目嘉宾老师连线
                    </div>
                 </a>
                 <a :class='grade==4?"on":""' @click='changeGrade(4)'>
                    <div class="title">申请四星级</div>
                    <div class="text">标准
                    <br>1.单店学员250名~400名
                    <br>2.近一年整体销售额：120万~180万
                    <br>3.机构现有老师数量：5-10人以上
                    <br>4.教室数量：综合类6间以上；美术/舞蹈/语言表演3间以上；器乐8间以上；体育1间以上；
                    <br>5.经营时间：连续经营1年以上; 如营业执照无法达到1年，可提供租赁合同达到1年以上均可； 如提供租赁合同做为经营时间资质材料，要求租赁合同需与企业法人姓名一致。
                    <br>
                    <br>
                    立享服务
                    <br>1、润教育九项服务
                    <br>2、15天润教育首页广告推荐；
                    <br>3、润·教育联盟活动自媒体署名1次（传播范围：全市覆盖）；
                    <br>4、3次深圳电台栏目嘉宾老师连线；
                    <br>5、微信公众账号主动推送3次；
                    </div>
                </a>
                <a :class='grade==5?"on":""' @click='changeGrade(5)'>
                    <div class="title">申请五星级</div>
                    <div class="text">标准
                    <br>1.单店学员400名以上
                    <br>2.近一年整体销售额：180万以上
                    <br>3.机构现有老师数量：10人以上
                    <br>4.教室数量：综合类8间以上；美术/舞蹈/语言表演4间以上；器乐10间以上；体育2间以上；
                    <br>5.经营时间：连续经营1年以上; 如营业执照无法达到1年，可提供租赁合同达到1年以上均可； 如提供租赁合同做为经营时间资质材料，要求租赁合同需与企业法人姓名一致。
                    <br>
                    <br>
                    立享服务
                    <br>1、润教育九项服务
                    <br>2、30天润教育首页广告推荐；
                    <br>3、润·教育联盟活动自媒体署名2次（传播范围：全市覆盖）；
                    <br>4、5次深圳电台栏目嘉宾老师连线；
                    <br>5、微信公众账号主动推送5次；
                    </div>
                </a>
            </div>
            <div class="btns">
                <button class="btn btn_gray btn_big" @click='$parent.prev'>上一步</button>
                <button class="btn btn_primary btn_big" @click='submit'>
                    <template v-if='!isLoading'>提交加盟信息</template>
                    <template v-if='isLoading'>正在提交数据</template>
                </button>
            </div>
        </validator>
    </div>
</div>