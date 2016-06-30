<!--@require ../css/check.less -->
<div class="p-checkinfo">
    <validator name="validation">
        <div class="group"> 
            <div class="item i01" :class="contactNameMsg?'z-error':''">
                <input 
                	type="text"  
                	placeholder="请输入联系人或负责人的姓名"
                    v-model="contactName"
                    v-validate:contact-name="{required:true}"
                    @touched="blur($validation.contactName)"
                    @focus='focus($validation.contactName)'
                >
            </div>
            <div class="error" v-if="contactNameMsg">{{contactNameMsg}}</div>
        </div>
        <div class="group">
            <div class='group__in'>
                <div class="item i02" :class="imgCodeMsg?'z-error':''">
                    <input
                        type="text" 
                        placeholder="请输入图片验证码"
                        v-model='imgCode'
                        v-validate:img-code="{required:true,len:4}"
                        @touched="blur($validation.imgCode)"
                        @focus='focus($validation.imgCode)'
                    >
                </div>
                <div class="imgcode">
                    <ui-imgcode :token.sync='token'></ui-imgcode>
                </div>
            </div>
            <div class="error" v-if="imgCodeMsg">{{imgCodeMsg}}</div>
        </div>
        <div class="group"> 
            <div class="item i02" :class="contactPhoneMsg?'z-error':''">
                <input 
                	type="text"
                	placeholder="负责人手机号"
                    v-model='contactPhone'
                    v-validate:contact-phone="{required:true,mobile:true}"
                    @touched="blur($validation.contactPhone)"
                    @focus='focus($validation.contactPhone)'
                >
                <button @click='sendCodeSMS' :class='sended?"sended":""'>
                    <template v-if='!sended'>获取短信验证码</template>
                    <template v-if='sended==1'>正在发送中</template>
                    <template v-if='sended==2'>
                        已发送，<b>{{seconds}}</b>秒后重新获取
                    </template>
                </button>
            </div>
            <div class="error" v-if="contactPhoneMsg">{{contactPhoneMsg}}</div>
        </div>
        <div class="group"> 
            <div class="item i03" :class="codeMsg?'z-error':''">
                <input 
                	type="text" 
                	placeholder="短信验证码"
                    maxlength="4"
                    v-model='code'
                    v-validate:code="{required:true,len:4}"
                    @touched="blur($validation.code)"
                    @focus='focus($validation.code)'
                >
            </div>
            <div class="error" v-if="codeMsg">{{codeMsg}}</div>
        </div>
        <button class="btn btn_biger btn_primary btn_block" @click='checkBaseInfo'>下一步</button>
    </validator>
</div>
