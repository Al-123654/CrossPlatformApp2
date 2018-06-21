import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem,
    Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

import Gallery from '../components/Gallery/Gallery';
import validator from 'validator';

const ALL_USER_URI = 'https://app-api-testing.herokuapp.com/api/users?followedList=1&userid='
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout'
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_FOLLOWED_BY = 'https://app-api-testing.herokuapp.com/api/users?usersFollowing=1&userid='
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class EditScreen extends Component{
    constructor (props){
        super(props);
        console.log('[editProfile js] constructor - passedParams: ', props.navigation.state.params);

        this.state ={
            userId: props.navigation.state.params.userId,
            fname: props.navigation.state.params.fname,
            lname: props.navigation.state.params.lname,
            userImages: props.navigation.state.params.userImages,
            username: props.navigation.state.params.username,
            logFname: "",
            logLname: "",
        }

        console.log('[editProfile js] State - userId: ', this.state.userId)
        console.log('[editProfile js] State - fname: ', this.state.fname)
        console.log('[editProfile js] State - lname: ', this.state.lname)
        console.log('[editProfile js] State - userImages: ', this.state.userImages)
        console.log('[editProfile js] State - username: ', this.state.username)


    };

    onChangedUsernameHandler = (username) => { if (username) this.setState({ username: username }); }
    onChangedPasswordHandler = (password) => { if (password) this.setState({ password: password }); }
    onChangedFnameHandler = (fname) => { if (fname) this.setState({ fname: fname }); }
    onChangedLnameHandler = (lname) => { if (lname) this.setState({ lname: lname }); }


    onBackBtnPressed = () => {
        console.log('[profile js] onBackBtnPressed');
        this.props.navigation.goBack();
    }

    onLogoutHandler = () => {

        Alert.alert(
            'Log out?',
            "",
            [
                {
                    text: 'OK', onPress: () => {
                        return fetch(LOGOUT_URI, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                Toast.show({
                                    text: 'Logout successful',
                                    buttonText: 'Ok',
                                    position: 'top',
                                    duration: 4000
                                })
                                // this.props.navigation.navigate('Home');
                                // console.log("[profile js] onLogoutPressHandler - LOGGED OUT");
                                console.log("[profile js] onLogoutPressHandler - LOGGING OUT!");
                                const resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            })
                            .catch((error) => {
                                console.error(error);
                            });

                    }
                },
                {
                    text: 'Cancel', onPress: () => {
                        style: 'cancel'
                    }
                }
            ]
        )

    }

    onChangesSave = () => {
        console.log('[editProfile js] onChangesSave button pressed')
        // if (!validator.isLength(this.state.username, { min: 5 })) {
        //     this.setState({
        //         logUsername: "Min: 5",
        //         disableButton: false,
        //         isLoggedIn: false
        //     });
        //     return;
        // }

        // if (!validator.isLength(this.state.password, { min: 5 })) {
        //     this.setState({
        //         logPassword: "Min: 5",
        //         disableButton: false,
        //         isLoggedIn: false
        //     });
        //     return;
        // }

        if (!validator.isAlpha(this.state.fname)) {
            this.setState({
                logFname: "Letters only",
                disableButton: false
            });
            return;
        }
        if (!validator.isLength(this.state.fname, { min: 2 })) {
            this.setState({
                logFname: "Too short",
                disableButton: false
            });
            return;
        }
        if (!validator.isAlpha(this.state.lname)) {
            this.setState({
                logLname: "Letters only",
                disableButton: false
            });
            return;
        }
        if (!validator.isLength(this.state.lname, { min: 2 })) {
            this.setState({
                logLname: "Too short",
                disableButton: false
            });
            return;
        }  

        return fetch(GET_USERS_URI, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                fname: this.state.fname,
                lname: this.state.lname
            }),
        }).then((response) => {
            console.log('[editProfile js] responseOnLogin: ', response);
            if (response.status !== 200) {

                console.log('[editProfile js] responseOnLogin bad response: ', response);
                // this.setState({log:"Cannot log in"})
                Toast.show({
                    text: 'Cannot save changes',
                    buttonText: 'Ok',
                    position: 'top',
                    duration: 4000
                });
                this.setState({
                    disableButton: false,
                    isLoggedIn: false
                });
                return;
            }
            response.json().then(data => {
                console.log('[editProfile js]  json response: ', data);
                console.log("[editProfile js] CHANGES SAVED");
                // go to feeds page
                Toast.show({
                    text: 'Changes saved successfully',
                    buttonText: 'Ok',
                    position: 'top',
                    duration: 4000
                });
                console.log('[editProfile js] Response', data);
                this.props.navigation.navigate('Feeds', data);
            });
        }).catch((error) => {
            console.log(error);
        });
    }
    
    render(){
        return(
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.onBackBtnPressed}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body><Title>Edit Profile</Title></Body>
                    <Right>
                        <Button transparent onPress={this.onLogoutHandler}>
                            <Icon name='home' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <Thumbnail large source={{ uri: GET_IMAGES_URI + this.state.userImages[0] + '/display' }} />
                    <Label>First Name</Label>
                    <Input
                        placeholder = {this.state.fname}
                        onChangeText={(text) => this.onChangedFnameHandler(text)}
                    />
                    {this.state.logFname.length > 0 ? (<Text style={styles.formLogText}>{this.state.logFname}</Text>) : null}
                    <Label>Last Name</Label>
                    <Input
                        placeholder={this.state.lname}
                        onChangeText={(text) => this.onChangedLnameHandler(text)}
                    />
                    {this.state.logLname.length > 0 ? (<Text style={styles.formLogText}>{this.state.logLname}</Text>) : null}  
                    <Label>Username</Label>
                    <Input
                        placeholder={this.state.username}
                        onChangeText={(text) => this.onChangedUsernameHandler(text)}
                    />
                    {/* <Label>Password</Label>
                    <Input
                        placeholder={this.state.password}
                        onChangeText={(text) => this.onChangedPasswordHandler(text)}
                        secureTextEntry={true}
                    /> */}
                    <Button bordered onPress = {this.onChangesSave}>
                        <Text>Save Changes</Text>
                    </Button>
                </Content>
                
            </Container>
        )
    };
}
const styles = StyleSheet.create({
    formMessages: {
        marginTop: 10,
        marginLeft: 10,
        flex: 1,
        flexDirection: 'column'
    },
    formLogText: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
        marginLeft: 18
    }
});
module.exports = EditScreen