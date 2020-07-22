import domGeometry from "dojo/dom-geometry";
import query from "dojo/query";
import registry from "dijit/registry";
import aspect from "dojo/aspect";
import {deferOrCancel} from "apprt-binding/Transformers";

let fixedHeight = 0;
let fixedWidth = 0;

class ViewResizer {

    activate() {
        let config = this.config;
        let mapWidgetModel = this.mapWidgetModel;

        let waitForView = new Promise((resolve, reject) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({value}) => {
                    resolve(value);
                });
            }
        });
        waitForView.then(() => {
            this.resize();
        });

        return waitForView;
    }

    resize() {
        let camera = this.camera;
        navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}})
            .then(function (stream) {
                let trackSettings = stream.getTracks()[0].getSettings();
                this.config
                let applicationCenterContainer = query(".ct-application-center");
                if (applicationCenterContainer && applicationCenterContainer.length) {
                    let container = applicationCenterContainer[0];
                    let marginBox = domGeometry.getMarginBox(container);
                    let width = marginBox.w, totalHeight = marginBox.h;

                    let widget = registry.byNode(container);

                    let factor = 1/trackSettings.aspectRatio;
                    let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
                    if(orientation === "landscape-primary" || orientation === "landscape-secondary") {
                        fixedWidth = 722;
                        fixedHeight = fixedWidth * factor;

                        marginBox.w = fixedWidth;

                        if (!this._started) {
                            widget.resize(marginBox);
                        } else {
                            widget.domNode.style.height = fixedHeight + "px";
                            widget.getChildren()[0].getChildren()[1].resize(marginBox);
                        }



                        if (!this._started) {
                            aspect.after(camera, "resize", () => {
                                camera.domNode.style.height = fixedHeight + "px";
                            });
                            this._started = true;
                        } else {
                            camera.resize();
                        }
                    } else {
                        fixedHeight = 722;
                        fixedWidth = fixedHeight * factor;

                        marginBox.h = fixedHeight;
                        marginBox.w = fixedWidth;

                        if (!this._started) {
                            widget.resize(marginBox);
                        } else {
                            widget.domNode.style.height = fixedHeight + "px";
                            widget.domNode.style.width = fixedWidth + "px";
                            widget.getChildren()[0].getChildren()[1].resize(marginBox);
                        }

                        if (!this._started) {
                            aspect.after(camera, "resize", () => {
                                camera.domNode.style.height = fixedHeight + "px";
                                camera.domNode.style.width = fixedWidth + "px";
                            });
                            this._started = true;
                        } else {
                            camera.resize();
                        }
                    }


                    widget.getParent().resize();
                }
            })
            .catch(function (error) {
                console.error("Error accessing the camera.", error);
            });
    }
}

export default ViewResizer;