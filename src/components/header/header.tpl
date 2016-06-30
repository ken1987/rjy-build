<div class="m-header" :class='exClass' v-if="showhead">
    <div class="m-header__left">
        <slot name="left"></slot>
    </div>
    <div class="m-header__title">{{{title}}}</div>
    <div class="m-header__right">
        <slot name="right"></slot>
    </div>
</div>