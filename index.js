import React from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

const noop = () => { };

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_ARROW_SIZE = new Size(10, 5);

export default class Popover extends React.Component {

    static defaultProps = {
        isVisible: false,//是否展示
        displayArea: new Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT),//展示区域
        arrowSize: DEFAULT_ARROW_SIZE,//三角大小
        placement: 'auto',//位置
        fromRect: { x: 0, y: 0, width: 0, height: 0 },//标记位置
        onClose: noop,//关闭回调
    }

    calAttribute = {
        popoverOrigin: new Point(SCREEN_WIDTH + SCREEN_HEIGHT, 0, 0, 0),
        anchorPoint: new Point(0, 0, 0, 0),
        placement: 'auto',
    }

    transform = {}

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this._onOrientationChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._onOrientationChange);
    }

    _onOrientationChange = () => {
        this.props.onClose && this.props.onClose();
    };

    computeGeometry({ contentSize, placement }) {
        placement = placement || this.props.placement;

        const options = {
            displayArea: this.props.displayArea,
            fromRect: this.props.fromRect,
            arrowSize: this.getArrowSize(placement),
            contentSize,
        }

        switch (placement) {
            case 'top':
                return this.computeTopGeometry(options);
            case 'bottom':
                return this.computeBottomGeometry(options);
            case 'left':
                return this.computeLeftGeometry(options);
            case 'right':
                return this.computeRightGeometry(options);
            default:
                return this.computeAutoGeometry(options);
        }
    }
    computeTopGeometry({ displayArea, fromRect, contentSize, arrowSize }) {
        const popoverOrigin = new Point(
            Math.min(displayArea.x + displayArea.width - contentSize.width,
                Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
            fromRect.y - contentSize.height - arrowSize.height);
        const anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y);

        this.calAttribute.popoverOrigin = popoverOrigin;
        this.calAttribute.anchorPoint = anchorPoint;
        this.calAttribute.placement = 'top';
    }
    computeBottomGeometry({ displayArea, fromRect, contentSize, arrowSize }) {
        const popoverOrigin = new Point(
            Math.min(displayArea.x + displayArea.width - contentSize.width,
                Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
            fromRect.y + fromRect.height + arrowSize.height);
        const anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y + fromRect.height);

        this.calAttribute.popoverOrigin = popoverOrigin;
        this.calAttribute.anchorPoint = anchorPoint;
        this.calAttribute.placement = 'bottom';
    }
    computeLeftGeometry({ displayArea, fromRect, contentSize, arrowSize }) {
        const popoverOrigin = new Point(fromRect.x - contentSize.width - arrowSize.width,
            Math.min(displayArea.y + displayArea.height - contentSize.height,
                Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)));
        const anchorPoint = new Point(fromRect.x, fromRect.y + fromRect.height / 2.0);

        this.calAttribute.popoverOrigin = popoverOrigin;
        this.calAttribute.anchorPoint = anchorPoint;
        this.calAttribute.placement = 'left';
    }
    computeRightGeometry({ displayArea, fromRect, contentSize, arrowSize }) {
        const popoverOrigin = new Point(fromRect.x + fromRect.width + arrowSize.width,
            Math.min(displayArea.y + displayArea.height - contentSize.height,
                Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)));
        const anchorPoint = new Point(fromRect.x + fromRect.width, fromRect.y + fromRect.height / 2.0);

        this.calAttribute.popoverOrigin = popoverOrigin;
        this.calAttribute.anchorPoint = anchorPoint;
        this.calAttribute.placement = 'right';
    }
    computeAutoGeometry({ displayArea, contentSize }) {
        const placementsToTry = ['left', 'right', 'bottom', 'top'];

        for (let i = 0; i < placementsToTry.length; i++) {
            const placement = placementsToTry[i];
            this.computeGeometry({ contentSize: contentSize, placement: placement });
            const { popoverOrigin } = this.calAttribute;

            if (popoverOrigin.x >= displayArea.x
                && popoverOrigin.x <= displayArea.x + displayArea.width - contentSize.width
                && popoverOrigin.y >= displayArea.y
                && popoverOrigin.y <= displayArea.y + displayArea.height - contentSize.height) {
                break;
            }
        }
    }
    getArrowSize(placement) {
        const size = this.props.arrowSize;
        switch (placement) {
            case 'left':
            case 'right':
                return new Size(size.height, size.width);
            default:
                return size;
        }
    }
    getArrowColorStyle(color) {
        return { borderTopColor: color };
    }

    getArrowDynamicStyle() {
        popoverOrigin
        const { popoverOrigin, anchorPoint } = this.calAttribute;
        const arrowSize = this.props.arrowSize;
        const width = arrowSize.width + 2;
        const height = arrowSize.height * 2 + 2;

        return {
            left: anchorPoint.x - popoverOrigin.x - width / 2,
            top: anchorPoint.y - popoverOrigin.y - height / 2,
            width: width,
            height: height,
            borderTopWidth: height / 2,
            borderRightWidth: width / 2,
            borderBottomWidth: height / 2,
            borderLeftWidth: width / 2,
        }
    }

    getArrowRotation(placement) {
        switch (placement) {
            case 'bottom':
                return '180deg';
            case 'left':
                return '-90deg';
            case 'right':
                return '90deg';
            default:
                return '0deg';
        }
    }

    measureContent(x) {
        const { width, height } = x.nativeEvent.layout;
        const contentSize = { width, height };
        this.computeGeometry({ contentSize });

        const transform = this.getArrowRotation(this.calAttribute.placement)
        this.transform = { transform: [{ rotate: transform }] }
        this.forceUpdate();
    }

    render() {
        if (!this.props.isVisible) {
            this.calAttribute = {
                popoverOrigin: new Point(SCREEN_WIDTH + SCREEN_HEIGHT, 0, 0, 0),
                anchorPoint: new Point(0, 0, 0, 0),
                placement: 'auto',
            }
            this.transform = {};
            return null;
        }

        const popoverOrigin = this.calAttribute.popoverOrigin

        const contentStyle = [styles.content];
        const arrowColor = StyleSheet.flatten(contentStyle).backgroundColor;
        const arrowColorStyle = this.getArrowColorStyle(arrowColor);
        const arrowDynamicStyle = this.getArrowDynamicStyle();

        const arrowStyle = [styles.arrow, arrowDynamicStyle, arrowColorStyle, this.transform];

        return (
            <TouchableWithoutFeedback onPress={this.props.onClose}>
                <View style={styles.container}>
                    <View style={[styles.popover, {
                        top: popoverOrigin.y,
                        left: popoverOrigin.x,
                    }]}>
                        <View style={arrowStyle} />
                        <View style={contentStyle} onLayout={this.measureContent.bind(this)}>
                            {this.props.children}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
};


var styles = StyleSheet.create({
    container: {
        opacity: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        backgroundColor: 'transparent',
    },
    popover: {
        backgroundColor: 'transparent',
        position: 'absolute',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        shadowOpacity: 0.8,
    },
    content: {
        borderRadius: 3,
        padding: 6,
        backgroundColor: '#fff',
    },
    arrow: {
        position: 'absolute',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
});
