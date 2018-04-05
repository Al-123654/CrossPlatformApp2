import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigator, } from 'react-navigation';
// import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input, Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// import Tab1 from './tabOne';
// import Tab2 from './tabTwo';
// import Tab3 from './tabThree';
// import Tab4 from './tabFour';
// import Tab5 from './tabOne';
// import Tab6 from './tabOne';

class ProfileScreen extends Component{
    constructor(props) {
        super(props);
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
                        }
                    ]
                )
            })
            .catch((error) => {
                console.error(error);
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
                   <Body><Title>PROFILE</Title></Body>
                   <Right>
                       <Button transparent onPress={this.onLogoutHandler}>
                           <Icon name='home' />
                       </Button>
                   </Right>
               </Header>
               <Content>
                   <Text>Hello</Text>

               </Content>
               <Footer>
                   <FooterTab >
                       
                   </FooterTab>
               </Footer>
           </Container>
       );
   }
}

module.exports = ProfileScreen;