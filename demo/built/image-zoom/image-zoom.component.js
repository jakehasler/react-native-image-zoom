"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_1 = require("react-native");
var image_zoom_style_1 = require("./image-zoom.style");
var image_zoom_type_1 = require("./image-zoom.type");
var isMobile = function () {
    if (react_native_1.Platform.OS === 'web') {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    else {
        return true;
    }
};
var ImageViewer = (function (_super) {
    __extends(ImageViewer, _super);
    function ImageViewer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = new image_zoom_type_1.State();
        _this.lastPositionX = null;
        _this.positionX = 0;
        _this.animatedPositionX = new react_native_1.Animated.Value(0);
        _this.lastPositionY = null;
        _this.positionY = 0;
        _this.animatedPositionY = new react_native_1.Animated.Value(0);
        _this.scale = 1;
        _this.animatedScale = new react_native_1.Animated.Value(1);
        _this.zoomLastDistance = null;
        _this.zoomCurrentDistance = 0;
        _this.imagePanResponder = null;
        _this.lastTouchStartTime = 0;
        _this.horizontalWholeOuterCounter = 0;
        _this.swipeDownOffset = 0;
        _this.horizontalWholeCounter = 0;
        _this.verticalWholeCounter = 0;
        _this.centerDiffX = 0;
        _this.centerDiffY = 0;
        _this.lastClickTime = 0;
        _this.doubleClickX = 0;
        _this.doubleClickY = 0;
        _this.isDoubleClick = false;
        _this.isLongPress = false;
        _this.isHorizontalWrap = false;
        _this.resetScale = function () {
            _this.positionX = 0;
            _this.positionY = 0;
            _this.scale = 1;
            _this.animatedScale.setValue(1);
        };
        _this.panResponderReleaseResolve = function () {
            if (_this.props.enableSwipeDown && _this.props.swipeDownThreshold) {
                if (_this.swipeDownOffset > _this.props.swipeDownThreshold) {
                    if (_this.props.onSwipeDown) {
                        _this.props.onSwipeDown();
                    }
                    return;
                }
            }
            if (_this.props.enableCenterFocus && _this.scale < 1) {
                _this.scale = 1;
                react_native_1.Animated.timing(_this.animatedScale, {
                    toValue: _this.scale,
                    duration: 100
                }).start();
            }
            if (_this.props.imageWidth * _this.scale <= _this.props.cropWidth) {
                _this.positionX = 0;
                react_native_1.Animated.timing(_this.animatedPositionX, {
                    toValue: _this.positionX,
                    duration: 100
                }).start();
            }
            if (_this.props.imageHeight * _this.scale <= _this.props.cropHeight) {
                _this.positionY = 0;
                react_native_1.Animated.timing(_this.animatedPositionY, {
                    toValue: _this.positionY,
                    duration: 100
                }).start();
            }
            if (_this.props.imageHeight * _this.scale > _this.props.cropHeight) {
                var verticalMax = (_this.props.imageHeight * _this.scale - _this.props.cropHeight) / 2 / _this.scale;
                if (_this.positionY < -verticalMax) {
                    _this.positionY = -verticalMax;
                }
                else if (_this.positionY > verticalMax) {
                    _this.positionY = verticalMax;
                }
                react_native_1.Animated.timing(_this.animatedPositionY, {
                    toValue: _this.positionY,
                    duration: 100
                }).start();
            }
            if (_this.props.enableHorizontalBounce && _this.props.imageWidth * _this.scale > _this.props.cropWidth) {
                var horizontalMax = (_this.props.imageWidth * _this.scale - _this.props.cropWidth) / 2 / _this.scale;
                if (_this.positionX < -horizontalMax) {
                    _this.positionX = -horizontalMax;
                }
                else if (_this.positionX > horizontalMax) {
                    _this.positionX = horizontalMax;
                }
                react_native_1.Animated.timing(_this.animatedPositionX, {
                    toValue: _this.positionX,
                    duration: 100
                }).start();
            }
            if (_this.props.enableCenterFocus && _this.scale === 1) {
                _this.positionX = 0;
                _this.positionY = 0;
                react_native_1.Animated.timing(_this.animatedPositionX, {
                    toValue: _this.positionX,
                    duration: 100
                }).start();
                react_native_1.Animated.timing(_this.animatedPositionY, {
                    toValue: _this.positionY,
                    duration: 100
                }).start();
            }
            _this.horizontalWholeOuterCounter = 0;
            _this.swipeDownOffset = 0;
            _this.imageDidMove('onPanResponderRelease');
        };
        return _this;
    }
    ImageViewer.prototype.componentWillMount = function () {
        var _this = this;
        this.imagePanResponder = react_native_1.PanResponder.create({
            onStartShouldSetPanResponder: function () { return isMobile(); },
            onPanResponderTerminationRequest: function () { return false; },
            onPanResponderGrant: function (evt) {
                _this.lastPositionX = null;
                _this.lastPositionY = null;
                _this.zoomLastDistance = null;
                _this.horizontalWholeCounter = 0;
                _this.verticalWholeCounter = 0;
                _this.lastTouchStartTime = new Date().getTime();
                _this.isDoubleClick = false;
                _this.isLongPress = false;
                _this.isHorizontalWrap = false;
                if (_this.singleClickTimeout) {
                    clearTimeout(_this.singleClickTimeout);
                }
                if (evt.nativeEvent.changedTouches.length > 1) {
                    var centerX = (evt.nativeEvent.changedTouches[0].pageX + evt.nativeEvent.changedTouches[1].pageX) / 2;
                    _this.centerDiffX = centerX - _this.props.cropWidth / 2;
                    var centerY = (evt.nativeEvent.changedTouches[0].pageY + evt.nativeEvent.changedTouches[1].pageY) / 2;
                    _this.centerDiffY = centerY - _this.props.cropHeight / 2;
                }
                if (_this.longPressTimeout) {
                    clearTimeout(_this.longPressTimeout);
                }
                _this.longPressTimeout = setTimeout(function () {
                    _this.isLongPress = true;
                    if (_this.props.onLongPress) {
                        _this.props.onLongPress();
                    }
                }, _this.props.longPressTime);
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    if (new Date().getTime() - _this.lastClickTime < (_this.props.doubleClickInterval || 0)) {
                        _this.lastClickTime = 0;
                        if (_this.props.onDoubleClick) {
                            _this.props.onDoubleClick();
                        }
                        clearTimeout(_this.longPressTimeout);
                        _this.doubleClickX = evt.nativeEvent.changedTouches[0].pageX;
                        _this.doubleClickY = evt.nativeEvent.changedTouches[0].pageY;
                        _this.isDoubleClick = true;
                        if (_this.scale > 1 || _this.scale < 1) {
                            _this.scale = 1;
                            _this.positionX = 0;
                            _this.positionY = 0;
                        }
                        else {
                            var beforeScale = _this.scale;
                            _this.scale = 2;
                            var diffScale = _this.scale - beforeScale;
                            _this.positionX = (_this.props.cropWidth / 2 - _this.doubleClickX) * diffScale / _this.scale;
                            _this.positionY = (_this.props.cropHeight / 2 - _this.doubleClickY) * diffScale / _this.scale;
                        }
                        _this.imageDidMove('centerOn');
                        react_native_1.Animated.parallel([
                            react_native_1.Animated.timing(_this.animatedScale, {
                                toValue: _this.scale,
                                duration: 100
                            }),
                            react_native_1.Animated.timing(_this.animatedPositionX, {
                                toValue: _this.positionX,
                                duration: 100
                            }),
                            react_native_1.Animated.timing(_this.animatedPositionY, {
                                toValue: _this.positionY,
                                duration: 100
                            })
                        ]).start();
                    }
                    else {
                        _this.lastClickTime = new Date().getTime();
                    }
                }
            },
            onPanResponderMove: function (evt, gestureState) {
                if (_this.isDoubleClick) {
                    return;
                }
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    var diffX = gestureState.dx - (_this.lastPositionX || 0);
                    if (_this.lastPositionX === null) {
                        diffX = 0;
                    }
                    var diffY = gestureState.dy - (_this.lastPositionY || 0);
                    if (_this.lastPositionY === null) {
                        diffY = 0;
                    }
                    _this.lastPositionX = gestureState.dx;
                    _this.lastPositionY = gestureState.dy;
                    _this.horizontalWholeCounter += diffX;
                    _this.verticalWholeCounter += diffY;
                    if (Math.abs(_this.horizontalWholeCounter) > 5 || Math.abs(_this.verticalWholeCounter) > 5) {
                        clearTimeout(_this.longPressTimeout);
                    }
                    if (_this.props.panToMove) {
                        if (_this.swipeDownOffset === 0) {
                            if (diffX !== 0) {
                                _this.isHorizontalWrap = true;
                            }
                            if (_this.props.imageWidth * _this.scale > _this.props.cropWidth) {
                                if (_this.props.enableHorizontalBounce) {
                                    _this.positionX += diffX / _this.scale;
                                    _this.animatedPositionX.setValue(_this.positionX);
                                }
                                else {
                                    if (_this.horizontalWholeOuterCounter > 0) {
                                        if (diffX < 0) {
                                            if (_this.horizontalWholeOuterCounter > Math.abs(diffX)) {
                                                _this.horizontalWholeOuterCounter += diffX;
                                                diffX = 0;
                                            }
                                            else {
                                                diffX += _this.horizontalWholeOuterCounter;
                                                _this.horizontalWholeOuterCounter = 0;
                                                if (_this.props.horizontalOuterRangeOffset) {
                                                    _this.props.horizontalOuterRangeOffset(0);
                                                }
                                            }
                                        }
                                        else {
                                            _this.horizontalWholeOuterCounter += diffX;
                                        }
                                    }
                                    else if (_this.horizontalWholeOuterCounter < 0) {
                                        if (diffX > 0) {
                                            if (Math.abs(_this.horizontalWholeOuterCounter) > diffX) {
                                                _this.horizontalWholeOuterCounter += diffX;
                                                diffX = 0;
                                            }
                                            else {
                                                diffX += _this.horizontalWholeOuterCounter;
                                                _this.horizontalWholeOuterCounter = 0;
                                                if (_this.props.horizontalOuterRangeOffset) {
                                                    _this.props.horizontalOuterRangeOffset(0);
                                                }
                                            }
                                        }
                                        else {
                                            _this.horizontalWholeOuterCounter += diffX;
                                        }
                                    }
                                    else {
                                    }
                                    _this.positionX += diffX / _this.scale;
                                    var horizontalMax = (_this.props.imageWidth * _this.scale - _this.props.cropWidth) / 2 / _this.scale;
                                    if (_this.positionX < -horizontalMax) {
                                        _this.positionX = -horizontalMax;
                                        _this.horizontalWholeOuterCounter += -1 / 1e10;
                                    }
                                    else if (_this.positionX > horizontalMax) {
                                        _this.positionX = horizontalMax;
                                        _this.horizontalWholeOuterCounter += 1 / 1e10;
                                    }
                                    _this.animatedPositionX.setValue(_this.positionX);
                                }
                            }
                            else {
                                _this.horizontalWholeOuterCounter += diffX;
                            }
                            if (_this.props.enableHorizontalBounce) {
                                if (_this.horizontalWholeOuterCounter > (_this.props.maxOverflow || 0)) {
                                    _this.horizontalWholeOuterCounter = _this.props.maxOverflow || 0;
                                }
                                else if (_this.horizontalWholeOuterCounter < -(_this.props.maxOverflow || 0)) {
                                    _this.horizontalWholeOuterCounter = -(_this.props.maxOverflow || 0);
                                }
                                if (_this.horizontalWholeOuterCounter !== 0) {
                                    if (_this.props.horizontalOuterRangeOffset) {
                                        _this.props.horizontalOuterRangeOffset(_this.horizontalWholeOuterCounter);
                                    }
                                }
                            }
                        }
                        if (_this.props.imageHeight * _this.scale > _this.props.cropHeight) {
                            _this.positionY += diffY / _this.scale;
                            _this.animatedPositionY.setValue(_this.positionY);
                        }
                        else {
                            if (_this.props.enableSwipeDown && !_this.isHorizontalWrap) {
                                _this.swipeDownOffset += diffY;
                                if (_this.swipeDownOffset > 0) {
                                    _this.positionY += diffY / _this.scale;
                                    _this.animatedPositionY.setValue(_this.positionY);
                                    _this.scale = _this.scale - diffY / 1000;
                                    _this.animatedScale.setValue(_this.scale);
                                }
                            }
                        }
                    }
                }
                else {
                    if (_this.longPressTimeout) {
                        clearTimeout(_this.longPressTimeout);
                    }
                    if (_this.props.pinchToZoom) {
                        var minX = void 0;
                        var maxX = void 0;
                        if (evt.nativeEvent.changedTouches[0].locationX > evt.nativeEvent.changedTouches[1].locationX) {
                            minX = evt.nativeEvent.changedTouches[1].pageX;
                            maxX = evt.nativeEvent.changedTouches[0].pageX;
                        }
                        else {
                            minX = evt.nativeEvent.changedTouches[0].pageX;
                            maxX = evt.nativeEvent.changedTouches[1].pageX;
                        }
                        var minY = void 0;
                        var maxY = void 0;
                        if (evt.nativeEvent.changedTouches[0].locationY > evt.nativeEvent.changedTouches[1].locationY) {
                            minY = evt.nativeEvent.changedTouches[1].pageY;
                            maxY = evt.nativeEvent.changedTouches[0].pageY;
                        }
                        else {
                            minY = evt.nativeEvent.changedTouches[0].pageY;
                            maxY = evt.nativeEvent.changedTouches[1].pageY;
                        }
                        var widthDistance = maxX - minX;
                        var heightDistance = maxY - minY;
                        var diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance);
                        _this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1));
                        if (_this.zoomLastDistance !== null) {
                            var distanceDiff = (_this.zoomCurrentDistance - _this.zoomLastDistance) / 200;
                            var zoom = _this.scale + distanceDiff;
                            if (zoom < _this.props.minScale) {
                                zoom = _this.props.minScale;
                            }
                            if (zoom > _this.props.maxScale) {
                                zoom = _this.props.maxScale;
                            }
                            var beforeScale = _this.scale;
                            _this.scale = zoom;
                            _this.animatedScale.setValue(_this.scale);
                            var diffScale = _this.scale - beforeScale;
                            _this.positionX -= _this.centerDiffX * diffScale / _this.scale;
                            _this.positionY -= _this.centerDiffY * diffScale / _this.scale;
                            _this.animatedPositionX.setValue(_this.positionX);
                            _this.animatedPositionY.setValue(_this.positionY);
                        }
                        _this.zoomLastDistance = _this.zoomCurrentDistance;
                    }
                }
                _this.imageDidMove('onPanResponderMove');
            },
            onPanResponderRelease: function (evt, gestureState) {
                if (_this.longPressTimeout) {
                    clearTimeout(_this.longPressTimeout);
                }
                if (_this.isDoubleClick) {
                    return;
                }
                if (_this.isLongPress) {
                    return;
                }
                var moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
                if (evt.nativeEvent.changedTouches.length === 1 && moveDistance < (_this.props.clickDistance || 0)) {
                    _this.singleClickTimeout = setTimeout(function () {
                        if (_this.props.onClick) {
                            _this.props.onClick();
                        }
                    }, _this.props.doubleClickInterval);
                }
                else {
                    if (_this.props.responderRelease) {
                        _this.props.responderRelease(gestureState.vx, _this.scale);
                    }
                    _this.panResponderReleaseResolve();
                }
            },
            onPanResponderTerminate: function () {
            }
        });
    };
    ImageViewer.prototype.componentDidMount = function () {
        if (this.props.centerOn) {
            this.centerOn(this.props.centerOn);
        }
    };
    ImageViewer.prototype.componentWillReceiveProps = function (nextProps) {
        if ((nextProps.centerOn && !this.props.centerOn) ||
            (nextProps.centerOn && this.props.centerOn && this.didCenterOnChange(this.props.centerOn, nextProps.centerOn))) {
            this.centerOn(nextProps.centerOn);
        }
    };
    ImageViewer.prototype.imageDidMove = function (type) {
        if (this.props.onMove) {
            this.props.onMove({
                type: type,
                positionX: this.positionX,
                positionY: this.positionY,
                scale: this.scale,
                zoomCurrentDistance: this.zoomCurrentDistance
            });
        }
    };
    ImageViewer.prototype.didCenterOnChange = function (params, paramsNext) {
        return params.x !== paramsNext.x || params.y !== paramsNext.y || params.scale !== paramsNext.scale;
    };
    ImageViewer.prototype.centerOn = function (params) {
        var _this = this;
        this.positionX = params.x;
        this.positionY = params.y;
        this.scale = params.scale;
        var duration = params.duration || 300;
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animatedScale, {
                toValue: this.scale,
                duration: duration
            }),
            react_native_1.Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: duration
            }),
            react_native_1.Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: duration
            })
        ]).start(function () {
            _this.imageDidMove('centerOn');
        });
    };
    ImageViewer.prototype.handleLayout = function (event) {
        if (this.props.layoutChange) {
            this.props.layoutChange(event);
        }
    };
    ImageViewer.prototype.reset = function () {
        this.scale = 1;
        this.animatedScale.setValue(this.scale);
        this.positionX = 0;
        this.animatedPositionX.setValue(this.positionX);
        this.positionY = 0;
        this.animatedPositionY.setValue(this.positionY);
    };
    ImageViewer.prototype.render = function () {
        var animateConf = {
            transform: [
                {
                    scale: this.animatedScale
                },
                {
                    translateX: this.animatedPositionX
                },
                {
                    translateY: this.animatedPositionY
                }
            ]
        };
        return (<react_native_1.View style={__assign({}, image_zoom_style_1.default.container, this.props.style, { width: this.props.cropWidth, height: this.props.cropHeight })} {...this.imagePanResponder.panHandlers}>
        <react_native_1.Animated.View style={animateConf}>
          <react_native_1.View onLayout={this.handleLayout.bind(this)} style={{
            width: this.props.imageWidth,
            height: this.props.imageHeight
        }}>
            {this.props.children}
          </react_native_1.View>
        </react_native_1.Animated.View>
      </react_native_1.View>);
    };
    ImageViewer.defaultProps = new image_zoom_type_1.Props();
    return ImageViewer;
}(React.Component));
exports.default = ImageViewer;
//# sourceMappingURL=image-zoom.component.js.map