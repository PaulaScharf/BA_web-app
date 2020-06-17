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

        config.watch("*", (event) => {
            if (!(event.name === "verticalFov" || event.name === "horizontalFov")) {
                return;
            }
            deferOrCancel(100, () => {
                this.resize();
            })();
        });

        return waitForView;
    }

    resize() {
        let applicationCenterContainer = query(".ct-application-center");
        if (applicationCenterContainer && applicationCenterContainer.length) {
            let container = applicationCenterContainer[0];
            let marginBox = domGeometry.getMarginBox(container);
            let width = marginBox.w, totalHeight = marginBox.h;

            let widget = registry.byNode(container);

            let factor = config.horizontalFov / config.verticalFov;
            let orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
            if(orientation === "landscape-primary" || orientation === "landscape-secondary") {
                fixedWidth = totalHeight * factor;
                fixedHeight = width * (config.verticalFov / config.horizontalFov);

                marginBox.w = fixedWidth;

                if (!this._started) {
                    widget.resize(marginBox);
                } else {
                    widget.domNode.style.height = fixedHeight + "px";
                    widget.getChildren()[0].getChildren()[1].resize(marginBox);
                }

                let camera = this.camera;

                if (!this._started) {
                    aspect.after(camera, "resize", () => {
                        camera.domNode.style.height = fixedHeight + "px";
                    });
                    this._started = true;
                } else {
                    camera.resize();
                }
            } else {
                fixedHeight = width * factor;
                fixedWidth = totalHeight * (config.verticalFov / config.horizontalFov);

                marginBox.h = fixedHeight;

                if (!this._started) {
                    widget.resize(marginBox);
                } else {
                    widget.domNode.style.height = fixedHeight + "px";
                    widget.getChildren()[0].getChildren()[1].resize(marginBox);
                }

                let camera = this.camera;

                if (!this._started) {
                    aspect.after(camera, "resize", () => {
                        camera.domNode.style.height = fixedHeight + "px";
                    });
                    this._started = true;
                } else {
                    camera.resize();
                }
            }


            widget.getParent().resize();
        }
    }

}

export default ViewResizer;