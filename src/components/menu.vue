<template>
    <Drawer :closable="false" v-model="IsShow" width="320">
        <div class="menu" v-if="data.length!=0">
            <Card style="width:320px" v-for="(item,i) in data" :key="i">
                <div>
                    <div style="position: relative;margin:0 0 -16px 0">
                        <img v-bind:src="item.image_url" alt="图片" style="width:100px;height:100px" />
                        <div
                            style="height:100px;display: inline-block;margin-left: 10px;position: absolute;"
                        >
                            <p>菜名：{{item.food_name}}</p>
                            <p>月销量：{{item.month_sales}}份</p>
                            <p>配送时长：{{item.time_spent}}分钟</p>
                        </div>
                    </div>
                    <Divider orientation="left">评价：</Divider>
                    <Input
                        disabled
                        type="textarea"
                        :autosize="true"
                        v-bind:placeholder="item.comment_text"
                    />
                </div>
            </Card>
            <Affix :offset-bottom="0">
                <Button class="demo-affix" type="primary" style="width:100%">返回</Button>
            </Affix>
        </div>
    </Drawer>
</template>
<script>
export default {
    name: "mymenu",
    data() {
        return {
            IsShow: false
        }
    },
    watch: {
        data: function () {
            if (this.data.length != 0) {
                this.IsShow = true
            } else {
                this.IsShow = false
            }
        }
    },
    props: ['data',],
    methods: {

    }
}
</script>
<style  scoped>
.menu {
    height: 100%;
    width: 320px;
    opacity: 0.9;
    position: fixed;
    top: 0;
    right: 0;
    background-color: rgb(233, 235, 236);
    overflow-y: auto;
    overflow-x: hidden;
}
.menu::-webkit-scrollbar {
    width: 5px;
    background-color: rgb(143, 179, 182);
}
</style>