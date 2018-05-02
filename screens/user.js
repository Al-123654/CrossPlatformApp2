import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem,
    Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Gallery from '../components/Gallery/Gallery';

const ALL_USER_URI = 'https://app-api-testing.herokuapp.com/api/users?followedList=1&userid='
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout'
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_FOLLOWED_BY = 'https://app-api-testing.herokuapp.com/api/users?usersFollowing=1&userid='
// const ALL_USER_URI = 'http://localhost:5000/api/users?followedList=1&userid='
// const LOGOUT_URI = 'http://localhost:5000/logout'
// const GET_USERS_URI = 'http://localhost:5000/api/users/';
// const GET_FOLLOWED_BY = 'http://localhost:5000/api/users?usersFollowing=1&userid='


class UserScreen extends Component{
    constructor(props){
        super(props);

        const { params } = this.props.navigation.state;
        console.log('constructor - params:', this.props.navigation.state);

        // INITIALIZE STATES
        this.state = {
            userId: props.navigation.state.params.userId,
            fname: props.navigation.state.params.fname,
            lname: props.navigation.state.params.lname,
            userImages: props.navigation.state.params.images,
            username:props.navigation.state.params.username,
            followedUsers: "",
            followingUsers:"",
            areImagesLoaded: false
        }
        console.log('States - UserId: ', this.state.userId);
        console.log('States - Fname: ', this.state.fname);
        console.log('States - Lname: ', this.state.lname);
        console.log('States - User Images: ', this.state.userImages);
        console.log('States - Username: ', this.state.username);
    }

    componentDidMount =() => {
        this.displayFollowedUsername();
        this.displayFollowingUsername();
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
                                
                                console.log("[user js] onLogoutPressHandler - LOGGING OUT!");
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
    onBackBtnPressed = () => {
        console.log('[user js] onBackBtnPressed');
        this.props.navigation.goBack();
    }

    displayFollowingUsername = () => {
        fetch(ALL_USER_URI + this.state.userId, {
            method:'GET',
            headers:{
                Accept:'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
           
            if (response.status !== 200) {
                Toast.show({
                    text: 'Search failed!',
                    buttonText: 'Ok',
                    position: 'top',
                    duration: 2000
                });
                return;
            }
            // if fetch ok
            response.json().then(respObj => {
                console.log('[user js] displayFollowingUsername - respObj:', respObj)
                console.log('[user js] displayFollowingUsername - respObj.data:', respObj.data)
                this.setState({
                    followingUsers: respObj.data
                })
                
            }).catch(error => console.error('Error: ', error));

        })
    }
    displayFollowedUsername = () => {
        fetch(GET_FOLLOWED_BY + this.state.userId, {
            method:'GET',
            headers:{
                Accept:'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
           
            if (response.status !== 200) {
                Toast.show({
                    text: 'Search failed!',
                    buttonText: 'Ok',
                    position: 'top',
                    duration: 2000
                });
                return;
            }
            // if fetch ok
            response.json().then(respObj => {
                console.log('[user js] displayFollowedUsername - respObj:', respObj)
                console.log('[user js] displayFollowedUsername - respObj.username:', respObj[0].username)
                this.setState({
                    followedUsers: respObj
                })
                
            }).catch(error => console.error('Error: ', error));

        })
    }


    onImageClicked = (imageId, passedId) => {
        console.log("[feeds js] onImageClicked - imageId: ", imageId);
        return fetch(GET_IMAGES_URI + imageId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log('[feeds js] onImageClicked - response from server: ', response);
                this.props.navigation.navigate({
                    key: 'Images1', routeName: 'Image', params: {
                        data: response,
                        userId: passedId,
                        userData: this.props.navigation.state.params,
                        imagesDisplayed: this.state.userImages
                    }
                })
            })
            .catch(error => console.error('Error: ', error));
    };

    onImageLongClick = () => {
        console.log('[user js] onImageLongClick!!')
    }
    render(){
        console.log('[user js] render - this.state.userImages.length: ', this.state.userImages.length);
        let gallery = (<Spinner />);
        let followedIDList = []; 
      

        
        return(
            <Container>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={this.onBackBtnPressed}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body><Title>{this.state.username}</Title></Body>
                    <Right>
                        <Button transparent onPress={this.onLogoutHandler}>
                            <Icon name='home' />
                        </Button>
                    </Right>
                </Header>
                <Container>
                    <Content>
                        <Row>
                            
                            <Label>First name</Label>
                       </Row>
                        <Row>
                            <Text>{this.state.fname}</Text>
                        </Row>
                        <Row>
                            <Label>Last name</Label>
                        </Row>
                        <Row>
                            <Text>{this.state.lname}</Text>
                        </Row>
                        <Row>
                            <Label>No. of Following</Label>
                        </Row>
                        <Row>
                            <Text>{this.state.followingUsers.length}</Text>
                         {/* {followedIDList} */}
                        </Row>
                        <Row>
                            <Label>No. of followed</Label>
                        </Row>
                        <Row>
                            <Text>{this.state.followedUsers.length}</Text>
                        </Row>
                        

                    </Content>

                </Container>
               
                
                <Footer>
                    {/* <FooterTab >
                        <Button full onPress={this.onFeedsPressedHandler()}>
                            <Icon name="camera" />
                            <Text>Feeds</Text>
                        </Button>
                        <Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
                            <Icon name="navigate" />
                            <Text>Explore</Text>
                        </Button>
                    </FooterTab> */}
                </Footer>
            </Container>
        );
    };

}

module.exports = UserScreen;