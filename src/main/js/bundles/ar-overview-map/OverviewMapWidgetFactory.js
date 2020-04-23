import Promise from "apprt-core/Promise";
import FeatureLayer from "esri/layers/FeatureLayer";
import domGeometry from "dojo/dom-geometry";
import async from "apprt-core/async";

let overviewMapView = undefined;

const createViewShedSVG = (availableWidth, availableHeight, config) => {
    let width = availableWidth, height = availableHeight;
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("style", "position:absolute;z-index:1;");
    let fov = config.verticalFov;
    let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    let b = height * Math.tan(fov / 2 * Math.PI / 180);
    let x1 = width / 2 - b;
    let x2 = width / 2 + b;
    polygon.setAttribute("points", width / 2 + "," + height + " " + x1 + ",0 0,0 0," + height + " " + width + "," + height + ", " + width + ",0 " + x2 + ",0");
    polygon.setAttribute("fill", "rgba(0,0,0,0.2)");
    svg.appendChild(polygon);
    return svg;
};

let lastPosition, lastHeading = undefined;

const updateOverviewMapView = (overviewMapView, position, heading, zoom) => {
    overviewMapView.center = [position.longitude, position.latitude];
    overviewMapView.rotation = 360 - heading;
    overviewMapView.zoom = zoom || 14;
};

class OverviewMapWidgetFactory {

    activate(componentContext) {
        let bundleContext = componentContext.getBundleContext();
        const mapWidgetModel = this.mapWidgetModel;
        new Promise((resolve) => {
            if (mapWidgetModel.ready) {
                resolve();
                return;
            }
            const handler = mapWidgetModel.watch("ready", ({ value }) => {
                const view = mapWidgetModel.view;
                handler.remove();
                let context = this.createAndRegisterOverviewMap(bundleContext, view);

                this.config.watch("*", (event) => {
                    if (!(event.name === "verticalFov" || event.name === "horizontalFov")) {
                        return;
                    }
                    // This is reguired since changing the map's padding value does not work during runtime
                    this.unregisterOverviewMap(context);
                    context = this.createAndRegisterOverviewMap(bundleContext, view);
                });
            });
        });
    }

    createAndRegisterOverviewMap(bundleContext, view) {
        let context = {};
        const widget = context.widget = this.createOverviewMapWidget();

        const handler = context.handler = view.watch("camera", camera => {
            lastPosition = camera.position;
            lastHeading = camera.heading;

            widget.updateView(lastPosition, lastHeading);
        });

        const serviceProperties = {
            widgetRole: "overviewMapAR"
        };
        const interfaces = ["dijit.Widget"];

        const serviceRegistration = context.serviceRegistration = bundleContext.registerService(interfaces, widget, serviceProperties);
        return context;
    }

    unregisterOverviewMap(context) {
        context.handler.remove();
        context.serviceRegistration.unregister();
        context.widget.destroy();
    }

    createOverviewMapWidget() {
        const mapWidgetModel = this.mapWidgetModel;
        const mapWidgetFactory = this.mapWidgetFactory;
        const view = mapWidgetModel.view;

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
        let widget, width, height = undefined;

        widget = mapWidgetFactory.createWidget({
            model: widgetModel
        });

        widget.updateView = (position, heading) => {
            const overviewMapView = widgetModel.view;
            if (!overviewMapView) {
                return;
            }
            if (overviewMapView.ready) {
                updateOverviewMapView(overviewMapView, position, heading, 14);
            } else {
                let handle = overviewMapView.watch("ready", () => {
                    handle.remove();
                    async(() => {
                        updateOverviewMapView(overviewMapView, position, heading, 14);
                    });
                });
            }
        };


        widgetModel.watch("view", event => {

            overviewMapView = event.value;

            overviewMapView.ui.remove("attribution");
            if (height) {
                overviewMapView.padding.top = height;
            }

            if (lastPosition) {
                // restore last view after update
                widget.updateView(lastPosition, lastHeading || 0);
            }

        });

        widget.resize = (dims) => {
            const config = this.config;
            let domNode = widget.domNode;
            let marginBox = domGeometry.getMarginBox(domNode);
            let marginBoxParent = domGeometry.getMarginBox(domNode.parentNode);
            height = marginBoxParent.h - marginBox.t;
            width = marginBoxParent.w;
            domGeometry.setMarginBox(domNode, {w: width, h: height, b: 0});
            if (widgetModel.ready) {
                let config = this.config;
                let svg = createViewShedSVG(width, height, config);
                domNode.insertBefore(svg, domNode.firstChild);
                if (overviewMapView && overviewMapView.padding.top !== height) {
                    overviewMapView.padding.top = height;
                }

            } else {
                let handle = widgetModel.watch("ready", () => {
                    // apply only once
                    handle.remove();
                    let svg = createViewShedSVG(width, height, config);
                    domNode.insertBefore(svg, domNode.firstChild);
                    if (overviewMapView && overviewMapView.padding.top !== height) {
                        overviewMapView.padding.top = height;
                    }

                });
            }


        };

        return widget;
    }

}

export default OverviewMapWidgetFactory;