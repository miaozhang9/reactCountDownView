/**
 * Created by miaoz on 16/8/16.
 */
import React, {
    Component,
} from 'react';

import {
    View,
    DeviceEventEmitter,
    Platform,
    Text,
} from 'react-native';
import ShoppingCountDownView from './ShoppingCountDownView';
import YZTAnyPurchaseNativeModule from '../../../NativeModules/YZTAnyPurchaseModule';

const isIOS = Platform.OS === 'ios';

export default class ShoppingCountDownQuantityMainView extends Component {
    static propTypes = {
        borderTextColor: React.PropTypes.string,
        textColor: React.PropTypes.string,
        borderColor: React.PropTypes.string,
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        fontSize: React.PropTypes.number,
        item: React.PropTypes.object,
        type: React.PropTypes.number,
        params: React.PropTypes.object,
        compentType: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            changeNotificeIndex: true,
        };
    }

    componentWillUnmount() {
        this.refreshLastTime && this.refreshLastTime.remove();
    }

    componentDidMount() {
        /**
         * app从后台进入前台通知
         * @param
         * @param
         * @returns 刷新重新赋值倒计时
         * @private
         */
        if (isIOS) {
            this.refreshLastTime = YZTAnyPurchaseNativeModule.registerEnterForegroundNotification(() => {
                this.setState({ changeNotificeIndex: !this.state.changeNotificeIndex });
            });
        } else {
            this.refreshLastTime = DeviceEventEmitter.addListener(
                'lifeCycle',
                (data) => {
                    const params = JSON.parse(data.params);
                    if (params.lifeCycleName === 'onResume' && params.reactAppName === 'AppAnyPurchase') {
                        this.setState({ changeNotificeIndex: !this.state.changeNotificeIndex });
                    }
                });
        }
    }

    /**
     * 展示剩余数量或者天数
     * @param type 类别
     * @param item data
     * @returns {}
     * @private
     */
    _renderQuantityChildsSaleView(type, item, compentType) {
        if (type === 2 && compentType === 'goodDetail') {
            return (<Text
                style={{ justifyContent: 'center', alignItems: 'center', fontSize: 13, color: '#ffffff' }}
            >
                {`${item.remainNum}件`}
            </Text>);
        }

        let unit = '天';
        let number = 0;
        if (compentType === 'goodDetail') {
            unit = '天';
            number = item.days;
        } else { // 首页
            if (type === 2) {
                unit = '件';
                number = item.remainNum;
            } else {
                unit = '天';
                number = item.days;
            }
        }

        if (number < 10) {
            number = ` ${number} `;
        }

        const borderTextColor = this.props.borderTextColor ? this.props.borderTextColor : '#ffffff';
        const textColor = this.props.textColor ? this.props.textColor : '#4a4a4a';
        const borderColor = this.props.borderColor ? this.props.borderColor : '#333333';
        const height = this.props.height ? this.props.height : 55;
        const backgroundColor = this.props.backgroundColor ? this.props.backgroundColor : 'rgba(0,0,0,0)';
        const fontSize = this.props.fontSize ? this.props.fontSize : 24;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{ paddingLeft: 5, paddingRight: 5, marginLeft: 1, height: height / 2, borderWidth: 1, backgroundColor, borderColor, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text
                        style={{ justifyContent: 'center', alignItems: 'center', fontSize: fontSize / 2, color: borderTextColor }}
                    >
                        {number || 0}
                    </Text>
                </View>

                <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                        style={{ justifyContent: 'center', alignItems: 'center', fontSize: 12, color: textColor }}
                    >
                        {unit || ''}
                    </Text>
                </View>

            </View>
        );
    }

    /**
     * 倒计时view
     * @param type 类别
     * @param item data
     * @returns {}
     * @private
     */
    _renderFlashChildsView(type, item) {
        return (
            <ShoppingCountDownView
                item={item}
                compentType={this.props.compentType}
                textColor={this.props.textColor}
                borderTextColor={this.props.borderTextColor}
                borderColor={this.props.borderColor}
                height={this.props.height}
                width={this.props.width}
                backgroundColor={this.props.backgroundColor}
                fontSize={this.props.fontSize}
            />);
    }

    render() {
        const { type, item, compentType } = this.props;

        // 获取当前时间戳
        const currentTimestamp = new Date().getTime();

        // console.log('获得当前时间:'+ currentTimestamp)
        // 获取某个时间格式的时间戳
        const lastTime = item.endSellDate ? item.endSellDate : '';
        /* eslint-disable */
        const newstr = lastTime.replace(/-/g,'/');
        /* eslint-enable */
        const date = new Date(newstr);
        const lastTimestamp = date.getTime().toString();

        const earlyTime = item.beginSellDate ? item.beginSellDate : '';
        /* eslint-disable */
        const newstr2 = earlyTime.replace(/-/g,'/');
        /* eslint-enable */
        const date2 = new Date(newstr2);
        const earlyTimestamp = date2.getTime().toString();

        let date3 = '';
        // date3 = lastTimestamp - currentTimestamp;
        // console.log('在售获得差值:'+ date3);
        //sellStatus 0 是在售 3是预售
        // alert(item.sellStatus);

        // if (item.sellStatus === '0') {
        //     date3 = lastTimestamp - currentTimestamp;
        //
        //      // console.log('在售获得差值:'+ date3);
        // } else if (item.sellStatus === '3') {
        //     date3 = earlyTimestamp - currentTimestamp;
        //     // console.log('预售获得差值:'+ date3);
        // } else {
        //     date3 = lastTimestamp - currentTimestamp;
        // }

        if (parseFloat(currentTimestamp) > parseFloat(earlyTimestamp)) {
            date3 = lastTimestamp - currentTimestamp;
            // console.log('在售获得差值:'+ date3);
        } else if (parseFloat(currentTimestamp) < parseFloat(earlyTimestamp)) {
            date3 = earlyTimestamp - currentTimestamp;
            // console.log('预售获得差值:'+ date3);
        } else {
            date3 = lastTimestamp - currentTimestamp;
        }


         //
        // 天
        const days = Math.floor(date3 / (24 * 3600 * 1000));
        // 时
        const leave1 = date3 % (24 * 3600 * 1000);
        const hours = Math.floor(leave1 / (3600 * 1000));
        // 分
        const leave2 = leave1 % (3600 * 1000);
        const minutes = Math.floor(leave2 / (60 * 1000));
        // 秒
        const leave3 = leave2 % (60 * 1000);
        const seconds = Math.round(leave3 / 1000);

        // console.log("天:"+days+",时:"+hours+",分:"+minutes+",秒:"+seconds);
        // let params = { days: days, hours: hours, minutes: minutes, seconds: seconds };

        if (type === 1) { // 限时
            if (days < 2) {
                item.hours = days * 24 + hours;
                item.minutes = minutes;
                item.seconds = seconds;

                return this._renderFlashChildsView(type, item);
            } else {
                item.days = days + 1;
                return this._renderQuantityChildsSaleView(type, item);
             }
        } else if (type === 2) { // 限量
                return this._renderQuantityChildsSaleView(type, item, compentType);
        } else { // 品牌if (type == 3)
            if (days < 2) {
                item.hours = days * 24 + hours;
                item.minutes = minutes;
                item.seconds = seconds;
                return this._renderFlashChildsView(type, item);
            } else {
                item.days = days + 1;
                return this._renderQuantityChildsSaleView(type, item);
            }
        }
    }
}
