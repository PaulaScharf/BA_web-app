class GeolocationAPILocationProvider {
    static watchPosition(callback, errback, options) {
        let watcher = navigator.geolocation.watchPosition(callback, errback, options);
        return {
            remove() {
                if (watcher !== undefined) {
                    geolocation.clearWatch(watcher);
                    watcher = undefined;
                }
            }
        };
    }

}

export default GeolocationAPILocationProvider;
