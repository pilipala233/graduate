<template>
    <div>
        <Side class="SIDE" />
        <web-map class="MAP" />
    </div>
</template>

<script>
import WebMap from '../../components/WebMap.vue';
import Side from '../../components/Side.vue';
export default {
    name: 'home',
    components: { Side, WebMap }
}
</script>

<style>
.SIDE {
    width: 300px;
    height: 100%;
}
.MAP {
    width: calc(100% - 300px);
    height: 100%;
}
</style>
