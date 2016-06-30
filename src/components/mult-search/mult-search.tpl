<div>
    <span>价格区间</span>
    <div class="price">
        <span v-for="price in priceRank" 
                @click="selectPrice($index,price,priceRank)" 
                :class='model.rankId==$index?"z-active":""'>{{price.price}}</span>      
    </div>

    <div class="f-mt10">
        <span>自定义价格</span>
        <div class="price-input f-ml10">￥
            <input type="tel" v-model="model.startPrice" @focus="inputFocus" @blur="inputBlur" />
        </div>

        <span class="f-c-weak">——</span>

        <div class="price-input">￥
            <input type="tel" v-model="model.endPrice" @focus="inputFocus" @blur="inputBlur" />
        </div>
    </div>
    
    <button class="btn btn_primary btn_block btn_big f-mt10" @click="searchPrice()">确定</button>

</div>