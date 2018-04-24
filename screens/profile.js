import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigator, } from 'react-navigation';
// import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input, 
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Favorite from './../components/Tabs/FavoriteTab';
import Wishlist from './../components/Tabs/WishlistTab';
import Cravelist from './../components/Tabs/CravelistTab.js';
import Triedlist from './../components/Tabs/TriedListTab';
// import Tab4 from './tabFour';
// import Tab5 from './tabOne';
// import Tab6 from './tabOne';
import Gallery from '../components/Gallery/Gallery';

// const LOGOUT_URI = 'http://localhost:5000/logout';
// const GET_IMAGES_URI = 'http://localhost:5000/api/images/';
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';


class ProfileScreen extends Component{
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        console.log('[profile js] constructor - passedParams: ', props.navigation.state.params);

        this.state={
            passedId: props.navigation.state.params.userId
        };
        console.log('[profile js] passedId:', this.state.passedId);
    }
    

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
                                this.props.navigation.navigate('Home');
                                console.log("[profile js] onLogoutPressHandler - LOGGED OUT");
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

    onFeedsPressedHandler = () => {
        
    }

    onExplorePressedHandler = (currentUserId) => {
        console.log('[profile js] onExplorePressedHandler clicked!');
        console.log('[profile js] ID passed by app js: ', currentUserId);
        this.props.navigation.navigate('Explore', { currentUserId: currentUserId });
    }

    onImageClicked = (imageId, passedId) => {
        console.log('[FavoriteTab js] imageId:', imageId)
        return fetch(GET_IMAGES_URI + imageId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }

        }).then(response => response.json())
            .then(response => {
                console.log('[FavoriteTab js] response from api:', response)
                this.props.navigation.navigate('Image', {
                    data: response,
                    userId: passedId
                });
            })
            .catch(error => console.error('Error: ', error));
        console.log('[profile js] onImageClicked')

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
                   {/* <Tab heading="Favorite"> */}

                   <Tab heading={
                       <TabHeading>
                           <Icon name="heart" />
                           {/* <Text>Favorite</Text> */}
                       </TabHeading>
                   }
                   >
                    <Favorite
                    clicked = {this.onImageClicked}
                    currentUserID = {this.state.passedId}
                    />
                   </Tab>
                   <Tab heading="Wishlist">
                       <Wishlist 
                           clicked={this.onImageClicked}
                           currentUserID={this.state.passedId}
                        />
                   </Tab>
                   <Tab heading="Cravelist">
                        <Cravelist
                            clicked={this.onImageClicked}
                            currentUserID = {this.state.passedId}
                        />
                    </Tab>
                   <Tab heading="Triedlist">
                        <Triedlist
                            clicked={this.onImageClicked}
                            currentUserID = {this.state.passedId}
                        />
                    </Tab>
               </Tabs>
               <Footer>
                   <FooterTab >
                       <Button full onPress={this.onFeedsPressedHandler()}>
                            <Icon name = "camera"/>
                           <Text>Feeds</Text>
                       </Button>
                       <Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
                           <Icon name ="navigate"/>
                           <Text>Explore</Text>
                       </Button>
                   </FooterTab>
               </Footer>
           </Container>
       );
   }
}

module.exports = ProfileScreen;