import React, { Component } from 'react';
import {Modal, Text, TouchableHighlight, View, StyleSheet, Image, ScrollView} from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component';
import { AsyncStorage } from "react-native"
import {Game} from './gameLogic'
import PropTypes from "prop-types";


export class ModalRecordsOLD extends Component {
    state = {
        modalVisible: false,
    };
    static propTypes = {
        recObj: Records,
    };

    render() {
        return (
            <View style={{alignItems: 'flex-start'}}>
                <Modal animationType={"slide"} transparent={false}
                       visible={this.state.modalVisible}
                       onRequestClose={() => {
                       }}>
                    {this.renderInsideModal()}
                </Modal>
                <TouchableHighlight onPress={() => {
                    this.toggleModal(true)
                }}>
                    <Image source={require('./menuIcons/records.png')}/>
                </TouchableHighlight>
            </View>
        )
    }

    toggleModal(visible) {
        this.setState({modalVisible: visible});
    }

    renderInsideModal() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}> Records </Text>
                {this.renderTable()}

                <View style={{marginBottom: 10}}>
                    <TouchableHighlight onPress={() => {
                        this.toggleModal(!this.state.modalVisible);
                    }}>
                        <Text style={styles.title}> Close </Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        );
    }

    renderTable() {
        if(!this.state.modalVisible)
            return;
        let r = this.props.recObj;
        if(r==null)
            return;
        if(!r.isReady())
            return <Text> no records yet </Text>;
        let headers = ['Name', 'Score', 'Level', 'Date'];
        let recordsRows = r.getSortedArray();
        return (
            <View style={{
                //padding: 16,
                paddingTop: 30,
                backgroundColor: '#fff',
                marginBottom: 10,
                marginRight: 10
            }}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={headers} style={{height: 40, backgroundColor: '#f1f8ff'}} flexArr= {[1,1,1,2]}
                         textStyle={styles.text}/>
                    <Rows data={recordsRows} textStyle={styles.text} flexArr={[1,1,1,2]}/>
                </Table>
            </View>
        );
    }
}


export class Records {
    struct = {
        recordsArray: [],
        isReady: false,
    };
    constructor(){
        this.struct.recordsArray = [];
        //this.getRecordsArray();
    }
    addRecord(name, game) {
        let newName = this.clearName(name);
        let levelArray = game.getAvailableLevelsArray();
        let d = new Date();
        let date = d.getDate() + '/'+(d.getMonth()+1)+'/'+d.getFullYear();
        this.struct.recordsArray.push({
                name: newName,
                score: game.points,
                level: levelArray[game.level].label, //level: [0/1/2]
                date: date
            }
        );
        this.setRecordsArray();
    }

    async setRecordsArray() {
        try {
            await AsyncStorage.setItem('recordsArray', JSON.stringify(this.struct.recordsArray));
            this.struct.isReady = true;
            //alert('set '+JSON.stringify(struct.recordsArray));
        } catch (error) {
            //alert('set error');
        }
    }

    async getRecordsArray() { //retrieve recordsArray
        try {
            let value = await AsyncStorage.getItem('recordsArray');
            this.struct.recordsArray = JSON.parse(value);
            this.struct.isReady = true;
            //alert(struct.isReady);
        } catch (error) {
            //alert('get catch error');
            await this.setRecordsArray(); //save an empty array
        }
    }

    /*returns all records in format: [[name, score], ...] ordered by score*/
    getSortedArray() {
        let arr = [];
        //transform dictionaries to arrays:
        this.struct.recordsArray.forEach((dict) => {
            arr.push([dict.name, dict.score, dict.level, dict.date]);
        });
        //sort by score:
        arr.sort((rec1, rec2) => {
            return rec2[1] - rec1[1] //rec[1] = rec.score
        });                          //rec2-rec1 for descending order
        return arr;
    }
    clearName(name){
        let reg = new RegExp('[^a-zA-Z0-9א-ת _]', 'g'); //allowed characters
        return name.replace(reg, '');
    }
    isReady() {return this.struct.isReady}
}
const styles = StyleSheet.create ({
    container: {
        paddingTop:10,
        paddingLeft:10,
        paddingRight: 10,
        borderRadius:10,
        borderWidth: 1,
        marginLeft:10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    modal: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        //color: '',
        fontSize: 30,
        marginTop: 10
    },
    head: {
        fontSize: 20,
        //fontScale: 'bold'
    },
    text: {
        fontSize: 15,
        marginTop: 5,
        marginLeft:5
    },
    settingRow: {
        marginLeft: 10
    }

})