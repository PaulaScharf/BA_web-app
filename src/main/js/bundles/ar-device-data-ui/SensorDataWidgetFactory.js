import Binding from "apprt-binding/Binding";
import {debounceOrCancel, ifDefined} from "apprt-binding/Transformers";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import SensorData from "./SensorData.vue";

class SensorDataWidgetFactory {

    createInstance() {
        vm = new Vue(SensorData);
        let widget = VueDijit(vm);
        let sensorDataBinding = Binding.create()
                .syncAllToRight("position", "accuracy", "altitudeAccuracy", "gpsHeading", "alpha", "beta", "gamma", "compassHeading", "tilt", "compassAccuracy", ifDefined())
                .bindTo(this.deviceData, vm)
                .enable().syncToRightNow();
        widget.own({
            remove() {
                unbindConfig();
                sensorDataBinding.unbind();
                sensorDataBinding = undefined;
            }
        });
        return widget;
    }

}

export default SensorDataWidgetFactory;