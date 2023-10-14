import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { tableHeader, text, remarks } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import SideBar from './ui/SideBar';
// import RightDeliveryDetails from './ui/RightDeliveryDetails';
import {
    Table,
    TableWrapper,
    Row,
    Cell,
} from 'react-native-table-component';
import { getVehicle, getDomain, getlogUser } from './functions/helper';
import { moderateScale, verticalScale } from './styles/Metrics';
import { Checkbox, ActivityIndicator, MD2Colors, Avatar, Button, TextInput } from 'react-native-paper';

export default function DieselOutTransfer({ navigation, route }) {
    const domain = getDomain();
    const { t, i18n } = useTranslation();
    const parameter = getVehicle();
    const [showInput, setshowInput] = useState(false);
    const [CurrentTab, setCurrentTab] = useState(1);
    const [checked, setChecked] = useState([])
    const [orderList, setOrderList] = useState([])
    const [loading, setLoading] = useState(true)
    const [detailData, setdetailData] = useState([]);
    const [detailDataTransfer, setdetailDataTransfer] = useState([]);
    const [showDate, setShowDate] = useState(false)
    const headerData = ['Date', 'Prod', 'Quantity'];
    const headerDataTransfer = ['Date', 'To', 'Quantity'];
    const [dateInput, setDateInput] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [showdetails, setshowdetails] = useState(false);
    const [quantity, setquantity] = useState(null);
    const [Selected, setSelected] = useState(null)
    const [transferData, settransferData] = useState(null);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const postJobTransfer = () => {
        const userlog = getlogUser();
        const url = domain + "/PostJobTransfer"
        const data = transferData[Selected];
        data.QTY = quantity;
        data.UPDATE_BY = userlog;
        console.log("PostJobTransfer", data)
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result == 'updated successfully') {
                    setSelected(null);
                    setshowdetails(false);
                    getTransferList(formatDate(new Date()));
                } else {
                    console.log(result)
                    Alert.alert("Failed to update");
                }
            })
            .catch(error => {
                console.log("Error:", error);
            })
    }
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", formatDate(new Date(date).toLocaleDateString()));
        getTransferList(formatDate(new Date(date)));
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
        getTransferList(formatDate(new Date()));

    }, [])
    const getTransferList = async (sDate) => {
        setChecked([])
        setLoading(true);
        try {
            // console.log(domain + `/getJobTransfer?_token=2AF70A0A-A8D8-49D1-9869-D206E7B38103&transferType=In-Bound&veh_no=YN967R`)
            const response = await fetch(domain + `/getJobTransfer?_token=2AF70A0A-A8D8-49D1-9869-D206E7B38103&transferType=Out-Bound&veh_no=${parameter.vehicle.VEHICLE_INFO}&recDate=${sDate}`);

            const json = await response.json();
            // const json = [{ "PROD_ID": 0, "REMARK": "", "TRANSFER_TYPE": 0, "VEHICLE_FROM": "", "VEHICLE_TO": "YN2878B", "qty": 5800 }, { "PROD_ID": 0, "REMARK": "", "TRANSFER_TYPE": 0, "VEHICLE_FROM": "", "VEHICLE_TO": "YN2878B", "qty": 5555 }]

            console.log(json);
            if (json && json.length > 0 && !(json[0].Error)) {
                console.log('data', json);
                const transformedData = json?.map(item => [
                    item ? new Date(item.REC_DATE).toLocaleDateString() : '',
                    item?.VEHICLE_TO,
                    item?.QTY
                ]);
                settransferData(json);
                setdetailDataTransfer(transformedData)
            }
            else {
                setdetailDataTransfer([])
            }
            setLoading(false);
        } catch (error) {
            // console.error(error);
            setLoading(false)
        }
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

    const sortedData = detailData?.sort((a, b) => {
        return true
    });
    const sortedDataTransfer = detailDataTransfer?.sort((a, b) => {
        return true
    });

    return (
        <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
            <SideBar all={true} navigation={navigation} />
            <Modal
                animationType='none'
                transparent={true}
                visible={loading}
            >
                <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ marginTop: '25%' }} size='large' />
            </Modal>
            <Modal
                animationType='none'
                transparent={true}
                visible={showdetails}

            >
                <View style={{ justifyContent: 'center', display: 'flex', width: '100%', height: '100%', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View style={{ width: '50%', backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity
                                style={{ width: 30 }}
                                onPress={() => {
                                    setshowdetails(false)
                                }}>
                                <Text style={[text, { textAlign: 'right' }]}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                fontSize: 20,
                                color: '#01315C',
                                marginRight: 40,
                            }}>
                            Quantity
                        </Text>
                        <KeyboardAvoidingView
                            style={{ marginBottom: 20 }}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <TextInput style={[remarks, { fontSize: 20, height: 30 }]} value={quantity} onChangeText={text => setquantity(text)} />
                        </KeyboardAvoidingView>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    postJobTransfer()
                                }}>
                                <Text style={text}>{t('submit')}</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                onPress={() => {
                                    setshowdetails(false)
                                }}>
                                <Text style={[text, { marginLeft: 10 }]}>Close</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>

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

                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.replace('DieselTransfer');
                            }}>
                            <Icon
                                name="plus"
                                color="#01315C"
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showDatePicker}>
                            <Avatar.Icon size={50} icon="calendar-month-outline" style={{ backgroundColor: 'white' }} color='#01315C' />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity style={{ borderBottomWidth: 3, paddingBottom: 10 }}>
                        <Text style={[text, { marginTop: verticalScale(15) }]}>
                            {/* {t('transferList')} */}
                            Transfer List
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#01315C',
                            flex: 1,
                        }}
                    />
                </View>
                <Table style={{ flex: 1 }}>
                    <Row
                        data={headerDataTransfer}
                        flexArr={[1, 1, 1]}
                        style={tableHeader}
                        textStyle={text}
                    />
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}>
                        {sortedDataTransfer.length > 0 ? sortedDataTransfer?.map((rowData, index) => (
                            <TouchableOpacity
                                key={index.toString()}
                                onPress={() => {
                                    setshowdetails(true);
                                    setquantity(rowData[2].toString());
                                    setSelected(index);
                                }}>
                                <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                                    {rowData?.map((cellData, cellIndex) => (
                                        <Cell
                                            flex={1}
                                            key={cellIndex}
                                            data={cellData
                                            }
                                            textStyle={[
                                                {
                                                    fontSize: 18,
                                                    color: '#01315C',
                                                    paddingVertical: 20,
                                                    backgroundColor: 'red',
                                                },
                                            ]}
                                        />
                                    ))}
                                </TableWrapper>
                            </TouchableOpacity>
                        )) : <>
                            <Text style={{ color: 'black', fontSize: 20, textAlign: 'center', marginTop: 30, fontWeight: 'bold' }}>No Transfers</Text>
                        </>}
                        {/* <Rows data={detailData} textStyle={dataText} /> */}
                    </ScrollView>
                </Table>
            </View>
            {/* <RightDeliveryDetails show={showInput} hide={() => setshowInput(false)} /> */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={dateInput}

            />
        </View>
    );
}
