<template>
    <v-card style="display: inline-block;
        position: relative;
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;">
        <v-img :src="horizonPath" :style="gammaBetaRotation"></v-img>
        <v-img :src="horizonLinePath" :style="gammaRotation"></v-img>

    </v-card>
</template>

<script>
    import require from "require";
    import Bindable from "apprt-vue/mixins/Bindable";
    import calculateNormal from "./Utils";
    export default {
        name: "horizon",
        mixins: [Bindable],
        data () {
            return {
                alpha: 0,
                beta:90,
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
                return "transform: rotate(" + this.roll + "deg); width: 110px; height: 110px; top: -140px; left: -60%;";
            },
            gammaBetaRotation: function() {
                let adjustedTilt = (this.tilt>=0) ? this.tilt : 90 + (90 + this.tilt);
                return "transform: rotate(" + this.roll+ "deg); width: 110px; height: 110px; top: " + (adjustedTilt - 90 - 30) + "px; left: -60%;";
            },
            roll: function() {
                let normal = calculateNormal(this.alpha, this.beta, this.gamma);
                let roll = (Math.floor(mapValue(normal[2], -1, 1, -90, 90)));
                roll = (this.tilt > 0) ? roll : 90 + (90 - roll);
                return roll;
            }
        }
    }
    var mapValue = function(value, minOrig, maxOrig, minResult, maxResult) {
        return (value - minOrig) * (maxResult - minResult) / (maxOrig - minOrig) + minResult;
    }
</script>