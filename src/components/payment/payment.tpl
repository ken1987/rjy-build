<div class="m-payment">
    <div class="m-payment__item" v-for='item in types' :class='type == item.type?"z-on":""' @click='change(item.type)'>
        <i :class='"icon-"+item.icon'></i>
        <div class="item name">{{item.name}}支付</div>
        <div class="choice">
            <i class="icon-right"></i>
        </div>
    </div>
</div>