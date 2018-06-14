import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { createStackNavigator, NavigationActions, StackActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem,
    Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

import Gallery from '../components/Gallery/Gallery';

import Favorite from './../components/Tabs/FavoriteTab';
import Wishlist from './../components/Tabs/WishlistTab';
import Cravelist from './../components/Tabs/CravelistTab.js';
import Triedlist from './../components/Tabs/TriedListTab';

const ALL_USER_URI = 'https://app-api-testing.herokuapp.com/api/users?followedList=1&userid='
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout'
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_FOLLOWED_BY = 'https://app-api-testing.herokuapp.com/api/users?usersFollowing=1&userid='
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';
// const GET_IMAGES_URI = 'http://localhost:5000/api/images/';
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
            areImagesLoaded: false,
            originalId: props.navigation.state.params.previousId,
            profilePicture: props.navigation.state.params.profile_pic
            // favImagesArray:[],
            // wishListArray:[],
            // craveListArray:[],
            // triedListArray:[],
        }
        console.log('[user js]States - UserId: ', this.state.userId);
        console.log('[user js]States - Fname: ', this.state.fname);
        console.log('[user js]States - Lname: ', this.state.lname);
        console.log('[user js]States - User Images: ', this.state.userImages);
        console.log('[user js]States - Username: ', this.state.username);
        console.log('[user js]States - originalId: ', this.state.originalId);
    }

    componentDidMount =() => {
        this.displayFollowed();
        this.displayFollowing();
        // this.getFavImages();
        // this.getCraveImages();
        // this.getTriedImages();
        // this.getWishImages();
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
                                const resetAction = StackActions.reset({
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
    // get following
    displayFollowing = () => {
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
                console.log('[user js] displayFollowing - respObj:', respObj)
                console.log('[user js] displayFollowing - respObj.data:', respObj.data)
                this.setState({
                    followingUsers: respObj.data
                })
                
            }).catch(error => console.error('Error: ', error));

        })
    }
    // get followed
    displayFollowed = () => {
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
                console.log('[user js] displayFollowed - respObj:', respObj)
                
                this.setState({
                    followedUsers: respObj
                })
                
            }).catch(error => console.error('Error: ', error));

        })
    }


    onImageClicked = (imageId) => {
        console.log("[user js] onImageClicked - imageId: ", imageId);
        return fetch(GET_IMAGES_URI + imageId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log('[user js] onImageClicked - response from server: ', response);
                this.props.navigation.navigate({
                    key: 'Images1', routeName: 'Image', params: {
                        data: response,
                        userId: this.props.navigation.state.params._id,
                        userData: this.props.navigation.state.params,
                        imagesDisplayed: this.state.userImages
                    }
                })
            })
            .catch(error => console.error('Error: ', error));
    };

    onImageLongClick = (imageId, passedId) => {
        console.log('[user js] onImageLongClick!!')
    }



    _renderItem({ item, index }, parallaxProps) {
        console.log('[user js] _renderItem - item', item)
        // console.log('[user js] _renderItem - this.state.userId', this.state.userId)
        return (
            <View style={styles.item}>  
                <TouchableOpacity onPress={() => this.onImageClicked(item)}>
                {/* <TouchableOpacity onPress={() => console.log("[user js] _renderItem - Clicked carousel item!")}> */}
                    <ParallaxImage
                        source={{ uri: GET_IMAGES_URI + item + '/display' }}
                        containerStyle={styles.imageContainer}
                        style={styles.image}
                        parallaxFactor={0.2}
                        {...parallaxProps} />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={2}>
                    {item.username}
                </Text>
            </View>
        );
        console.log('[user js] _renderItem -  item :', item)
    }
    onEditPressedHandler = (currentUserId, fname, lname, username, userImages) => {
        console.log('[profile js] onEditPressedHandler pressed')
        console.log('[user js] onEditPressedHandler - items carried over: ', currentUserId, fname, lname, username, userImages)
        this.props.navigation.navigate('EditProfile', { 
            currentUserId: currentUserId,
            fname: fname,
            lname: lname,
            username: username,
            userImages: userImages
        })
    }

    render(){
     

        let canEdit;

        if(this.state.originalId == undefined){
            canEdit = (
                    <Button bordered small onPress={() => {
                        this.onEditPressedHandler(this.state.userId, this.state.fname,
                            this.state.lname, this.state.username, this.state.userImages)
                    }}>
                        <Text>Edit Profile</Text>
                    </Button>
            )
        }else{
            canEdit = (
                <Text></Text>
            )
        }

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
                <Content>
                    <Row style={{ marginTop: 20, marginLeft: 40}}>
                        {/* <Thumbnail style = {{marginLeft:20}} large source={{ uri: GET_IMAGES_URI + this.state.profilePicture + '/display' }} /> */}
                        <Icon fontSize="36" name="ios-contact-outline" />
                        <View style={{flex: 1, alignItems: 'center'}}> 
                            <Text>{this.state.userImages.length}</Text>
                            <Label> Posts</Label>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}> 
                            <Text>{this.state.followingUsers.length}</Text>
                            <Label> Following</Label>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}> 
                            <Text>{this.state.followedUsers.length}</Text>
                            <Label> Followers</Label> 
                        </View>
                        
                    </Row>
                    <Row>
                        <View style={{ marginTop: 20, marginLeft: 20 }}>
                            <Text>{this.state.fname} {this.state.lname}</Text>
                            
                        </View>
                        <View style={{ marginLeft: 100, marginTop:15 }}>
                            {canEdit}
                        </View>
                        
                    </Row>
                    <Tabs style = {{marginTop: 30}} initialPage={0}>
                        <Tab heading={
                            <TabHeading>
                                <Icon name="heart" />

                            </TabHeading>
                        }>
                            <Favorite
                                clicked={this.onImageClicked}
                                longclick={this.onFavLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                        <Tab heading="Wishlist">
                            <Wishlist
                                clicked={this.onImageClicked}
                                longclick={this.onWishLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                        <Tab heading="Cravelist">
                            <Cravelist
                                clicked={this.onImageClicked}
                                longclick={this.onCraveLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                        <Tab heading="Triedlist">
                            <Triedlist
                                clicked={this.onImageClicked}
                                longclick={this.onTriedLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                    </Tabs> 
                </Content>
            </Container>
        );
    };

}
const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 250,
        flex: 1,
        position: 'relative'
    },
    
})

module.exports = UserScreen;