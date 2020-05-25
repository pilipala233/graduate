<template>
    <div id="side">
        <div class="Free"></div>
        <collapse :data="data" class="collapse" />
        <echarts :data="echartsdata" />
    </div>
</template>

<script>
import collapse from './collapse.vue';
import echarts from './echarts.vue';
import global from "../utils/global"

export default {
    data() {
        return {
            data: [
                {
                    title: '🍚 首页',
                    children: [],
                    method: this.home
                },
                {                    title: '🍔 竞业分析',
                    ishiden: false,
                    children: [
                        { title: '商家对比', children: [], method: this.Compared },
                    ]
                },
                {                    title: '🍜 用户市场分析',
                    ishiden: false,
                    children: [
                        { title: '评分渲染', children: [], method: this.sore },
                        { title: '商家分布', children: [], method: this.heatmap },
                        { title: '月销单数', children: [], method: this.Sales },
                        { title: '送餐速度', children: [], method: this.time },
                    ]
                },
                {                    title: '🍟 商家个体分析',
                    ishiden: false,
                    children: [
                        { title: '订单评价', children: [], method: this.showcomment },
                    ]
                },
            ],
            echartsdata: [],
            namearr: [],
            salearr: [],
            scorearr: [],
            timearr: [],
            dfarr: [],
            qsarr: [],
            radardata: [],
            bardata: []
        }
    },
    mounted() {


    },
    components: { collapse, echarts },
    methods: {
        home() {
            this.$store.state.map.basemap = "osm"
            this.$store.state.map.removeAll()
            let trailheadsRenderer = {
                type: "simple",
                symbol: {
                    type: "picture-marker",
                    url: require("../imgs/Position.png"),
                    width: "18px",
                    height: "18px"
                }
            }
            let popupTrailheads = {
                "title": "{restaurant}",
                "content": "<b>商家电话:</b> {restaura_2}<br><b>月销单数:</b> {monthly_sa}<br><b>起送价:</b> {starting_p}<br><b>配送费:</b> {delivery_f}"
            }
            let trailheadsLayer = new global.FeatureLayer({
                url: "http://localhost:6080/arcgis/rest/services/MyMapService/FeatureServer",
                renderer: trailheadsRenderer,
                outFields: ["*"],
                popupTemplate: popupTrailheads,

            });

            this.$store.state.map.add(trailheadsLayer)

        },
        Compared() {
            this.home()
            let view = this.$store.state.view

            let draw = new global.Draw({
                view: view
            });

            let action = draw.create("polygon");
            //鼠标单击
            action.on("vertex-add", (evt) => {
                this.createPolygonGraphic(evt.vertices);

            });

            //鼠标移动
            action.on("cursor-update", (evt) => {
                this.createPolygonGraphic(evt.vertices);

            });
            //鼠标双击
            action.on("draw-complete", (evt) => {
                let polygon = {
                    type: "polygon",
                    rings: evt.vertices,
                    spatialReference: view.spatialReference
                };
                //清除绘制的图形
                view.graphics.removeAll();
                //实例化一个QueryTask对象
                let queryTask = new global.QueryTask({
                    url: "http://localhost:6080/arcgis/rest/services/MyMapService/MapServer/0"
                });
                let query = new global.Query();
                //配置空间查询的参数
                query.outFields = ["*"];
                query.returnGeometry = true;
                query.geometry = polygon;
                query.outSpatialReference = map.spatialReference;
                query.spatialRelationship = global.Query.SPATIAL_REL_INTERSECTS;
                //发起QueryTask查询
                queryTask.execute(query).then((results) => {
                    //查询数据重置
                    this.namearr = []
                    this.salearr = []
                    this.scorearr = []
                    this.timearr = []
                    this.dfarr = []
                    this.qsarr = []
                    this.radardata = []
                    this.bardata = []
                    this.echartsdata = []
                    //查询数据的分类
                    for (let i = 0; i < results.features.length; i++) {
                        this.namearr.push(results.features[i].attributes.restaurant)
                        this.salearr.push(results.features[i].attributes.monthly_sa)
                        this.scorearr.push(results.features[i].attributes.score)
                        this.timearr.push(results.features[i].attributes.time_spent)
                        this.dfarr.push(results.features[i].attributes.delivery_f)
                        this.qsarr.push(results.features[i].attributes.starting_p)

                    }
                    //雷达图数据的处理
                    for (let i = 0; i < this.namearr.length; i++) {
                        this.radardata.push({
                            value: [this.timearr[i], this.scorearr[i], this.qsarr[i], this.salearr[i], this.dfarr[i]],
                            name: this.namearr[i]
                        })
                    }
                    //条形图数据的处理
                    for (let i = 0; i < this.namearr.length; i++) {
                        this.bardata.push({
                            data: [this.timearr[i], this.scorearr[i], this.qsarr[i], this.salearr[i], this.dfarr[i]],
                            name: this.namearr[i],
                            type: 'bar'
                        })
                    }

                     //雷达图对象的配置
                    let obj1 = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'vertical',              
                            x: 'right',
                            y: 'bottom',
                            data: this.namearr
                        },
                        polar: [
                            {
                                indicator: [
                                    { text: '送达时间', max: 150 },    
                                    { text: '评分 ', max: 5.0 },
                                    { text: '起送价 ', max: 50 },
                                    { text: '月销单数', max: 3000 },
                                    { text: '配送费', max: 20 },
                                ]

                            }

                        ],
                        calculable: true,
                        series: [
                            {
                                name: '',
                                type: 'radar',
                                data: this.radardata

                            }

                        ]
                    }
                    //条形图对象的配置
                    let obj2 = {
                        legend: {
                            data: this.namearr
                        },
                        xAxis: {
                            data: ['送达时间', '评分', '起送价', '月销单数', '配送费']
                        },
                        yAxis: {},
                        series: this.bardata
                    }

                    //更新数据，触发echart组件的watch
                    this.echartsdata.push(obj1)
                    this.echartsdata.push(obj2)

                });
            });




        },
        sore() {
            this.$store.state.map.basemap = "dark-gray"//更改底图
            this.$store.state.map.removeAll()//移除所有图层
            //配置渲染对象
            let renderer = {
                type: "class-breaks",//渲染器种类
                field: "score",//根据的字段
                classBreakInfos: [
                    {
                        minValue: 3.5,//最小值
                        maxValue: 4.0,//最大值
                        symbol: {
                            type: "simple-marker",//symbol种类
                            style: "circle",//样式
                            color: "blue",//颜色
                            size: "5px",//像素大小

                        }
                    },
                    {
                        minValue: 4.1,
                        maxValue: 4.3,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "red",
                            size: "10px",

                        }
                    },
                    {
                        minValue: 4.4,
                        maxValue: 4.6,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "green",
                            size: "15px",

                        }
                    },
                    {
                        minValue: 4.7,
                        maxValue: 5.0,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "purple",
                            size: "18px",

                        }
                    }]

            };
            let popupTrailheads = {
                "title": "{restaurant}",
                "content": "<b>商家电话:</b> {restaura_2}<br><b>月销单数:</b> {monthly_sa}<br><b>起送价:</b> {starting_p}<br><b>配送费:</b> {delivery_f}<br><b>综合评分：</b>{score}"
            }
            let trailheadsLayer = new global.FeatureLayer({
                url: "http://localhost:6080/arcgis/rest/services/MyMapService/FeatureServer",
                outFields: ["*"],
                renderer: renderer,
                popupTemplate: popupTrailheads,


            });
            this.$store.state.map.add(trailheadsLayer)
        },
        heatmap() {

            this.$store.state.map.basemap = "osm"
            this.$store.state.map.removeAll()

            let heatmapRenderer = new global.HeatmapRenderer({
                colors: ["rgba(0, 0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 255)", "rgb(139, 255, 0)", "rgb(255, 0, 0)"],
                blurRadius: 12,//设置每个点的影响区域像素
                maxPixelIntensity: 20,//设置最大像素强度值
                minPixelIntensity: 2,//设置最小像素强度值
            });
            let trailheadsLayer = new global.FeatureLayer({
                url: "http://localhost:6080/arcgis/rest/services/MyMapService/FeatureServer",
                outFields: ["*"],
                renderer: heatmapRenderer

            });
            this.$store.state.map.add(trailheadsLayer)


        },
        Sales() {
            this.$store.state.map.basemap = "dark-gray"
            this.$store.state.map.removeAll()

            let renderer = {
                type: "class-breaks",
                field: "monthly_sa",
                classBreakInfos: [
                    {
                        minValue: 0,
                        maxValue: 100,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "blue",
                            size: "8px",

                        }
                    },
                    {
                        minValue: 101,
                        maxValue: 400,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "red",
                            size: "10px",

                        }
                    },
                    {
                        minValue: 401,
                        maxValue: 1000,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "green",
                            size: "15px",

                        }
                    },
                    {
                        minValue: 1001,
                        maxValue: 5000,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: 'purple',
                            size: "20px",

                        }
                    }]

            };
            let popupTrailheads = {
                "title": "{restaurant}",
                "content": "<b>商家电话:</b> {restaura_2}<br><b>月销单数:</b> {monthly_sa}<br><b>起送价:</b> {starting_p}<br><b>配送费:</b> {delivery_f}"
            }
            let trailheadsLayer = new global.FeatureLayer({
                url: "http://localhost:6080/arcgis/rest/services/MyMapService/FeatureServer",
                outFields: ["*"],
                renderer: renderer,
                popupTemplate: popupTrailheads,


            });
            this.$store.state.map.add(trailheadsLayer)


        },

        time() {
            this.$store.state.map.basemap = "dark-gray"
            this.$store.state.map.removeAll()

            let renderer = {
                type: "class-breaks",
                field: "time_spent",
                classBreakInfos: [
                    {
                        minValue: 1,
                        maxValue: 30,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "purple",
                            size: "18px",

                        }
                    },
                    {
                        minValue: 31,
                        maxValue: 40,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "green",
                            size: "15px",

                        }
                    },
                    {
                        minValue: 41,
                        maxValue: 55,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "red",
                            size: "10px",

                        }
                    },
                    {
                        minValue: 56,
                        maxValue: 100,
                        symbol: {
                            type: "simple-marker",
                            style: "circle",
                            color: "blue",
                            size: "5px",

                        }
                    }]

            };
            let popupTrailheads = {
                "title": "{restaurant}",
                "content": "<b>商家电话:</b> {restaura_2}<br><b>月销单数:</b> {monthly_sa}<br><b>起送价:</b> {starting_p}<br><b>配送费:</b> {delivery_f}<br><b>综合评分：</b>{score}"
            }
            let trailheadsLayer = new global.FeatureLayer({
                url: "http://localhost:6080/arcgis/rest/services/MyMapService/FeatureServer",
                outFields: ["*"],
                renderer: renderer,
                popupTemplate: popupTrailheads,


            });
            this.$store.state.map.add(trailheadsLayer)
        },
        showcomment() {
            //执行变化
            this.$store.dispatch('ChangeShow')
        },
        createPolygonGraphic(vertices) {
            let view = this.$store.state.view
            view.graphics.removeAll();
            let polygon = {
                type: "polygon",
                rings: vertices,
                spatialReference: view.spatialReference
            };

            let graphic = new global.Graphic({
                geometry: polygon,
                symbol: {
                    type: "simple-fill",
                    style: "solid",
                }
            });
            view.graphics.add(graphic);
        },

    }
}
</script>

<style scoped>
.collapse {
    overflow-y: auto;
    height: calc(100% - 200px);
}
.collapse::-webkit-scrollbar {
    width: 5px;
    background-color: rgb(143, 179, 182);
}
.Free {
    width: 100%;
    height: 200px;
}
</style>