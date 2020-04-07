<template>
    <div>
        <v-container>
            <v-layout row wrap>
                <v-flex xs6>
                    <v-card>
                        <v-card-title><h4>GPS</h4></v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>Latitude:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(position.latitude, 5) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Longitude:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(position.longitude, 5) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Position Accuracy:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(accuracy, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Altitude:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(position.altitude, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Altitude Accuracy:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(altitudeAccuracy, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Heading:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(gpsHeading, 0) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Speed:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(speed, 0) }}</v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <v-card>
                        <v-card-title><h4>Sensors</h4></v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>Heading:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(compassHeading, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Compass Accuracy:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(compassAccuracy, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Tilt:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(tilt, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Alpha:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(alpha, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Beta:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(beta, 1) }}</v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Gamma:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ formatNumber(gamma, 1) }}</v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Bindable from "apprt-vue/mixins/Bindable";
    export default  {
        mixins: [Bindable],
        data: () => {
            return {
                position: {},
                accuracy: undefined,
                altitudeAccuracy: undefined,
                speed: undefined,
                compassAccuracy: undefined,
                gpsHeading: undefined,
                compassHeading: undefined,
                tilt: undefined,
                alpha: undefined,
                beta: undefined,
                gamma: undefined
            };
        },
        methods: {
            formatNumber(number, places) {
                if (!number) {
                    return "-";
                }
                if (!places) {
                    places = 0;
                }
                return number.toFixed(places);
            }
        }
    };
</script>