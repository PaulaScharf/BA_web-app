import CameraWidget from "./CameraWidget";
import async from "apprt-core/async";

const restartVideoStream = () => {
    widget.stopStream();
    //the delay prevents freezing of video at least on iPhone
    async(widget.startStream, 250);
};

let widget = undefined;

class CameraWidgetFactory {

    createInstance() {
        widget = new CameraWidget();
        window.addEventListener("orientationchange", restartVideoStream);
        return widget;
    }

    destroyInstance(widget) {
        window.removeEventListener("orientationchange", restartVideoStream);
        widget.destroy();
        widget = undefined;
    }

}

export default CameraWidgetFactory;