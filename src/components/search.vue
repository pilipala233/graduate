<template>
    <div id="search" v-if="IsShow">
        <Input search v-model.trim="text" @on-search="menu()" @on-change="search()" />
        <div class="content" v-if="data.length != 0">
            <p v-for="item in data" class="item" v-text="item.restaurant_name" @click="View(item)"></p>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: "search",
    data() {
        return {
            text: "Enter something...",
            data: []
        };
    },
    props: ["IsShow"],
    methods: {
        search() {
            if (this.text == "") {
                this.data = [];
                return;
            }

            axios
                .post(
                    "http://localhost:8081/search",
                    {
                        text: this.text
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
                .then(response => {
                    this.data = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        View(item) {
            this.text = item.restaurant_name;
            this.data = [];
        },
        menu() {
            if (this.text == "") {
                return;
            }

            axios
                .post(
                    "http://localhost:8081/menu",
                    {
                        name: this.text
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
                .then(response => {
                    if (response.data.length == 0) {
                        this.$Message.info("暂无数据");
                    } else {
                        this.$emit("menudata", response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    watch: {
        IsShow: function () {
            if (!this.IsShow) {
                this.text = "";
                this.data = [];
            }
        }
    }
};
</script>
<style scoped>
#search {
    position: absolute;
    top: 16px;
    left: 80px;
}
.content {
    display: inline-block;
    background-color: #fff;
    width: 100%;
    line-height: 1.5;

    font-size: 14px;
    /* border: 1px solid #dcdee2; */
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    cursor: pointer;
    border-width: 1px 1px 0 1px;
    border-color: #dcdee2;
    border-style: solid;
}
.item {
    padding: 4px 7px;
}
.item:hover {
    background-color: #e1e3e7;
}
</style>
