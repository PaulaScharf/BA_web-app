import OKCancelDialog from "ct/ui/controls/OKCancelDialog";
import require from "require";

let activeWindow = undefined;

class CompassCalibrationHandler {

    activate() {
        if ("oncompassneedscalibration" in window) {
            window.addEventListener("compassneedscalibration", this.forceCalibration);
        }
        this.deviceData.watch("compassAccuracy", event => {
            let compassAccuracy = event.value;
            if (compassAccuracy >= 15) {
                this.forceCalibration();
            } else {
                if (activeWindow) {
                    activeWindow.close();
                }
            }
        });
    }

    deactivate() {
        if ("oncompassneedscalibration" in window) {
            window.removeEventListener("compassneedscalibration", this.forceCalibration);
        }
        if (activeWindow) {
            activeWindow.close();
        }
    }

    forceCalibration() {
        if (activeWindow) {
            return;
        }
        const url = require.toUrl("./images/figure-8.png");

        const okCancelDialog = new OKCancelDialog({
            showCancel: false,
            checkValidation: false,
            content: "In order to calibrate your device's sensors perform the figure-8 movement.<br><br><div style='text-align:center;'><img width='200px' src='" + url + "'></div>"
        });
        activeWindow = this.windowManager.createModalWindow({
            title: "Compass Calibration required",
            marginBox: {
                w: 320,
                h: 280
            },
            content: okCancelDialog
        });
        const okHandler = okCancelDialog.on("Ok", () => {
            activeWindow.close();
        });
        activeWindow.on("Close", function () {
            okHandler.remove();
            activeWindow = undefined;
        });

        activeWindow.show();
    }
}

export default CompassCalibrationHandler;