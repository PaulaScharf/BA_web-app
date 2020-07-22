import _WidgetBase from "dijit/_WidgetBase";
import declare from "dojo/_base/declare";
import domConstruct from "dojo/dom-construct";

let videoNode = undefined;

const CameraWidget = declare([_WidgetBase], {

    baseClass: "ct-camera",
    streaming: false,

    postCreate() {
        this.inherited(arguments);
        videoNode = domConstruct.create("video", {autoplay: "", "playsinline": "", "class": "ct-camera__video"});
        this.domNode.appendChild(videoNode);
    },

    startup() {
        this.inherited(arguments);
        this.startStream();
    },

    destroy() {
        this.inherited(arguments);
        this.stopStream();
    },

    startStream() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}})
                    .then(function (stream) {
                        videoNode.srcObject = stream;
                        streaming = true;
                    })
                    .catch(function (error) {
                        console.error("Error accessing the camera.", error);
                        streaming = false;
                    });
        }
    },

    stopStream() {
        let stream = videoNode.srcObject;
        let tracks = stream ? stream.getTracks() : [];
        for (let i = 0; i < tracks.length; i++) {
            let track = tracks[i];
            track.stop();
        }
        streaming = false;
        videoNode.srcObject = null;
    }

});

export default CameraWidget;