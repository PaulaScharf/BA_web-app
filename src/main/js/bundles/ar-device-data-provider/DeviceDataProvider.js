import {declare} from "apprt-core/Mutable";
import Exception from "apprt-core/Exception";
import Utils from "./Utils";
import has from "dojo/sniff";
import GeolocationAPILocationProvider from "./GeolocationAPILocationProvider";

const deviceData = new declare({
    position: undefined,
    accuracy: undefined,
    gpsHeading: undefined,
    speed: undefined,
    altitudeAccuracy: undefined,
    alpha: undefined,
    beta: undefined,
    gamma: undefined,
    compassHeading: undefined,
    tilt: undefined,
    compassAccuracy: undefined
})();

const onDevideOrientationUpdate = event => {
    const deviceOrientationParameters = Utils.getOrientationParameters(event);
    updateDeviceData(deviceOrientationParameters);
};

const onPositionUpdate = event => {
    const positionParameters = Utils.getPositionParameters(event);
    updateDeviceData(positionParameters);
};

const updateDeviceData = parameters => {
    for (let propertyName in parameters) {
        deviceData.set(propertyName, parameters[propertyName]);
    }
};

let deviceOrientationEventName, locationProviderWatchHandle;

class DeviceDataProvider {

    activate() {
        if (("ondeviceorientationabsolute" in window) && has("mobile")) {
            // mobile Android (on Desktop Chrome the absolute event does not fire)
            deviceOrientationEventName = "deviceorientationabsolute";
        } else {
            throw Exception.notImplemented("Device orientation is not supported on your device!");
        }

        window.addEventListener(deviceOrientationEventName, onDevideOrientationUpdate);
        locationProviderWatchHandle = GeolocationAPILocationProvider.watchPosition(onPositionUpdate, error => {
            console.error(error);
        }, {
            enableHighAccuracy: this.config.enableHighAccuracy
        });
        
        return;
    }

    deactivate() {
        window.removeEventListener(deviceOrientationEventName, onDevideOrientationUpdate);
        locationProviderWatchHandle.remove();
        locationProviderWatchHandle = deviceOrientationEventName = undefined;
    }

    createInstance() {
        return deviceData;
    }

}

export default DeviceDataProvider;