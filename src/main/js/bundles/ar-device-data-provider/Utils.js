import ExtPromise from "apprt-core/Promise";
import domGeometry from "dojo/dom-geometry";
import domConstruct from "dojo/dom-construct";

class Utils {

    static requestDeviceOrientationPermission(domNode) {
        return new ExtPromise((resolve, reject) => {
            // see: https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2
            if (typeof DeviceOrientationEvent.requestPermission === "function") {
                //check if permision has been granted before
                DeviceOrientationEvent.requestPermission().then(permissionState => {
                    resolve(true);
                }).catch(error => {
                    // ask for permission
                    let marginBox = domGeometry.getMarginBox(domNode);
                    let div = domConstruct.create("div", {
                        innerHTML: "Tap here to start...",
                        "class": "ct-permission-request",
                        style: {
                            //TODO: set to marginBox.h?
                            "line-height": 0 + "px"
                        }
                    });
                    div.onclick = () => {
                        domNode.removeChild(div);
                        DeviceOrientationEvent.requestPermission().then(permissionState => {
                            if (permissionState === "granted") {
                                resolve(true);
                            }
                        }).catch((error) => {
                            console.error(error);
                            reject(error);
                        });
                    };
                    domGeometry.setMarginBox(div, marginBox);
                    domNode.appendChild(div);
                });
            } else {
                resolve(true);
            }
        });
    }

    static getOrientationParameters(event) {
        const alpha = event.alpha, beta = event.beta, gamma = event.gamma;
        let parameters = {
            alpha: alpha,
            beta: beta,
            gamma: gamma
        };

        let betaRad = beta * (Math.PI / 180);
        let gammaRad = gamma * (Math.PI / 180);
        let cB = Math.cos(betaRad);
        let cG = Math.cos(gammaRad);
        let rC = -cB * cG;

        // see https://math.stackexchange.com/questions/2563622/vertical-inclination-from-pitch-and-roll
        let tilt = Math.atan(Math.sqrt(Math.pow(Math.tan(betaRad), 2) + Math.pow(Math.tan(gammaRad), 2)));
        if (rC > 0) {
            tilt = Math.PI - tilt;
        }
        tilt *= 180 / Math.PI;
        if (event.beta < 0) {
            tilt *= -1;
        }
        parameters.tilt = tilt;

        // for iOS compass heading and accuracy is available directly
        if (event.webkitCompassHeading) {
            parameters.compassHeading = event.webkitCompassHeading;
            parameters.compassAccuracy = event.webkitCompassAccuracy;
        } else {
            //@see: https://stackoverflow.com/questions/18112729/calculate-compass-heading-from-deviceorientation-event-api
            // Convert degrees to radians
            let alphaRad = alpha * (Math.PI / 180);
            // Calculate equation components
            let cA = Math.cos(alphaRad);
            let sA = Math.sin(alphaRad);
            let sB = Math.sin(betaRad);
            let sG = Math.sin(gammaRad);
            // Calculate A, B, C rotation components
            let rA = -cA * sG - sA * sB * cG;
            let rB = -sA * sG + cA * sB * cG;
            // Calculate compass heading
            let compassHeading = Math.atan(rA / rB);
            // Convert from half unit circle to whole unit circle
            if (rB < 0) {
                compassHeading += Math.PI;
            } else if (rA < 0) {
                compassHeading += 2 * Math.PI;
            }
            // Convert radians to degrees
            compassHeading *= 180 / Math.PI;
            parameters.compassHeading = compassHeading;
        }
        return parameters;
    }

    static getPositionParameters(event) {
        const coords = event.coords;
        return {
            position: {
                latitude: coords.latitude,
                longitude: coords.longitude,
                altitude: coords.altitude
            },
            accuracy: coords.accuracy,
            gpsHeading: coords.heading,
            altitudeAccuracy: coords.altitudeAccuracy,
            speed: coords.speed
        };
    }

}

export default Utils;
