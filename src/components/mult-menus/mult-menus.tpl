<ul v-for='(index, model) in models'>
    <li 
        v-for='item in model.items'
        :class='model.id==item.id?"z-active":""'
        @click='select(item,model,index)'
    >   
        {{item.name}}
    </li>
</ul>
