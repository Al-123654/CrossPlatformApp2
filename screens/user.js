import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const ALL_USER_URI = 'https://app-api-testing.herokuapp.com/api/users?followedList=1&userid='
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout'
;


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
            images: props.navigation.state.params.images,
            username:props.navigation.state.params.username,
            following:props.navigation.state.params.following,
            followedUsers:""
        }
        console.log('States - UserId: ', this.state.userId);
        console.log('States - Fname: ', this.state.fname);
        console.log('States - Lname: ', this.state.lname);
        console.log('States - Images: ', this.state.images);
        console.log('States - Username: ', this.state.username);
        console.log('States - Following: ', this.state.following);
    }

    componentDidMount =() => {
        this.displayFollowedUsername();
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

    displayFollowedUsername = () => {
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
                console.log('[user js] displayFollowedUsername - respObj:', respObj)
                console.log('[user js] displayFollowedUsername - respObj.data:', respObj.data)
                // this.setState({
                //     following: respObj.data
                // });
                // console.log('[user js] displayFollowedUsername - respObj.data[0].username:', respObj.data[0].username)
                // for(a = 0; a < respObj.data.length; a++){
                //     console.log('[user js] displayFollowedUsername - respObj(array): ', respObj.data[a].username)
                //     this.setState({
                //         following:respObj.data[a].username
                //     })
                // }
                this.setState({
                    followedUsers: respObj.data
                })
                
            })

        })
    }

    render(){
        let followedIDList = [];
        // console.log("[user js] render - this.state.following: ", this.state.following);
        console.log('[user js] render - followedUsers: ', this.state.followedUsers);
        
        if(this.state.followedUsers.length > 1){
            followedIDList = this.state.followedUsers.map(followed => {
                // console.log(followedId);
                return (<ListItem key={followed._id}>
                    <Body>
                        <Text style={{ fontWeight: 'bold', fontSize: 13 }}> {followed.username}</Text>
                    </Body>
                </ListItem>
                )
                console.log('[user js] followedIDList: ', followedIDList);
            })
        }else{
            followedIDList = <Text>{this.state.following}</Text>
        }
        
        
        // console.log('[user js] render - followedIDlist:', followedIDList);
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
                            <Label>Following</Label>
                        </Row>
                        <Row>
                            {/* <Text>{this.state.following}</Text> */}
                         {followedIDList}
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