<template>
    <div class="myechaets">
        <Modal v-model="Show" v-bind:title="title" :closable="false" width="820">
            <div id="myChart" style="width:750px;height:300px"></div>
            <div slot="footer">
                <Button type="primary" @click="ok">切换视图</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>

export default {
    name: 'echarts',
    data() {
        return {
            Show: false,
            orgOptions: {},
            myChart: '',
            title: '商家多维雷达图',
            loading: true
        }
    },

    mounted() {
        this.myChart = this.$echarts.init(document.getElementById('myChart'))
    },
    props: ['data'],
    watch: {
        data: function () {
            if (this.data.length != 0) {
                // 绘制图表
                this.myChart.setOption(this.data[0])
                this.Show = true
            } else {
                this.Show = false
            }
        }
    },
    methods: {
        ok() {
            if (this.title == '商家多维雷达图') {
                this.title = '商家条状对比图'
                this.myChart.clear();
                this.myChart.setOption(this.data[1])
            } else {
                this.title = '商家多维雷达图'
                this.myChart.clear();
                this.myChart.setOption(this.data[0])
            }


        },
        cancel() {
            this.myChart.clear();
            this.Show = false
        },

    }
}
</script>
<style  scoped>
#myechaets {
    position: fixed;
    top: 100px;
}
</style>