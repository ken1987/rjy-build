<div class="activity-filter-nav">
    <ul :style='style' v-el:content>
        <li :class="{'z-active':cur==$index}" v-for='cate in category' @click="change($index)">
            {{cate.name}}
        </li>
    </ul>
</div>

