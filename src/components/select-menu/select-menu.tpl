<div class="m-select-menus">
    <ul class="hd">
        <li 
            v-for='item in items' 
            @click='toggle($index,item)'
            :class='active==item?"z-active":""'
        >
            <span>{{item.name}}</span>
            <i class="icon-arr-down"></i>
        </li>
    </ul>

<!--     <div class="bd" v-if='active>-1'>
        <ui-mult-menus :models='models' @change='onchange'></ui-mult-menus> 
    </div> -->

    <div :class='active==3?"bd_filter":"bd"' v-if='active>-1'>
        <ui-mult-menus :models='models' @change='onchange' v-if='active>-1 && active<=2'></ui-mult-menus> 
        <ui-mult-search :model='models' v-if='active==3' @search="onsearch" ></ui-mult-search>  

    </div>

</div>