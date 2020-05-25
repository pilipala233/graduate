import Vue from "vue";
import App from "./App";
import router from "./router";
import ViewUI from "view-design";
import store from "./store";
import echarts from "echarts";

Vue.prototype.$echarts = echarts;

import "view-design/dist/styles/iview.css";

Vue.config.productionTip = false;

Vue.use(ViewUI);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App),
  store
});
