<div class='m-dialog' v-if="show">
    <div class="m-dialog__inner">
        <div class="m-dialog__hd">{{show.title}}</div>
        <div class="m-dialog__bd">{{{show.content}}}</div>
        <div class="m-dialog__ft">
            <button class="m-dialog__btn" @click="confirm">{{show.confirmText||'确定'}}</button>
            <button class="m-dialog__btn" @click="cancel" v-if='show.type =="confirm"'>{{show.cancelText||'取消'}}</button>
        </div>
    </div>
</div>