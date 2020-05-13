import Binding from "apprt-binding/Binding";
import {ifDefined} from "apprt-binding/Transformers";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import horizon from "./Horizon.vue";

class horizonFactory {

    createInstance() {
        let vm = new Vue(horizon);
        let widget = VueDijit(vm);
        let sensorDataBinding = Binding.create()
            .syncAllToRight("alpha", "beta", "gamma", "tilt", ifDefined())
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

export default horizonFactory;