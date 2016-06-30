<div class="toplines-bd">
    <div class='m-toplines' v-el:head-line>
        <a class='m-toplines-item' v-for="item in items" :href="item.url">
            {{item.title}}
        </a>
    </div>
</div>