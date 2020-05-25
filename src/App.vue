<template>
    <div id="app">
        <router-view class="app-container" />
    </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style>
html,
body,
.app-container {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.app-container {
    position: relative;
}
#app {
    display: flex;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
</style>
