<div class="m-nav">
    <span class="ico-toggle" @click='toggle'></span>
    <div class="list" v-show='isOpen'>
        <a v-for='item in items'
            :href="item.url">
            <i :class="'ico-nav'+item.index"></i>
            {{item.name}}
        </a>
    </div>
</div>