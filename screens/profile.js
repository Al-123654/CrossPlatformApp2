import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigator, } from 'react-navigation';
// import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input, Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Favorite from './../components/Tabs/FavoriteTab';
import TabTwo from './../components/Tabs/TabTwo';
// import Tab3 from './tabThree';
// import Tab4 from './tabFour';
// import Tab5 from './tabOne';
// import Tab6 from './tabOne';

class ProfileScreen extends Component{
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        console.log('[profile js] constructor - passedParams: ', props.navigation.state.params);

        // this.state={
        //     passedUsername: props.navigation.state.params.data.username,
        //     fname: props.navigation.state.params.data.fname,
        //     lname: props.navigation.state.params.data.lname,
        //     email: props.navigation.state.params.data.email,
        //     passedId: props.navigation.state.params.data._id,
        //     images: props.navigation.state.params.data.images,
        //     followed: props.navigation.state.params.data.following,
        //     followImageHeading: [],
        //     followedImagesContainer: [],
        //     followIDArray: [],
        //     oneFollowMultiImageFlag: false,
        //     feedImagesArray: [],
        //     areUserImagesLoading: true,
        //     areFollowedUsersImagesLoading: true,
        // }
    }
    

    onBackBtnPressed = () => {
        console.log('[profile js] onBackBtnPressed');
        this.props.navigation.goBack();
    }

    onLogoutHandler = () => {
        return fetch('https://app-api-testing.herokuapp.com/logout', {
            // return fetch('http://localhost:5000/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                Alert.alert(
                    'Logging out',
                    "",
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Home');
                                console.log("[profile js] onLogoutPressHandler - LOGGED OUT")
                            }
                        },
                        {
                            text: 'Cancel', onPress: () => {
                                style: 'cancel'
                            }
                        }
                    ]
                )
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onFeedsPressedHandler = () => {
        
    }

    onExplorePressedHandler = (currentUserId) => {
        console.log('[feeds js] onExplorePressedHandler clicked!');
        // this.props.navigation.navigate('User', data);
        console.log('[feeds js] ID passed by app js: ', currentUserId);
        this.props.navigation.navigate('Explore', { currentUserId: currentUserId });
    }

    
    render(){
       return(
           <Container>
               <Header hasTabs>
                   <Left>
                    <Button transparent onPress={this.onBackBtnPressed}>
                        <Icon name='arrow-back' />
                    </Button>
                   </Left>
                   <Body><Title>PROFILE</Title></Body>
                   <Right>
                       <Button transparent onPress={this.onLogoutHandler}>
                           <Icon name='home' />
                       </Button>
                   </Right>
               </Header>
               <Tabs initialPage={0}>
                   <Tab heading="Favorite">
                       <Favorite data = {this.props.navigation.state} />
                   </Tab>
                   <Tab heading="Tab2">
                       <TabTwo />
                   </Tab>
               </Tabs>
               <Footer>
                   <FooterTab >
                       <Button full onPress={this.onFeedsPressedHandler()}>
                           <Text>Feeds</Text>
                       </Button>
                       <Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
                           <Text>Explore</Text>
                       </Button>
                   </FooterTab>
               </Footer>
           </Container>
       );
   }
}

module.exports = ProfileScreen;