import domGeometry from "dojo/dom-geometry";
import query from "dojo/query";
import registry from "dijit/registry";

resizeAppCenter = () => {
    let applicationCenterContainer = query(".ct-application-center");
    if (applicationCenterContainer && applicationCenterContainer.length) {
        let container = applicationCenterContainer[0];
        let marginBox = domGeometry.getMarginBox(container);
        let width = marginBox.w, height = marginBox.h;
        if (width > height) {
            marginBox.w = height;
        } else {
            marginBox.h = width;
        }
        let widget = registry.byNode(container);
        widget.resize(marginBox);
    }
};

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
        waitForView.then(value => {
            let view = value;
            view.camera.fov = config.fov;
            resizeAppCenter();
        });    
        return waitForView;
    }

}

export default ViewResizer;