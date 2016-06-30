/*
 * 加盟
 * @require /libs/vue.js
 * @require /libs/vue-validator.js
 * @require /components/components.js
 * @require /utils/utils.js
 */
(function(window) {
    var Vue = window.Vue;
    var VueValidator = window.VueValidator;
    var UI = window.RUI;
    var utils = window.RUtils;
    var xhr = utils.xhr;
    var validators = utils.validators;

    Vue.component('check-info', {
        template: __inline('tpl/check.tpl'),
        validators: validators, //扩展验证方法
        data: function() {
            return {
                timer__: 0, //定时器，防刷
                sended: 0, //是否已发送短信 0 未发送 1 正在发送 2发送成功
                seconds: 100, //延时
                imgCode: '',
                contactName: '',
                contactPhone: '',
                code: '',
                token: ''
            };
        },
        computed: {
            contactNameMsg: function() {
                var v = this.$validation.contactName;
                if (!v.untouched && v.invalid) {
                    return '请输入联系人或负责人的姓名';
                }
            },
            imgCodeMsg: function() {
                var v = this.$validation.imgCode;
                if (!v.untouched && v.invalid) {
                    return '请输入4位图片验证码';
                }
            },
            contactPhoneMsg: function() {
                var v = this.$validation.contactPhone;
                if (!v.untouched) {
                    if (v.required) {
                        return '请输入负责人的手机号码';
                    } else if (v.mobile) {
                        return '手机号码输入错误';
                    }
                }
            },
            codeMsg: function() {
                var v = this.$validation.code;
                if (!v.untouched) {
                    if (v.required) {
                        return '请输入短信验证码';
                    } else if (v.len) {
                        return '短信验证码输入错误';
                    }
                }
            }
        },
        methods: {
            blur: function(data) {
                data.untouched = false;
            },
            focus: function(data) {
                data.untouched = true;
            },
            //发送短信验证码
            sendCodeSMS: function() {
                var that = this;
                if (this.sended) {
                    return;
                }
                var v = this.$validation;
                if (v.imgCode.invalid) {
                    v.imgCode.untouched = false;
                    return;
                }
                if (v.contactPhone.invalid) {
                    v.contactPhone.untouched = false;
                    return;
                }
                that.sended = 1;
                xhr({
                    url: "{common}/sms/getcode",
                    data: {
                        mobile: this.contactPhone,
                        role: 3,
                        type: 2,
                        codeImg: this.imgCode,
                        token: this.token
                    },
                    success: function() {
                        that.sended = 2;
                        that.seconds = 100;
                        that.countdown__();
                    },
                    error: function(data, msg) {
                        that.sended = 0;
                        alert(msg);
                    }
                });
            },
            //发送短信后倒计时
            countdown__: function() {
                var that = this;
                setTimeout(function() {
                    that.seconds--;
                    if (that.seconds > 0) {
                        that.countdown__();
                    } else {
                        that.sended = 0;
                    }
                }, 1000);
            },
            checkBaseInfo: function() {
                var v = this.$validation;
                if (v.contactName.valid) {
                    v.contactName.untouched = 1;
                } else {
                    v.contactName.untouched = 0;
                    return;
                }

                if (v.contactPhone.valid) {
                    v.contactPhone.untouched = 1;
                } else {
                    v.contactPhone.untouched = 0;
                    return;
                }

                if (v.code.valid) {
                    v.code.untouched = 1;
                } else {
                    v.code.untouched = 0;
                    return;
                }

                this.$parent.code = this.code;
                this.$parent.contactPhone = this.contactPhone;
                this.$parent.contactName = this.contactName;
                this.$parent.next();
            }
        },
        components:{
            'ui-imgcode':UI.imgcode
        }
    });

    Vue.component('base-info', {
        template: __inline('tpl/form.tpl'),
        validators: validators, //扩展验证方法
        ready: function() {
            var that = this;
            //获取地区信息
            xhr({
                url: "{common}/area/all",
                success: function(data) {
                    that.allArea = data;
                }
            });
            //获取科目
            xhr({
                url: "{common}/course/category/list",
                success: function(data) {
                    that.allSubjects = data;
                }
            });
        },
        data: function() {
            return {
                isLoading: false,
                groupName: '',
                brandName: '',
                license: '1',
                chain: '1',
                chainCount: '',
                legalPerson: '',
                legalPhone: '',
                email: '',
                telphone: '',

                //科目数据
                curSubject: '',
                allSubjects: [],
                selectedSubjects: [],
                subjects: '', //已选科目

                //地区数据
                allArea: [], //所有地区
                province: '1', //默认广东省
                city: '100', //深圳市
                area: '',
                region: '',
                address: '',
                grade: 3
            };
        },
        computed: {
            //地区
            citys: function() {
                return this.filterArea(this.allArea, this.province);
            },
            areas: function() {
                return this.filterArea(this.citys, this.city);
            },
            regions: function() {
                return this.filterArea(this.areas, this.area);
            },
            //错误提示
            areaMsg: function() {
                var v1 = this.$validation.city,
                    v2 = this.$validation.area,
                    v3 = this.$validation.region;
                if (!v1.untouched || !v2.untouched || !v3.untouched) {
                    if (v1.invalid) {
                        return '请选择城市';
                    }
                    if (v2.invalid) {
                        return '请选择地区';
                    }
                    if (v3.invalid) {
                        return '请选择商圈';
                    }
                }
            },
            subjectsMsg: function() {
                var v = this.$validation.subjects;
                if (!v.untouched && v.invalid) {
                    return '请选择科目';
                }
            },
            addressMsg: function() {
                var v = this.$validation.address;
                if (!v.untouched && v.invalid) {
                    return '请输入详细地址';
                }
            },
            chainCountMsg: function() {
                var v = this.$validation.chainCount;
                if (this.chain == 1 && !v.untouched && v.invalid) {
                    return '请填写数量';
                }
            },
            groupNameMsg: function() {
                var v = this.$validation.groupName;
                if (!v.untouched && v.invalid) {
                    return '请输入机构名称';
                }
            },
            brandNameMsg: function() {
                var v = this.$validation.brandName;
                if (!v.untouched && v.invalid) {
                    return '请输入品牌名称';
                }
            },
            legalPersonMsg: function() {
                var v = this.$validation.legalPerson;
                if (!v.untouched && v.invalid) {
                    return '请输入法定代表人';
                }
            },
            legalPhoneMsg: function() {
                var v = this.$validation.legalPhone;
                if (!v.untouched && v.invalid) {
                    return '请输入法定代表人电话';
                }
            },
            telphoneMsg: function() {
                var v = this.$validation.telphone;
                if (!v.untouched && v.invalid) {
                    return '请输入座机号';
                }
            },
            emailMsg: function() {
                var v = this.$validation.email;
                if (!v.untouched && v.invalid) {
                    return '请输入email';
                }
            }
        },
        methods: {
            filterArea: function(data, id) {
                if (data && data.length) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        var n = data[i];
                        if (n.id == id) {
                            return n.areas || [];
                        }
                    }
                }
                return [];
            },
            //连锁店
            changeGrade: function(value) {
                this.grade = value;
            },
            //科目操作
            addSubject: function() {
                var i, l, n,
                    id = this.curSubject;
                //当前选项不能为空值
                if (id !== '') {
                    //去重复
                    for (i = 0, l = this.selectedSubjects.length; i < l; i++) {
                        if (this.selectedSubjects[i].id == id) {
                            return;
                        }
                    }

                    //获取名称
                    var name = '';
                    for (i = 0, l = this.allSubjects.length; i < l; i++) {
                        n = this.allSubjects[i];
                        if (n.id == id) {
                            name = n.name;
                        }
                    }

                    this.selectedSubjects.push({
                        id: id,
                        name: name
                    });

                    var list=[];
                    for(i=0,l= this.selectedSubjects.length;i<l;i++){
                        list.push(this.selectedSubjects[i].id);
                    }
                    this.subjects=list.join(",");
                }
            },
            removeSubject: function(index) {
                this.selectedSubjects.splice(index, 1);
            },
            //验证
            blur: function(data) {
                data.untouched = false;
            },
            focus: function(data) {
                data.untouched = true;
            },
            submit: function() {
                var that = this;
                if (this.isLoading) return;
                if (this.$validation.valid) {
                    this.isLoading = true;
                    var data = {
                        noChain: this.noChain,
                        groupName: this.groupName,
                        brandName: this.brandName,
                        license: this.license,
                        chain: this.chain,
                        chainCount: this.chainCount,
                        legalPerson: this.legalPerson,
                        legalPhone: this.legalPhone,
                        contactMail: this.email,
                        telphone: this.telphone,
                        subjects: this.subjects, //已选科目
                        regionId: this.region,
                        address: this.address,
                        grade: this.grade,

                        code : this.$parent.code,
                        contactPhone : this.$parent.contactPhone,
                        contactName : this.$parent.contactName
                    };
                    xhr({
                        url: "{student}/league/add",
                        type: "post",
                        data: data,
                        success: function(data) {
                            that.isLoading = 0;
                            that.$parent.next();
                        },
                        error: function(data, msg) {
                            that.isLoading = 0;
                            alert(msg);
                        }
                    });
                } else {
                    for (var a in this.$validation) {
                        if (this.$validation.hasOwnProperty(a)) {
                            if (this.$validation[a]) {
                                this.$validation[a].untouched = 0;
                            }
                        }
                    }
                }
            }
        }
    });

    new Vue({
        el: '#wrap',
        data: {
            step: 1,
            code: '',
            contactPhone: '',
            contactName: ''
        },
        methods: {
            next: function() {
                if (this.step < 4) {
                    this.step++;
                } else {
                    this.step = 4;
                }
            },
            prev: function() {
                if (this.step > 1) {
                    this.step--;
                } else {
                    this.step = 1;
                }
            },
            getCheckInfo: function() {

            }
        }
    });
}(window));
