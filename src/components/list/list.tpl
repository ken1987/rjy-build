<div class="m-list" :class='isDisable?"m-list_mask":""'>
    <slot></slot>
    <div class="loading" v-if='isLoading'>{{loadingMessage}}</div>
    <template v-else>
	    <div class="empty" v-if='isEmpty'>{{emptyMessage}}</div>
		<button class="m-list__btn" v-if='!isLastPage' @click='loadMore'>{{moreMessage}}</button>
    </template>
</div>