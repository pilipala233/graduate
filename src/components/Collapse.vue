<template>
    <div id="collapse">
        <div class="title" v-for="(item, index) in data" :key="index">
            <div
                class="content single-contet"
                v-if="item.children.length==0"
                @click="item.method()"
            >{{item.title}}</div>
            <div
                v-else
                class="content haschildren"
                :class="{roate:item.ishiden}"
                @click.self="item.ishiden=!item.ishiden"
            >
                {{item.title}}
                <collapse :data="item.children" class="cpadding" :class="{hidden:item.ishiden}" />
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "collapse",
    data() {
        return {
        }
    },
    props: ['data',],

}
</script>

<style scoped>
.title {
    border-top: solid;
    border-color: #ccc;
    border-top-width: 1px;
    cursor: default;
}
.content {
    line-height: 40px;
    font-size: 18px;
    cursor: pointer;
}
.single-contet {
    height: 40px;
    padding-left: 20px;
}
.haschildren {
    position: relative;
    padding-left: 20px;
    overflow: hidden;
}
.haschildren::before {
    content: "";
    background-image: url(../imgs/arrow.png);
    background-size: 15px 15px;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 20px;
    height: 40px;
    left: 0px;
}
.roate::before {
    transform: rotate(90deg);
}
.hidden {
    height: 0;
}

.cpadding {
    padding-left: 20px;
}
</style>