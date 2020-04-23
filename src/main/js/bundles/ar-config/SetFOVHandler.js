import OKCancelDialog from "ct/ui/controls/OKCancelDialog";
import require from "require";

let window = undefined;

class CompassCalibrationHandler {

    deactivate() {
        this.closeWindow();
    }

    closeWindow(tool) {
        if (tool) {
            tool.set("active", false);
            tool = undefined;
        }
        if (window) {
            window.close();
            window = undefined;
        }
    }

    showWindow(event) {
        let tool = (event || {}).tool;
        if (window) {
            return;
        }
        const url = require.toUrl("./images/figure-8.png");
        let config = this.config;
        
        const okCancelDialog = new OKCancelDialog({
            showCancel: false,
            checkValidation: false,
            content: "<label for='vertical'>Vertical FOV:</label>&emsp;<input name='vertical' id='vertical' type='number' value='"+config.verticalFov+"' style='width:50px'><br/><label for='horizontal'>Horizontal FOV:</label>&emsp;<input name='horizontal' id='horizontal' type='number' value='"+config.horizontalFov+"' style='width:50px'>"
        });
        window = this.windowManager.createModalWindow({
            title: tool.title,
            marginBox: {
                w: 320,
                h: 280
            },
            content: okCancelDialog
        });
        const okHandler = okCancelDialog.on("Ok", () => {
            let node = okCancelDialog.domNode;
            let verticalFov = parseFloat(node.querySelector("#vertical").value);
            let horizontalFov = parseFloat(node.querySelector("#horizontal").value);
            config.verticalFov = verticalFov;
            config.horizontalFov = horizontalFov;
            this.closeWindow(tool);
        });
        window.on("Close", () => {
            okHandler.remove();
            this.closeWindow(tool);
        });

        window.show();
    }
}

export default CompassCalibrationHandler;