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
            view.camera = cameraProps;
        })();
    }
};

class CameraController {

    activate() {
        config = this.config;
        let simulatedPosition = config.simulatedPosition;

      //  let fov = config.fov;
      //  cameraProps.fov = fov;

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
            this._headingWatchHandle = deviceData.watch("compassHeading", compassHeadingCallback);
            this._tiltWatchHandle = deviceData.watch("tilt", tiltCallback);
            if (simulatedPosition && simulatedPosition.latitude && simulatedPosition.longitude) {
                cameraProps.position = simulatedPosition;
            } else {
                if (!config.ignorePositionUpdate) {
                    this._positionWatchHandle = deviceData.watch("position", positionCallback);
                    if (deviceData.position) {
                        positionCallback({value: deviceData.position});
                    }
                    this._positionWatchHandle = deviceData.watch("position", positionCallback);
                    if (deviceData.position) {
                        positionCallback({value: deviceData.position});
                    }
                }
            }
        });
        return waitForView;
    }

    deactivate() {
        this._headingWatchHandle.remove();
        this._tiltWatchHandle.remove();
        this._positionWatchHandle.remove();
        this._headingWatchHandle = this._tiltWatchHandle = this._positionWatchHandle = undefined;
        mapWidgetModel = undefined;
    }

}

export default CameraController;
/*
 var position = this._lastPosition;
 if (position) {
 this._lastPosition = null;
 this._setValue("position", null, position);
 }
 },
 activate: function () {
 this._deviceOrientation.watch("heading", d_lang.hitch(this, this._setValue));
 this._deviceOrientation.watch("tilt", d_lang.hitch(this, this._setValue));
 
 var self = this;
 this.locationProvider.watchPosition(function (position) {
 if (!self._camera) {
 self._lastPosition = {
 x: position.coords.longitude,
 y: position.coords.latitude,
 z: 7,
 spatialReference: 4326
 };
 } else {
 self._setValue("position", null, {
 x: position.coords.longitude,
 y: position.coords.latitude,
 z: 7,
 spatialReference: 4326
 });
 }
 }, function (error) {
 alert(error);
 }, {
 enableHighAccuracy: true
 });
 }
 * 
 */