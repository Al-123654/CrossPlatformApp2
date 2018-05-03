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
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';
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
            favImagesArray:[],
            wishListArray:[],
            craveListArray:[],
            triedListArray:[],
        }
        console.log('States - UserId: ', this.state.userId);
        console.log('States - Fname: ', this.state.fname);
        console.log('States - Lname: ', this.state.lname);
        console.log('States - User Images: ', this.state.userImages);
        console.log('States - Username: ', this.state.username);
    }

    componentDidMount =() => {
        this.displayFollowed();
        this.displayFollowing();
        this.getFavImages();
        this.getCraveImages();
        this.getTriedImages();
        this.getWishImages();
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
                console.log('[user js] displayFollowed - respObj.username:', respObj[0].username)
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

   getFavImages = () => {
       return fetch(GET_USERS_URI + this.state.userId + '?fav=1', {
           method: 'GET',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
           }
       }).then(response => response.json())
        .then(response => {
            console.log('[user js] response from server:', response);

            let tempFav = [];
            response.favImages.forEach((image, index) => {
                console.log('[user js] To push images into array:', image._id)
                tempFav.push(image._id);
            })
            this.setState({ favImagesArray: [...tempFav] });
            console.log('[user js] favImageArray check:', this.state.favImagesArray);
           }).catch(error => console.error('Error:', error));
   }
   getWishImages = () => {
       return fetch(GET_USERS_URI + this.state.userId + '?wish=1', {
           method: 'GET',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
           }
       }).then(response => response.json())
        .then(response => {
            console.log('[user js] response from server:', response);

            let tempWish = [];
            response.wishImages.forEach((image, index) => {
                console.log('[user js] To push images into array:', image._id)
                tempWish.push(image._id);
            })
            this.setState({ wishListArray: [...tempWish] });
            console.log('[user js] WishImageArray check:', this.state.wishListArray);
           }).catch(error => console.error('Error:', error));
   }
   getCraveImages = () => {
       return fetch(GET_USERS_URI + this.state.userId + '?crave=1', {
           method: 'GET',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
           }
       }).then(response => response.json())
        .then(response => {
            console.log('[user js] response from server:', response);

            let tempCrave = [];
            response.craveImages.forEach((image, index) => {
                console.log('[user js] To push images into array:', image._id)
                tempCrave.push(image._id);
            })
            this.setState({ craveListArray: [...tempCrave] });
            console.log('[user js] craveImageArray check:', this.state.craveListArray);
           }).catch(error => console.error('Error:', error));
   }
   getTriedImages = () => {
       return fetch(GET_USERS_URI + this.state.userId + '?tried=1', {
           method: 'GET',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
           }
       }).then(response => response.json())
        .then(response => {
            console.log('[user js] response from server:', response);

            let tempTried = [];
            response.triedImages.forEach((image, index) => {
                console.log('[user js] To push images into array:', image._id)
                tempTried.push(image._id);
            })
            this.setState({ triedListArray: [...tempTried] });
            console.log('[user js] TriedImageArray check:', this.state.triedListArray);
           }).catch(error => console.error('Error:', error));
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
                        <Row>
                            <Label>Favorite Images</Label>
                        </Row>
                        <Row>
                            <Gallery
                                images={this.state.favImagesArray}
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                passedUserId={this.state.userId}
                            />
                        </Row>
                        <Row>
                            <Label>Wishlist Images</Label>
                        </Row>
                        <Row>
                            <Gallery
                                images={this.state.wishListArray}
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                passedUserId={this.state.userId}
                            />
                        </Row>
                        <Row>
                            <Label>Crave Images</Label>
                        </Row>
                        <Row>
                            <Gallery
                                images={this.state.craveListArray}
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                passedUserId={this.state.userId}
                            />
                        </Row>
                        <Row>
                            <Label>Tried Images</Label>
                        </Row>
                        <Row>
                            <Gallery
                                images={this.state.triedListArray}
                                clicked={this.onImageClicked}
                                longclick={this.onImageLongClick}
                                passedUserId={this.state.userId}
                            />
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