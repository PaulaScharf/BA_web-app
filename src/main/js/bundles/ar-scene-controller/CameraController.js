import {deferOrCancel} from "apprt-binding/Transformers";
import {distance as geometryEngineDistance} from "esri/geometry/geometryEngine";
import Point from "esri/geometry/Point";

const compassHeadingCallback = event => {
    let heading = event.value;
    updateCamera(heading, "heading");
};

const tiltCallback = event => {
    let tilt = event.value;
    updateCamera(tilt, "tilt");
};

const positionCallback = event => {
    let value = event.value;
    let position = {
        latitude: value.latitude,
        longitude: value.longitude,
        z: value.altitude
    };
    updateCamera(position, "position");

};

let view = undefined;
let cameraProps = {};

const updateCamera = (value, property) => {
    let oldValue = cameraProps[property];
    if (oldValue instanceof Object || (!oldValue || Math.abs(oldValue - value) >= config.sensorUpdateDegreeThreshold)) {
        cameraProps[property] = value;
        deferOrCancel(config.sensorUpdateTimeThreshold, () => {
            let camera = view.camera;
            if (!camera) {
                return;
            }
            if (cameraProps.fov !== config.horizontalFov) {
                cameraProps.fov = config.horizontalFov;
            }

            view.camera = cameraProps;
        })();
    }
};

class CameraController {

    activate() {
        config = this.config;

        let mapWidgetModel = this.mapWidgetModel;
        const deviceData = this.deviceData;
        let waitForView = new Promise((resolve, reject) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value}) => {
                    resolve(value);
                });
            }
        });
        waitForView.then(value => {
            view = value;
            let camera = view.camera.clone();
            cameraProps.position = camera.position;
            
            camera.fov = config.horizontalFov;
            view.camera = camera;
            this._headingWatchHandle = deviceData.watch("compassHeading", compassHeadingCallback);
            this._tiltWatchHandle = deviceData.watch("tilt", tiltCallback);
            if (!config.ignorePositionUpdate) {
                this._positionWatchHandle = deviceData.watch("position", positionCallback);
                if (deviceData.position) {
                    positionCallback({value: deviceData.position});
                }
            }
        });
        return waitForView;
    }

    deactivate() {
        this._headingWatchHandle.remove();
        this._tiltWatchHandle.remove();
        if (this._positionWatchHandle) {
            this._positionWatchHandle.remove();
        }
        this._headingWatchHandle = this._tiltWatchHandle = this._positionWatchHandle = undefined;
        mapWidgetModel = undefined;
    }

}

export default CameraController;