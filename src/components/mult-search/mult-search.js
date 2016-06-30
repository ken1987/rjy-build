/**
 * 多级菜单
 * @require '../_.js'
 * @require "../modal/modal.js"
 */
(function(window) {

    var RUI = window.RUI;
    var UI = window.RUI;
    var modal = UI.modal;

    RUI.multSearch = {
    components:{
        'ui-mult-search': RUI.multSearch,
    },

    template: __inline('mult-search.tpl'),
    props: {

        model:{
            default: function() {
                return {
                    rankId: 4,
                    startPrice: 0,
                    endPrice: 0,
                };
            }
        },

        priceRank:{
            type: Array,
            default: function(){
                return [{id: null, price:"1000以下"},
                        {id: null,price:"1000-2000"},
                        {id: null,price:"2000-3000"}];
            }
        },

        rankId:{
            default:0
        }
    },

    data: function(){
        return {
            startPrice: null,
            endPrice: null,
            // priceRank:[ {id:0,price:"1000以下"},
            //             {id:2, price:"1000-2000"},
            //             {id:3,price:"2000-3000"}]
        };
    },


    methods: {
        selectPrice: function(index,price,priceRank){
            if(price){
                for (var i = 0, l = priceRank.length; i < l; ++i) {
                    priceRank[i].id = null;
                }
                this.model.rankId = index;
            }
            priceRank[index].id = index;
            console.log(this.model);
            this.model.startPrice = null;
            this.model.endPrice = null;
        },

        searchPrice: function(){
            var minPrice,maxPrice;
            var searchObj = {};
            var rankReslut = [];

            for (var i = 0, l = this.priceRank.length; i < l; ++i) {
                if(this.priceRank[i].id !== null){
                    rankReslut.push(this.priceRank[i]);
                }
            }

            console.log(rankReslut);

            this.model.startPrice = parseInt(this.model.startPrice);
            this.model.endPrice = parseInt(this.model.endPrice);

            if(this.model.startPrice && this.model.endPrice){
                if(this.model.startPrice < this.model.endPrice){
                    searchObj.minPrice = this.model.startPrice;
                    searchObj.maxPrice = this.model.endPrice;
                    searchObj.rankId = null;
                }else if(this.model.startPrice > this.model.endPrice){
                    searchObj.minPrice = this.model.endPrice;
                    searchObj.maxPrice = this.model.startPrice;
                    searchObj.rankId = null;
                }else{
                    searchObj.maxPrice = this.model.startPrice;
                    searchObj.rankId = null;
                }
                                
            }else if(this.model.startPrice && !this.model.endPrice){
                modal.alert({
                    title:"请输入完整价格区间"
                });
                return;
            }else if(!this.model.startPrice && this.model.endPrice){
                modal.alert({
                    title:"请输入完整价格区间"
                });
                return;
            }else if(rankReslut.length !== 0){
                if(rankReslut[0].id === 0){
                    searchObj.minPrice = 0;
                    searchObj.maxPrice = 1000;
                    this.priceRank[0].id =0;
                }else if(rankReslut[0].id == 1){
                    searchObj.minPrice = 1000;
                    searchObj.maxPrice = 2000; 
                    this.priceRank[1].id =1;
                }else if(rankReslut[0].id == 2){
                    searchObj.minPrice = 2000;
                    searchObj.maxPrice = 3000; 
                    this.priceRank[2].id =2;
                }else{
                    searchObj.minPrice = 3000;
                }
            }else{
                searchObj.minPrice = null;
                searchObj.maxPrice = null;
            }

            var rankId = null;
            for (var k = 0, j = this.priceRank.length; k < j; ++k) {
                if(this.priceRank[k].id !== null){
                    if(!this.model.startPrice && !this.model.endPrice){
                        rankId = this.priceRank[k].id;
                    }
                    
                }
            }
            //选中的价格区间的id
            searchObj.rankId = rankId;
            this.$dispatch('search', searchObj);
        },

        inputFocus: function(){
            var focusReslut = this.priceRank;
            focusReslut[0].id = null;
            this.model.rankId = null;
        },

        inputBlur: function(){
            if(!(this.model.startPrice && this.model.startPrice)){
                this.priceRank[0].id = 0;
                this.model.rankId = 0;
            }
        }

    }
};

}(this));