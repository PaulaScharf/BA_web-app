import domGeometry from "dojo/dom-geometry";
import query from "dojo/query";
import registry from "dijit/registry";
import aspect from "dojo/aspect";

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

            let applicationCenterContainer = query(".ct-application-center");
            if (applicationCenterContainer && applicationCenterContainer.length) {
                let container = applicationCenterContainer[0];
                let marginBox = domGeometry.getMarginBox(container);
                let width = marginBox.w, height = marginBox.h;

                let widget = registry.byNode(container);
                if (width > height) {
                    marginBox.w = height;
                } else {
                    marginBox.h = width;
                }
                widget.resize(marginBox);
                let overviewMap = this.overviewMap;
                aspect.after(overviewMap, "resize", () => {
                    overviewMap.domNode.style.height = height - width + "px";
                });
            }
        });
        return waitForView;
    }

}

export default ViewResizer;