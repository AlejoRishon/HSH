import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { tableHeader, text } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';
import { useTranslation } from 'react-i18next';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { check, PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions';
import {
    BLEPrinter,
    ColumnAlignment,
    COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import SideBar from './ui/SideBar';
// import RightDeliveryDetails from './ui/RightDeliveryDetails';
import {
    Table,
    TableWrapper,
    Row,
    Cell,
} from 'react-native-table-component';
import { getVehicle, getDomain } from './functions/helper';
import { moderateScale, verticalScale } from './styles/Metrics';
import { Checkbox, ActivityIndicator, MD2Colors, Avatar, Button, TextInput } from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialogComp from './DialogComp'

const { width } = Dimensions.get('window');

export default function InOut({ navigation, route }) {
    const domain = getDomain();
    const { t, i18n } = useTranslation();
    const parameter = getVehicle();
    const [qtyin, setqtyin] = useState(0);
    const [qtyout, setqtyout] = useState(0);
    const [TotalLitres, setTotalLitres] = useState(0);
    const [minDate, setminDate] = useState(null);
    const [checked, setChecked] = useState([])
    const [orderList, setOrderList] = useState([])
    const [loading, setLoading] = useState(true)
    const [detailData, setdetailData] = useState([])
    const [showDate, setShowDate] = useState(false)
    const [headerData, setheaderData] = useState(['Date', 'Direction', 'QTY IN', 'QTY OUT', 'QTY BALANCE']);
    const [dateInput, setDateInput] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        console.log(parameter)
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", formatDate(new Date(date).toLocaleDateString()));
        getDeliveryOrder(formatDate(new Date(date)))
        hideDatePicker();
        setDateInput(new Date(date));

    };

    const formatDate = (inputDate) => {

        let day = inputDate.getDate();

        let month = inputDate.getMonth() + 1;

        let year = inputDate.getFullYear();
        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = `0${month}`;
        }

        let formatted = `${year}-${month}-${day}`;
        return formatted;
    };



    useEffect(() => {
        getDeliveryOrder(formatDate(new Date()))
        var currentDate = new Date();

        // Subtract 14 days (2 weeks)
        var twoWeeksAgo = new Date(currentDate.getTime() - (14 * 24 * 60 * 60 * 1000));

        // Extract the year, month, and day
        var year = twoWeeksAgo.getFullYear();
        var month = twoWeeksAgo.getMonth() + 1; // Month is zero-based
        var day = twoWeeksAgo.getDate();

        // Format the date as desired (e.g., YYYY-MM-DD)
        var formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        console.log("formattedDate", formattedDate);
        setminDate(new Date(formattedDate));
        return () => {
            // getDeliveryOrder(formatDate(new Date()))
        }

    }, [])

    const getDeliveryOrder = async (sdate) => {
        setChecked([])
        setLoading(true);
        console.log(sdate)
        NetInfo.fetch().then(async networkState => {
            console.log("Is connected? - ", domain + `/GetDieselMovement?_token=4B3B5C99-57E8-4593-A0AD-3D4EEA3C2F53&dtFrom=${sdate}&dtTo=${sdate}&vehicle=${parameter.vehicle.VEHICLE_INFO}`);

            try {
                const response = await fetch(domain + `/GetDieselMovement?_token=4B3B5C99-57E8-4593-A0AD-3D4EEA3C2F53&dtFrom=${sdate}&dtTo=${sdate}&vehicle=${parameter.vehicle.VEHICLE_INFO}`);

                const json = await response.json();
                console.log(json);
                if (json) {
                    // setOrderList(json);

                    // var totalLitres = 0;
                    var detailData = json.RPT_DIESEL_MOVEMENT_DETAIL;
                    console.log("detailData", detailData)
                    var total_in = 0;
                    var total_out = 0;
                    const transformedData = detailData?.map(item => {
                        var date = item?.REC_DATE.split("T");
                        var time = date[1].split(".");
                        total_in += parseFloat(item?.QTY_IN);
                        total_out += parseFloat(item?.QTY_OUT);
                        return [
                            date[0] + " " + time[0],
                            item?.DIRECTION,
                            item?.QTY_IN,
                            item?.QTY_OUT,
                            item?.QTY_BALANCE,

                        ]
                    });
                    var header = headerData;
                    header[2] = `QTY IN \n (${total_in})`;
                    header[3] = `QTY OUT \n (${total_out})`;
                    setheaderData([...header])
                    // setqtyin(total_in);
                    // setqtyout(total_out);
                    // setTotalLitres(totalLitres);
                    console.log(transformedData)
                    setdetailData(transformedData)
                }
                else {
                    setOrderList([]);
                    setdetailData([])
                }
                setLoading(false)
            } catch (error) {
                // console.error(error);
                setLoading(false)
            }

        });
    }

    const statusColor = {
        Pending: { text: '#EA631D', button: 'rgba(255, 181, 114, 0.47)' },
        Completed: { text: '#3DB792', button: 'rgba(107, 226, 190, 0.24)' },
    };

    const elementTransfer = (data, index) => {
        return <Icon name="plus" color="#2196F3" size={'large'} />;
    };

    const onPressCheckbox = (index) => {
        if (checked.includes(index)) {
            setChecked(checked.filter((i) => i !== index))
        } else {
            setChecked([index])
        }
    }



    const element = (data, index, status) => {
        // console.log("element", status)
        if (data === 'Transfer') {
            return (
                <Text
                    style={{
                        color: '#fff',
                        alignSelf: 'center',
                    }}>
                    {/* <Icon name="refresh" color="#2196F3" size={22} /> */}
                    < Checkbox
                        disabled={status !== 'Pending' && status !== 'Delivered'}
                        status={checked.includes(index) ? 'checked' : 'unchecked'}
                        onPress={() => onPressCheckbox(index)}
                        color='#01315C'
                    />
                </Text>
            );
        } else {
            return (<Text
                style={{
                    color: statusColor[data] ? statusColor[data].text : 'black',
                    alignSelf: 'flex-start',
                    paddingVertical: 10
                }}>
                {data}
            </Text>
            );
        }
    };


    const [printers, setPrinters] = useState([]);
    const [printModal, setprintModal] = useState([]);






    return (
        <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
            {/* <SideBar all={true} navigation={navigation} /> */}
            <Modal
                animationType='none'
                transparent={true}
                visible={loading}
            >
                <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ marginTop: '25%' }} size='large' />
            </Modal>
            <View style={{ flex: 1, margin: moderateScale(10) }}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Main');
                            }}>
                            <Icon
                                name="chevron-left"
                                color="#01315C"
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                        <Text style={text}>{parameter.vehicle.VEHICLE_INFO}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={showDatePicker}>
                            <Avatar.Icon size={50} icon="calendar-month-outline" style={{ backgroundColor: 'white' }} color='#01315C' />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Text style={[text, { marginTop: verticalScale(15) }]}>
                        Total In: {qtyin}
                    </Text>
                    <Text style={[text, { marginTop: verticalScale(15) }]}>
                        {`Total Out: ${qtyout}`}
                    </Text>
                </View> */}
                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            borderBottomWidth: 3,
                            borderBottomColor: '#01315C',
                            marginVertical: verticalScale(10),
                            width: 40,
                        }}
                    />
                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#01315C',
                            marginVertical: verticalScale(15),
                            flex: 1,
                        }}
                    />
                </View> */}
                <Table style={{ flex: 1 }}>
                    <Row
                        data={headerData}
                        flexArr={[1, 1, 0.5, 0.5, 0.5]}
                        style={tableHeader}
                        textStyle={text}
                    />
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}>
                        {detailData.length > 0 ? detailData?.map((rowData, index) => (
                            // <View key={index.toString()}>
                            <TouchableOpacity
                                key={index.toString()}>
                                <TableWrapper key={index} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    {rowData?.map((cellData, cellIndex) => (
                                        <Cell
                                            flex={cellIndex == 0 ? 1 : cellIndex == 1 ? 1 : 0.5}
                                            key={cellIndex}
                                            data={cellData}
                                            textStyle={
                                                {
                                                    fontSize: width / 50,
                                                    color: '#01315C',
                                                    paddingVertical: 10,
                                                    backgroundColor: 'red',
                                                }}
                                        />
                                    ))}
                                </TableWrapper>
                            </TouchableOpacity>
                            // </View>
                        )) : <>
                            <Text style={{ color: 'black', fontSize: 20, textAlign: 'center', marginTop: 30, fontWeight: 'bold' }}>No Jobs for this day</Text>
                        </>}
                        {/* <Rows data={detailData} textStyle={dataText} /> */}
                    </ScrollView>
                </Table>
            </View>
            <DialogComp visible={printModal} onClose={(val) => setprintModal(false)}>
                {
                    printers.map((printer, index) => (
                        <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, width: '100%' }} key={printer.inner_mac_address} onPress={() => _connectPrinter(printer)}>
                            <Text style={{ color: 'black', fontSize: 15, textAlign: 'center' }}>{`${printer.device_name}(${printer.inner_mac_address})`}</Text>
                        </TouchableOpacity>
                    ))
                }
            </DialogComp>
            {/* <RightDeliveryDetails show={showInput} hide={() => setshowInput(false)} /> */}
            <DateTimePickerModal
                date={dateInput}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            // minimumDate={minDate}
            // maximumDate={new Date()}
            />
        </View>
    );
}
