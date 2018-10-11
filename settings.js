import React, { Component } from 'react';
import {Modal, Text, TouchableHighlight, View, StyleSheet, Image} from 'react-native'
import PropTypes from 'prop-types';
import RadioForm from 'react-native-simple-radio-button';


export const radioLevels = [
    {label: 'easy  ', value: 0},
    {label: 'hard  ', value: 1},
    {label: 'extreme  ', value: 2}
];
const radioTime = [
    {label: '30  ', value: 30},
    {label: '45  ', value: 45},
    {label: '60  ', value: 60}
];

export default class ModalSettings extends Component {
    static propTypes = {
        onSave: PropTypes.func,
    };
    state = {
        modalVisible: false,
        level: 0,
        time: 30
    };

    render() {
        return (
            <View style={{alignItems: 'flex-start'}}>
                <Modal animationType = {"slide"} transparent = {false}
                       visible = {this.state.modalVisible}
                       onRequestClose = {() => {}}>
                    {this.renderInsideModal()}
                </Modal>
                <TouchableHighlight onPress = {()=> {this.toggleModal(true)}}>
                    <Image source={require('./menuIcons/settings.png')}/>
                </TouchableHighlight>
            </View>
        )
    }
    toggleModal(visible) {
        this.setState({ modalVisible: visible });
    }
    renderInsideModal() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}> Settings </Text>
                {this.renderLevelChoice()}
                {this.renderTimeChoice()}
                {this.getInstructions()}
                <TouchableHighlight onPress={() => {
                    this.toggleModal(!this.state.modalVisible)
                    this.props.onSave(this.state.level, this.state.time);
                }}>
                    <Text style={styles.title}> Save </Text>
                </TouchableHighlight>
            </View>
        );
    }
    renderLevelChoice() {
        return (
            <View style={styles.settingRow}>
                <Text style={styles.text}> Level: </Text>
                <RadioForm
                    radio_props={radioLevels}
                    initial={this.state.level}
                    formHorizontal={true}
                    onPress={(value) => {
                        let pervState = this.state;
                        pervState.level = value;
                        this.setState(pervState)
                    }}
                />
            </View>
        );
    }
    renderTimeChoice() {
        let defaultTime = (this.state.time - 30) / 15;
        return (
            <View style={styles.settingRow}>
                <Text style={styles.text}> Time Per round: </Text>
                <RadioForm
                    radio_props={radioTime}
                    initial={defaultTime}
                    formHorizontal={true}
                    onPress={(value) => {
                        let pervState = this.state;
                        pervState.time = value;
                        this.setState(pervState)
                    }}
                />
            </View>
        );
    }
    getInstructions(){
        return(
            <View style={styles.settingRow}>
                <Text style={styles.text}>Instructions:</Text>
                <View style={{flexDirection: 'row', marginLeft: 10}}>
                    <Text style={styles.text}>easy:</Text>
                    <Text style={styles.text}>numbers up to 50</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 10}}>
                    <Text style={styles.text}>hard:</Text>
                    <Text style={styles.text}>numbers up to 100</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 10}}>
                    <Text style={styles.text}>extreme:</Text>
                    <Text style={styles.text}>numbers up to 500</Text>
                </View>

            </View>
        );
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
        marginTop: 10
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
    text: {
        fontSize: 15,
        marginTop: 5,
        marginLeft:5
    },
    settingRow: {
        marginLeft: 15
    }

})