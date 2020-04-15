import Promise from "apprt-core/Promise";
import domConstruct from "dojo/dom-construct";
import aspect from "dojo/aspect";
import FeatureLayer from "esri/layers/FeatureLayer";
import domGeometry from "dojo/dom-geometry";

let overviewMapView = undefined;

const updateOverviewMap = (position, heading) => {
    if (!overviewMapView) {
        return;
    }
    overviewMapView.center = [position.longitude, position.latitude];
    overviewMapView.rotation = 360 - heading;
};

class OverviewMapWidgetFactory {

    activate() {
        const mapWidgetModel = this.mapWidgetModel;
        return new Promise((resolve) => {
            if (mapWidgetModel.ready) {
                resolve();
                return;
            }
            const handler = mapWidgetModel.watch("ready", ({ value }) => {
                if (value) {
                    handler.remove();
                    resolve();
            }
            });
        });
    }

    createInstance() {
        const mapWidgetModel = this.mapWidgetModel;
        const mapWidgetFactory = this.mapWidgetFactory;
        const view = mapWidgetModel.view;
        view.watch("camera", camera => {
            let position = camera.position;
            let heading = camera.heading;
            updateOverviewMap(position, heading);
        });
        let model = {
            basemap: "topo-vector"
        };
        let layers = [];
        let map = mapWidgetFactory.createMap(model);
        mapWidgetModel.map.layers.forEach(layer => {
            if (layer.type === "feature") {
                map.layers.add(new FeatureLayer({
                    url: layer.parsedUrl.path
                }));
            }
        });
        this.layerConfigParser.parse(layers).then(map.layers.addMany);

        const widgetModel = mapWidgetFactory.createWidgetModel({
            map: map,
            zoom: 14
        });
        let widget = undefined;
        widgetModel.watch("view", event => {
            overviewMapView = event.value;
            overviewMapView.ui.remove("attribution");

        });
        widget = mapWidgetFactory.createWidget({
            model: widgetModel
        });

        // TODO: unschoener hack
        let handle = widgetModel.watch("ready", () => {
            let domNode = widget.domNode;
            let marginBox = domGeometry.getMarginBox(domNode);
            // apply only once
            handle.remove();

            let width = marginBox.w, height = marginBox.h;
            overviewMapView.padding.top = height;

            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("viewBox", "0 0 " + width + " " + height);
            svg.setAttribute("preserveAspectRatio", "none");
            svg.setAttribute("style", "position:absolute;z-index:1;");

            let fov = this.config.fov;
            let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            let b = height * Math.tan(fov / 2 * Math.PI / 180);
            let x1 = width / 2 - b;
            let x2 = width / 2 + b;
            polygon.setAttribute("points", width / 2 + "," + height + " " + x1 + ",0 0,0 0," + height + " " + width + "," + height + ", " + width + ",0 " + x2 + ",0");
            polygon.setAttribute("fill", "rgba(0,0,0,0.2)");

            svg.appendChild(polygon);
            domNode.insertBefore(svg, domNode.firstChild);
        });

        return widget;
    }

}

export default OverviewMapWidgetFactory;