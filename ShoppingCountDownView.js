
import React, {
    Component,
} from 'react';
import {
    StyleSheet,
    View,
    DeviceEventEmitter,
    Text,
    Image,
} from 'react-native';

const styles = StyleSheet.create({
    yzttext: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 2,
        borderWidth: 1,
        flexDirection: 'row',
    },
});

export default class CountDownView extends Component {

    static propTypes = {
        textColor: React.PropTypes.string,
        borderTextColor: React.PropTypes.string,
        borderColor: React.PropTypes.string,
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        fontSize: React.PropTypes.number,
        item: React.PropTypes.object,
        compentType: React.PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.timerNum = 0;

        this.state = {
            item: this.props.item,
            Second: this.props.item.seconds,
            Minute: this.props.item.minutes,
            Hour: this.props.item.hours,
            SecondString: '',
            MinuteString: '',
            HourString: '',
        };
        this._startTimer();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ item: nextProps.item, Second: nextProps.item.seconds, Minute: nextProps.item.minutes, Hour: nextProps.item.hours });
         this._startTimer();
    }

    _spliceString() {
        if (this.state.Second < 10) {
            this.setState({ SecondString: '0'.concat(this.state.Second.toString()) });
        } else {
            this.setState({ SecondString: this.state.Second.toString() });
        }
        if (this.state.Minute < 10) {
            this.setState({ MinuteString: '0'.concat(this.state.Minute.toString()) });
        } else {
            this.setState({ MinuteString: this.state.Minute.toString() });
        }
        if (this.state.Hour < 10) {
            this.setState({ HourString: '0'.concat(this.state.Hour.toString()) });
        } else {
            this.setState({ HourString: this.state.Hour.toString() });
        }
        /**
         * sellStatus 3 是预售
         **/
        if (this.state.Second <= 0 && this.state.Minute <= 0 && this.state.Hour <= 0 && this.props.item.sellStatus === '3') {
            DeviceEventEmitter.emit('YZTAnyPurchaseHomeRefreshNotification');
        }
    }

    /**
     * 启动定时器倒计时
     * @returns {}
     * @private
     */
    _startTimer() {
          this.interval && clearInterval(this.interval);

        // this._spliceString();

        this.interval = setInterval(() => {
                this.state.Second -= 1;

                if (this.state.Second < 0) {
                    if (this.state.Minute >= 0) {
                        this.state.Second = 59;
                        // 分钟需要减去一
                        this.state.Minute -= 1;
                    }

                    if (this.state.Minute < 0) {
                        if (this.state.Hour >= 0) {
                            this.state.Minute = 59;
                            this.state.Hour -= 1;
                        }

                        if (this.state.Hour < 0) {
                            this.state.Hour = 0;
                            this.state.Minute = 0;
                            this.state.Second = 0;
                            this.interval && clearInterval(this.interval);
                        }
                    }
                }

            this._spliceString();
        }, 1000);
    }
    componentDidMount() {

    }

    componentWillUnmount() {
         this.interval && clearInterval(this.interval);
    }

    _renderColonView(compentType) {
        if (compentType && compentType === 'goodDetail') {
            return (<Text style={{ marginLeft: 2, height: 25, width: 5, color: '#ffffff' }}>:</Text>);
        } else {
            return (<Image
                            style={{ marginLeft: 2, height: 15, width: 3, resizeMode: 'cover' }}
                             defaultImage={require('../img/YZTAnyPurchase_CountDown_Colon.png')}
                             source={require('../img/YZTAnyPurchase_CountDown_Colon.png')}
            />);
        }
    }
    render() {
        const borderTextColor = this.props.borderTextColor ? this.props.borderTextColor : '#ffffff';
        const borderColor = this.props.borderColor ? this.props.borderColor : '#333333';
        const height = this.props.height ? this.props.height : 55;
        const width = this.props.width ? this.props.width : 55;
        const backgroundColor = this.props.backgroundColor ? this.props.backgroundColor : 'rgba(0,0,0,0)';
        const fontSize = this.props.fontSize ? this.props.fontSize : 24;

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.yzttext, { borderColor, height: height / 2, width: width / 2, backgroundColor }]}>
                    <Text style={{ fontSize: fontSize / 2, color: borderTextColor, backgroundColor }}>{this.state.HourString || '00'}</Text>
                </View>
                {this._renderColonView(this.props.compentType)}
                <View style={[styles.yzttext, { borderColor, height: height / 2, width: width / 2, backgroundColor }]}>
                    <Text style={{ fontSize: fontSize / 2, color: borderTextColor, backgroundColor }}>{this.state.MinuteString || '00'}</Text>
                </View>
                {this._renderColonView(this.props.compentType)}
                <View style={[styles.yzttext, { borderColor, height: height / 2, width: width / 2, backgroundColor }]}>
                    <Text style={{ fontSize: fontSize / 2, color: borderTextColor, backgroundColor }}>{this.state.SecondString || '00'}</Text>
                </View>
            </View>
        );
    }
}
