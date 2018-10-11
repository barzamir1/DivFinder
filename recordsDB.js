//import SQLite from 'react-native-sqlite-storage'
import React, { Component } from 'react';
import {Text, TouchableHighlight, View, StyleSheet, ScrollView, Modal, Image} from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component';
import {Game} from './gameLogic'
import SQLite from 'react-native-sqlite-storage';


let db = SQLite.openDatabase({name: 'mydb.db', createFromLocation: '~mydb.db'},
    () => {
        console.log('opened DB')
    },
    (error) => {
        console.log("can't open DB: " + error.message)
    }
);

export default class ModalRecord extends Component {
    state = {
        modalVisible: false,
        recArr: [],
        isLoading: 0 //0 - not loaded, 1 - loading, 2 - loaded
    };

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    setTableNotLoaded() {
        this.setState({
            modalVisible: false,
            recArr: [],
            isLoading: 0
        });
    }
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
        );
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
        if (!this.state.modalVisible) //do nothing when modal is invisible
            return;

        switch (this.state.isLoading) {
            case 0: this.getSortedArray(); //get data from DB
            case 1: this.state.isLoading=1;//wait
                    return <Text> loading...</Text>;
            case 2: break; //render table
        }
        //this.state.isLoading = 2 - done loading
        let recArr = this.state.recArr;
        if (recArr.length == 0)
            return <Text> no records yet </Text>;

        let headers = ['Name', 'Score', 'Level', 'Date'];
        return (
            <View style={{
                //padding: 16,
                paddingTop: 30,
                backgroundColor: '#fff',
                marginBottom: 10,
                marginRight: 10
            }}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={headers} style={{height: 40, backgroundColor: '#f1f8ff'}} flexArr={[1, 1, 1, 2]}
                         textStyle={styles.text}/>
                    <Rows data={recArr} textStyle={styles.text} flexArr={[1, 1, 1, 2]}/>
                </Table>
            </View>
        );
    }

    /*insert new record to DB*/
    static addRecord(name, game) {
        //alert('DB access: addrecord');
        let newName = ModalRecord.clearName(name);
        let level = game.getAvailableLevelsArray()[game.level].label;
        let d = new Date();
        let dateStr = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

        db.transaction((tx) => {
            tx.executeSql('INSERT INTO Records (user_name, score, level, date) values(?,?,?,?)',
                [newName, game.points, level, dateStr],
                (error)=>{console.log('insert OK')}, (error)=>{console.log('insert error: '+error.message)});
        });
    }

    /*returns all records in format: [[name, score], ...] ordered by score*/
    getSortedArray() {
        //alert('DB access: getSorted');
        this.state.recArr = [];
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Records ORDER BY score DESC', [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {
                        let currRecord = results.rows.item(i);
                        this.state.recArr.push(
                            [currRecord.user_name, currRecord.score, currRecord.level, currRecord.date]
                        );
                    }

                    let newState = this.state;
                    newState.isLoading = 2; //done loading
                    this.setState(newState);
                }, (error) => console.log('select error: ' + error.message)
            );
        });
    }

    static clearName(name) {
        let reg = new RegExp('[^a-zA-Z0-9א-ת _]', 'g'); //allowed characters
        return name.replace(reg, '');
    }

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