<template>
    <v-avatar>
    <v-img :src="imgPath" :style="gammaRotation"></v-img>
    </v-avatar>
</template>

<script>
    import require from "require";
    import Bindable from "apprt-vue/mixins/Bindable";
    export default {
        name: "horizon",
        mixins: [Bindable],
        data () {
            return {
                gamma: 20
            }
        },
        computed: {
            imgPath: function() {
                return require.toUrl('./horizon.png');
            },
            gammaRotation: function() {
                return "transform: rotate(" + this.gamma+ "deg)";
            }
        }
    }
</script>