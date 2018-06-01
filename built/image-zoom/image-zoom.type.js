"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Props = (function () {
    function Props() {
        this.cropWidth = 100;
        this.cropHeight = 100;
        this.imageWidth = 100;
        this.imageHeight = 100;
        this.panToMove = true;
        this.pinchToZoom = true;
        this.clickDistance = 10;
        this.maxOverflow = 100;
        this.longPressTime = 800;
        this.doubleClickInterval = 175;
        this.style = {};
        this.swipeDownThreshold = 230;
        this.enableSwipeDown = false;
        this.enableHorizontalBounce = false;
        this.enableCenterFocus = true;
        this.minScale = 0.6;
        this.maxScale = 10;
        this.onClick = function () {
        };
        this.onDoubleClick = function () {
        };
        this.onLongPress = function () {
        };
        this.horizontalOuterRangeOffset = function () {
        };
        this.onDragLeft = function () {
        };
        this.responderRelease = function () {
        };
        this.onMove = function () {
        };
        this.layoutChange = function () {
        };
        this.onSwipeDown = function () {
        };
    }
    return Props;
}());
exports.Props = Props;
var State = (function () {
    function State() {
        this.centerX = 0.5;
        this.centerY = 0.5;
    }
    return State;
}());
exports.State = State;
//# sourceMappingURL=image-zoom.type.js.map