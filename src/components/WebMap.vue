<template>
    <div id="map">
        <div id="test"></div>
        <div id="extentDiv"></div>
        <Search :IsShow="IsShow" v-on:menudata="sendmenu" />
        <MYMenu :data="menudata" />
    </div>
</template>

<script>
import esriLoader from "esri-loader";
import global from "../utils/global";
import Search from "./search";
import MYMenu from "./menu";

export default {
    name: "web-map",
    mounted() {
        // 加载css
        esriLoader.loadCss("http://localhost:80/4.14/esri/css/main.css");
        //基本配置
        const options = {
            url: "http://localhost:80/4.14/init.js",
            css: true
        };
        esriLoader
            .loadModules(
                [
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/layers/FeatureLayer",
                    "esri/renderers/HeatmapRenderer",
                    "esri/core/watchUtils",
                    "esri/views/SceneView",
                    "esri/Graphic",
                    "esri/views/draw/Draw",
                    "esri/tasks/QueryTask",
                    "esri/tasks/support/Query"
                ],
                options
            )
            .then(this.init);
    },
    beforeDestroy() {
        if (this.view) {
            // destroy the map view
            this.view.container = null;
        }
    },
    components: { Search, MYMenu },
    methods: {
        init([
            ArcGISMap,
            MapView,
            FeatureLayer,
            HeatmapRenderer,
            watchUtils,
            SceneView,
            Graphic,
            Draw,
            QueryTask,
            Query
        ]) {
            //定义map对象
            const map = new ArcGISMap({
                basemap: "osm"
            });
            //定义视图对象
            this.view = new MapView({
                container: this.$el,
                map: map,
                center: [116.12, 24.32],
                zoom: 15
            });
            //定义渲染对象的样式
            var trailheadsRenderer = {
                type: "simple",
                symbol: {
                    type: "picture-marker",
                    url: require("../imgs/Position.png"),
                    width: "18px",
                    height: "18px"
                }
            };
            //定义弹窗的字符结构
            var popupTrailheads = {
                title: "{restaurant}",
                content:
                    "<b>商家电话:</b> {restaura_2}<br><b>月销单数:</b> {monthly_sa}<br><b>起送价:</b> {starting_p}<br><b>配送费:</b> {delivery_f}"
            };
            //定义一个要素服务并对其进行配置
            var trailheadsLayer = new FeatureLayer({
                url:
                    "http://localhost:6080/arcgis/rest/services/MyMapService/FeatureServer",
                renderer: trailheadsRenderer,
                outFields: ["*"],
                popupTemplate: popupTrailheads
            });
            //将要素图层添加到map对象上
            map.add(trailheadsLayer);

            var overviewMap = new ArcGISMap({
                basemap: "satellite"
            });
            var smapView = new MapView({
                container: "test",
                map: overviewMap,
                constraints: {
                    rotationEnabled: false
                }
            });
            smapView.ui.components = [];
            smapView.when(() => {
                this.view.when(() => {
                    const extent3Dgraphic = new Graphic({
                        geometry: null,
                        symbol: {
                            type: "simple-fill",
                            color: [0, 0, 0, 0.5],
                            outline: null
                        }
                    });
                    smapView.graphics.add(extent3Dgraphic);
                    watchUtils.init(this.view, "extent", extent => {
                        smapView.goTo({
                            center: this.view.center,
                            scale:
                                this.view.scale *
                                Math.max(
                                    this.view.width / smapView.width,
                                    this.view.height / smapView.height
                                )
                        });
                        extent3Dgraphic.geometry = extent;
                    });
                });
            });

            //使用vuex将其注册成全局方法
            this.register(
                ArcGISMap,
                MapView,
                FeatureLayer,
                HeatmapRenderer,
                watchUtils,
                SceneView,
                Graphic,
                Draw,
                QueryTask,
                Query
            );
            //使用vuex将其注册成全局变量
            this.$store.state.map = map;
            this.$store.state.view = this.view;
        },
        register() {
            global.ArcGISMap = arguments[0];
            global.MapView = arguments[1];
            global.FeatureLayer = arguments[2];
            global.HeatmapRenderer = arguments[3];
            global.watchUtils = arguments[4];
            global.SceneView = arguments[5];
            global.Graphic = arguments[6];
            global.Draw = arguments[7];
            global.QueryTask = arguments[8];
            global.Query = arguments[9];
        },
        sendmenu(data) {
            this.menudata = data;
        }
    },
    data() {
        return {
            map: "",
            menudata: ""
        };
    },
    computed: {
        IsShow: function () {
            return this.$store.state.IsShow;
        }
    }
};
</script>

<style scoped>
#map {
    /* position: relative; */
    position: absolute;
    top: 0;
    right: 0;
}
#test {
    /* position: absolute; */
    position: fixed;
    top: 0px;
    left: 0;
    /* right: 1237px; */
    width: 300px;
    height: 200px;
    z-index: 1;
    overflow: hidden;
}
#extentDiv {
    position: absolute;
    z-index: 2;
}
</style>
