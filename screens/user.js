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
            fname: '',
            lname: '',
            userImages: props.navigation.state.params.images,
            username:props.navigation.state.params.username,
            followedUsers: "",
            followingUsers:"",
            areImagesLoaded: false,
            previousId: props.navigation.state.params.previousId,// ID of actual user if accessing from explore page
            profilePicture: props.navigation.state.params.profile_pic,
            response: ""
           
        }
        console.log('[user js]States - UserId: ', this.state.userId);
        console.log('[user js]States - User Images: ', this.state.userImages);
        console.log('[user js]States - Username: ', this.state.username);
        console.log('[user js]States - previousId: ', this.state.previousId);
    }

    componentDidMount =() => {
        this.displayFollowed();
        this.displayFollowing();
        this.fetchFnameLname();
    }

    fetchFnameLname = () => {
        fetch(GET_USERS_URI + this.state.userId,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
            .then(response => {
            console.log('[user js] fetchFnameLname - response: ', response)
            this.setState({
                response: response,
                fname: response.fname,
                lname: response.lname
            })
        })
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
                                    duration: 3000
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

    /**
     * Return to previous route 
     */

    onBackBtnPressed = () => {
       
        console.log('[user js] onBackBtnPressed - this.state: ', this.state)
       
        this.props.navigation.goBack();
       
    }
    
    /**
     * Get number of users followed
     */

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
    

    /**
     * get number of followers
     */
    
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


    onImageClicked = (imageId, passedId) => {
        let navigation = this.props.navigation;
        console.log('[user js] onImageClicked - navigation: ', navigation);
        console.log("[user js] onImageClicked - imageId: ", imageId);
        console.log("[user js] onImageClicked - passedId: ", passedId);
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
                    key: 'Food1', routeName: 'Food', params: {
                        data: response,
                        userId: this.props.navigation.state.params._id,
                        userData: this.props.navigation.state.params,
                        imagesDisplayed: this.state.userImages
                    }
                })
                console.log('[user js] onImageClicked - navigation after navigation: ', navigation);
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

    onFeedsPressHandler = () => {
        return fetch(GET_USERS_URI + this.state.userId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log('[user js] onFeedsPressHandler - response from server: ', response);
                this.props.navigation.navigate({
                    key: 'Feeds1', routeName: 'Feeds', params: {
                        data: response,
                    }
                })
                // console.log('[user js] onFeedsPressHandler - navigation after navigation: ', navigation);
            })
            .catch(error => console.error('Error: ', error));

    }

    onExplorePressedHandler = (currentUserId) => {
        console.log('[feeds js] onExplorePressedHandler - clicked!');
        console.log('[feeds js] onExplorePressedHandler - ID passed by app js: ', currentUserId);
        this.props.navigation.navigate({
            key: 'Explore1', routeName: 'Explore', params: {
                currentUserId: currentUserId
            }
        });
    };

    render(){
     

        let canEdit;

        //if user clicks on profile button 
        // and not accessing through explore page display Edit Profile button
        if(this.state.previousId === undefined){
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
        console.log('[user js] render - this.onImageClicked: ', this.onImageClicked)

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
                        <Icon fontSize="36" name="ios-contact-outline" />{/*Placeholder for profile image*/}
                        <View style = {{flex: 1,alignItems: 'flex-end'}}> 
                            <Text>{this.state.userImages.length}</Text>
                            <Label> Posts</Label>
                        </View>
                        <View style = {{flex: 1,alignItems: 'flex-end'}}> 
                            <Text>{this.state.followingUsers.length}</Text>
                            <Label> Following</Label>
                        </View>
                        <View style = {{flex: 1,alignItems: 'flex-end'}}> 
                            <Text>{this.state.followedUsers.length}</Text>
                            <Label> Followers</Label> 
                        </View>
                        
                    </Row>
                    <Row>
                        <View style={{ marginTop: 10, marginLeft: 20 }}>
                            <Text>{this.state.fname} {this.state.lname}</Text> 
                        </View>
                    </Row>
                    <Row>
                        <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'flex-end' }}>
                            {canEdit}
                        </View>
                        
                    </Row>
                    <Tabs style = {{marginTop: 30}} initialPage={0}>
                        <Tab heading={
                            <TabHeading>
                                <Icon name="heart" /> 
                            </TabHeading>
                        }>
                        {/* Pass data/functions into tabs */}
                            <Favorite
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                        <Tab heading={
                            <TabHeading>
                                <Icon
                                    name={"ios-color-wand-outline"}
                                />
                            </TabHeading>
                        }>
                            <Wishlist
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                         
                         <Tab heading={
                            <TabHeading>
                                <Icon
                                    name={"ios-checkmark-circle-outline"}
                                />
                            </TabHeading>
                        }>
                            <Triedlist
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                        <Tab heading={
                            <TabHeading>
                                <Icon
                                    name={"ios-happy-outline"}
                                />
                            </TabHeading>
                        }>
                            <Cravelist
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                currentUserID={this.state.userId}
                            />
                        </Tab>
                    </Tabs> 
                </Content>
                <Footer>
                    <FooterTab>
                        <Button  onPress={this.onFeedsPressHandler}>
                            <Icon name='pizza' />
                            <Text>Feeds</Text>
                        </Button>
                        <Button  onPress={() => { this.onExplorePressedHandler(this.state.userId) }}>
                            <Icon name="navigate" />
                            <Text>Explore</Text>
                        </Button>
                    </FooterTab>
                </Footer>
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