import {declare} from "apprt-core/Mutable";

class ConfigFactory {

    createInstance() {
        let properties = this._properties;
        const config = new declare({
            ignorePositionUpdate: undefined,
            sensorUpdateTimeThreshold: undefined,
            sensorUpdateDegreeThreshold: undefined,
            locationUpdateDistanceThreshold: undefined,
            enableHighAccuracy: undefined,
            fov: undefined
        })();
        for (let key of Object.keys(properties)) {
            config[key] = properties[key];
        }
        return config;
    }

}

export default ConfigFactory;