<template>
    <!--v-avatar-->
    <v-list>
        <v-list-item>alpha:{{this.alpha}}
            beta:{{this.beta}}
            gamma:{{this.gamma}}</v-list-item>
        <v-list-item>
    <v-card style="display: inline-block;
        position: relative;
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;">
        <v-img :src="horizonPath" :style="gammaBetaRotation">

        </v-img>
        <v-img :src="horizonLinePath" :style="gammaRotation"></v-img>
    </v-card>
        </v-list-item>
    </v-list>
    <!--/v-avatar-->
</template>

<script>
    import require from "require";
    import Bindable from "apprt-vue/mixins/Bindable";
    export default {
        name: "horizon",
        mixins: [Bindable],
        data () {
            return {
                alpha: 0,
                beta:0,
                gamma:0,
                tilt: 90
            }
        },
        computed: {
            horizonPath: function() {
                return require.toUrl('./horizon.png');
            },
            horizonLinePath: function() {
                return require.toUrl('./horizonLine.png');
            },
            gammaRotation: function() {
                return "transform: rotate(" + (-this.alpha)+ "deg); width: 110px; height: 110px; top: -140px; left: -60%;";
            },
            gammaBetaRotation: function() {
                return "transform: rotate(" + (-this.alpha)+ "deg); width: 110px; height: 110px; top: " + (this.tilt - 90 - 30) + "px; left: -60%;";
            }
        }
    }
</script>