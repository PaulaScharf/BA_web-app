# BA_web-app

This project uses the device sensors (gps, sensors) to position the web scene's camera. Additionally, the camera stream is used to underlay the web scene.

## Requirements

* map.apps >= 4.8.3

## Usage

The project supports a 'remote project' and 'standalone project' mode.

### Use 'remote project' mode

In this mode a running map.apps installation must be available on a different machine or server and the map.apps core JavaScript resources are fetched from there.
This mode is the recommended one.

The URL to the existing map.apps installation can be configured inside the `pom.xml` file of this project: 

Replace

```xml
 <mapapps.remote.base>.</mapapps.remote.base>
```

with

```xml
 <mapapps.remote.base>http://yourserver/mapapps</mapapps.remote.base>
```

As an alternative, the URL can be declared in a file called `build.properties` with the content

```properties
mapapps.remote.base=http://yourserver/mapapps
```

The "env-dev" Maven profile must be activated when using a `build.properties` file. To activate this profile append `-P env-dev` or `-Denv=dev` to any Maven execution or declare the profile as activated by default in your Maven `settings.xml` file.

### Use 'stand-alone project' mode

In this mode all JavaScript sources are added to this project during development.
The drawback of this mode is that you cannot test authentication and that the default settings are not read from the remote instance.

To use the 'stand-alone project' mode, activate the Maven profile `include-mapapps-deps`: Append `-P include-mapapps-deps` to any Maven execution command or declare the profile as activated by default in your Maven `settings.xml`.

When developing live-configuration widgets in Chrome, this mode is compelling.

### Start a local HTTP server

Start the integrated Jetty server with:

```sh
mvn clean jetty:run -P watch-all
```

Make sure that the `watch-all` Maven profile is activated.
The profile will start a gulp task that watches for changes in your source code.

The Jetty server is then available at [http://localhost:9090](http://localhost:9090).

### Start coding

For detailed documentation on how to develop for map.apps go to the [conterra Developer Network](https://developernetwork.conterra.de/de/documentation/mapapps/development-guide) (registration required).

### Make your code production ready

Execute the following command to ensure that all files are compressed/minified and a `dependencies.json` file is calculated:

```sh
mvn clean install -P compress
```

### Upload your code to a map.apps installation

To upload your apps and bundles after compression to an existing map.apps installation activate the `upload` profile:

```sh
mvn clean install -P compress,upload
```

### Running the tests

To execute the unit tests inside the project, run [http://localhost:9090/js/tests/runTests.html](http://localhost:9090/js/tests/runTests.html).

> If you run the project in 'remote project' mode, you will have to edit the `test-init.js` file located in the `/src/test/webapp/js/tests/` folder.

### Build Process

* The gulpfile that describes the build process for map.apps themes can be found in the root directory: `/gulpfile.js`
* The `/package.json` file contains the version numbers for the required dependencies for the gulp build process.