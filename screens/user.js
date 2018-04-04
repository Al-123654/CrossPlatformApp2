import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input, Form, Label, Thumbnail } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_USERS_FOLLOWED_URI = 'https://app-api-testing.herokuapp.com/api/users?followed=followed';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class UserScreen extends Component {
	constructor(props) {
		super(props);
		
        // call props.navigation.state.params here
        const { params } = this.props.navigation.state;

        //initialize states
        this.state = {
             passedUsername : props.navigation.state.params.data.username,
             fname : props.navigation.state.params.data.fname,
             lname : props.navigation.state.params.data.lname,
             email : props.navigation.state.params.data.email,
             passedId : props.navigation.state.params.data._id,
             images : props.navigation.state.params.data.images,
             followed : props.navigation.state.params.data.following,
             followImageHeading: [],
             followedImagesContainer: [],
			 followIDArray: [],
			 oneFollowMultiImageFlag: false
        }
        
        //check for number of follows and who
        console.log('[user js] Constructor - Number of followed users: ', this.state.followed.length);
        console.log('[user js] Constructor - Followed users list: ', this.state.followed);
	}

	componentDidMount(){
		console.log('[user js] componentDidMount - Number of following: ', this.state.followed.length);
		if(this.state.followed.length == 1){
			// ONE followed
			console.log('[user js] componentDidMount - One followed: ', this.state.followed);
			console.log('[user js] componentDidMount - One followed Contents: ', this.state.followed[0]);
			const followedId = this.state.followed[0];

			return fetch(GET_USERS_URI+followedId)
				.then(response => response.json())
				.then(response => {
					console.log('[user js] componentDidMount - fetch response: ', response);
					console.log('[user js] componentDidMount - fetch response images: ', response.images);
					console.log('[user js] componentDidMount - fetch response images length: ', response.images.length);

					if(response.images.length == 0){
						// zero images
						console.log('[user js] componentDidMount - fetch response images length: ZERO');
						let tempImageHeading = [( <Text key={response.username}>{response.username}</Text> )];
						let tempImageElement = [( <Text key={followingId}>No images available.</Text> )];
						this.setState({ 
							followImageHeading: [...tempImageHeading],
							followedImagesContainer: [...tempImageElement] 
						});
					}else if(response.images.length == 1){
						// one image
						console.log('[user js] componentDidMount - fetch response images length: ONE');
						const tempImageUri = GET_IMAGES_URI + response.images[0] + '/display';
						let tempImageHeading = [( <Text key={response.username}>{response.username}</Text> )];
						let tempImageElement = [( 
							<TouchableOpacity
								key={response.images[0]}
								style={styles.thumbnail}
								onPress={() => this.onImageClicked2(response.images[0], this.state.passedId)}
							>
								<Image
									key={response.images[0]}
									source={{uri:tempImageUri}}
									style={styles.thumbnail}
								/>
							</TouchableOpacity>
						)];
						this.setState({ 
							followImageHeading: [...tempImageHeading],
							followedImagesContainer: [...tempImageElement] 
						});
					}else if(response.images.length > 1){
						// multiple images
						console.log('[user js] componentDidMount - fetch response images length: MORE THAN ONE');
						// map
						let tempImageElement = response.images.map((imageId, index) => {
							let tempImageUri = GET_IMAGES_URI + imageId + '/display';
							return (
								<TouchableOpacity
									key={imageId + index}
									style={styles.thumbnail}
									onPress={() => this.onImageClicked2(imageId, this.state.passedId)}
								>
									<Image
										key={imageId}
										source={{uri:tempImageUri}}
										style={styles.thumbnail}
									/>
								</TouchableOpacity>
							);
						});
						this.setState({
							oneFollowMultiImageFlag: true, 
							followedImagesContainer: [...tempImageElement] 
						});
					}
				})
				.catch(error => console.log('[user js] componentDidMount - ONE followed fetch error: ', error));

		}else if(this.state.followed.length > 1){
			// MULTIPLE followed
			console.log('[user js] componentDidMount - Multiple followed: ', this.state.followed);
			return fetch(GET_USERS_FOLLOWED_URI)
				.then(response => response.json())
				.then(response => {
					console.log('[user js] componentDidMount - Multiple followed fetch response: ', response);

					let tempImageElements = [];
					// modify and then save response data to tempImagesArray
					let tempImagesArray = response.data.map((item, index) => {
						console.log('[user js] componentDidMount - MULTIPLE fetch map: ', item);
						console.log('[user js] componentDidMount - MULTIPLE fetch image arrays: ', item.images);
						console.log('[user js] componentDidMount - MULTIPLE fetch image arrays length: ', item.images.length);
	
						if(item.images.length <= 0){
							// TODO: logic for when followed user does not have images
						}else if(item.images.length >= 1){
							// followed user has multiple images
							// modify and then save each image to tempImageElements
							let tempImageElements = item.images.map((item,index) => {
								let tempImageUri =GET_IMAGES_URI + item + '/display';
								return (
									<TouchableOpacity
										key={item + index}
										style={styles.thumbnail}
										onPress={() => this.onImageClicked2(item, this.state.passedId)}
									>
										<Image
											key={item}
											source={{ uri: tempImageUri }}
											style={styles.thumbnail}
										/>
									</TouchableOpacity>
								);
							});

							console.log('[user js] componentDidMount - MULTIPLE fetch tempImageElements: ', tempImageElements);
							// return View element containing tempImageElements 
							return (
								<View style={styles.followedImagesOuter}
									key = {item._id}
								>
									<Text>{item._id}</Text>
									<View style={styles.followedImagesInner}>
										{[...tempImageElements]}
									</View>
									
								</View>
							);
						}
					});
					this.setState({
						followedImagesContainer: [...tempImagesArray]
					});
				})
				.catch(error => console.log('[user js] componentDidMount - Multiple followed fetch error: ', error));
		}
	}
	
	onLogoutHandler = () => {
        return fetch('https://app-api-testing.herokuapp.com/logout', {
        // return fetch('http://localhost:5000/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            
        })
            .then((response) => response.json())
            .then((responseJson) => {
                Alert.alert(
                    'Logging out',
                    "",
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Home');
                                console.log("[user js] LOGGED OUT!");

                            }
                        }
                    ]
                ) 
            })
            .catch ((error) => {
                console.log("[user js] onLogoutPressHandler: ", error);
            });
	}

	// when Explore btn is clicked
	onExplorePressedHandler = (currentUserId) => {
		console.log('[user js] onExplorePressedHandler clicked!');
		// this.props.navigation.navigate('User', data);
		console.log('[user js] ID passed by app js: ', currentUserId);
		this.props.navigation.navigate('Explore', {currentUserId:currentUserId});
	}

	onImagePickerHandler = () => {
        let imagePickerOptions = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
            }
        };

        ImagePicker.showImagePicker(imagePickerOptions, (response) => {

			console.log('[user js] Image Picker Response: ', response.fileSize);
			this.setState({log:''});
            if (response.didCancel) {
                console.log('[user js] User cancelled the picker.');
            } else if (response.error) {
                console.log('[user js] ImagePicker Error:', response.error);
            } else if (response.customButton) {
                console.log('[user js] User tapped custom button: ', response.customButton);
            } else {
                let source = { uri: response.uri };
                this.setState({
                    imageSource: source,
                    log: "Image chosen"
                });

                console.log('[user js] IMAGE CHOSEN: ', source);

                let platformPath = '';
                if (Platform.OS == 'ios') {
                    console.log("[user js] PATH OF IMAGE SELECTED IOS: ", response.uri);
                    platformPath = response.uri.replace(/^file?\:\/\//i, "");
                    console.log('[user js] SPECIAL CHARACTERS REMOVED: ', platformPath);
                } else if (Platform.OS == 'android') {
                    console.log("[user js] PATH OF IMAGE SELECTED ANDROID: ", response.path);
                    platformPath = response.path;
                }

                if (platformPath == '') {
                    return this.setState({
                        log: "Platform path empty"
                    });
                }
                console.log('[user js] TEST:',response.uri);
                console.log("[user js] PLATFORM PATH ",platformPath);
                
				RNFetchBlob.fetch('POST', 
					'https://app-api-testing.herokuapp.com/upload',
					// 'http://localhost:5000/upload',
					{},
					[
						{name:'sampleFile', filename:response.fileName, data:RNFetchBlob.wrap(platformPath)}
					])
				.then((res) => {
					// console.log('[user js] Response from server - ', res);
					console.log('[user js] Status code - ', res.respInfo.status);
					if(res.respInfo.status == 200){
						console.log('[user js] UPLOAD OK');
						this.setState({log: 'Upload ok!'});
					}else{
						console.log('[user js] UPLOAD FAILED - ', res);
						this.setState({log: 'Upload failed!'});
					}
				})
				.catch((err) => {
					console.log('[user js] showImagePicker: ', res);
				});
            }
        });
	}
	
	onImageClicked = (imageId,passedId) => {
        console.log("[user.js] onImageClicked: ", imageId );
        return fetch('https://app-api-testing.herokuapp.com/api/images/' + imageId, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then (response => response.json())
        .catch(error => console.error('Error: ', error))
        .then(response => {
            console.log('[user js] IMAGE DETAILS TRANSFER ', response)
            this.props.navigation.navigate('Image', {
                data: response,
                userId: passedId
            });
        });
	}

	onImageClicked2 = (imageId,passedId) => {
        
        return fetch('https://app-api-testing.herokuapp.com/api/images/' + imageId, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then (response => response.json())
        .catch(error => console.error('Error: ', error))
        .then(response => {
            this.props.navigation.navigate('Image', {
                data: response,
                following: passedId
            });
        });
	}

	render() {
        // console.log('[user js] render PICTURES: ', this.state.images);
        console.log('[user js] followedImagesContainer:', this.state.followedImagesContainer);
       
        let imageElement;
        let imageThumbnail;
        //check if user have images and display them
        if(typeof this.state.images != undefined && this.state.images != null && this.state.images.length != null && this.state.images.length > 0){
           console.log('[user js] render IN THE IF STATEMENT');
           console.log('[user js] render IF STATEMENT',(this.state.images != undefined || this.state.images.length == 0)); 
           // find out length of image array
            let imageCount = this.state.images.length;
		    console.log("[user js] render Image Count: ", imageCount);
		    // setup variable to contain Image element
            // let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
            // let imageUri = 'http://localhost:5000/api/images/';
            //if user has only one image
		    if(imageCount == 1){
                console.log("[user.js] render IMAGE ID", this.state.images);
                console.log("[user js] render IMAGE URI", GET_IMAGES_URI + this.state.images[0])
			    imageElement = (
                <TouchableOpacity
                    onPress={() => this.onImageClicked(this.state.images[0], this.state.passedId )}
                    style={styles.thumbnail}    
                >
                    <Image 
					    source={{uri: GET_IMAGES_URI + this.state.images[0] + '/display'}}
                        style={styles.thumbnail} 
                    />
                </TouchableOpacity>
                // <Thumbnail/>
                
                );
                
                
		    }else if(imageCount > 1 ){
			    imageElement = [];
			    imageElement = this.state.images.map((imageId, index) => {
				    return (
					    <TouchableOpacity
                            onPress={() => this.onImageClicked(imageId, this.state.passedId)}
                            key={imageId} 
                            style={styles.thumbnail}
                        >

                            <Image  
                                source={{ uri: GET_IMAGES_URI + imageId + '/display'}}
                                style={styles.thumbnail} 
                            />
					    </TouchableOpacity>
                    );
                    
			    });

		    }
        }else {
            // console.log("[user js] render IN THE ELSE STATEMENT");
            imageElement = (
				<Text>No images available.</Text>
			);
        }
		
        return (
        //     <View style={styles.page}>
		// 		<Header
		// 			centerComponent={{ text: this.state.passedUsername, style: { color: "#fff" } }}
		// 			rightComponent={<CustomLogoutBtn clicked={this.onLogoutHandler} />}
		// 			outerContainerStyles={styles.outerHeader}
		// 		/>

		// 		<View style={styles.body}>

		// 			<View style={styles.imagesContainer}>

		// 				<View style={styles.currentUserOuter}>
		// 					<Text>{this.state.passedUsername}</Text>
		// 					<View style={styles.currentUserInner}>
		// 						{imageElement}
		// 					</View>
		// 				</View>

		// 				<View style={ this.state.oneFollowMultiImageFlag ? styles.followedUsersOuterSingle : styles.followedUsersOuterMulti}>
		// 					{this.state.followedImagesContainer}
		// 				</View>

		// 			</View>

		// 			<View style={styles.buttonsContainer}>
		// 				<Button title="Image Picker" onPress={this.onImagePickerHandler} />
		// 				<Button title="Explore" onPress={()=>{this.onExplorePressedHandler(this.state.passedId)}} />
		// 				<Text>{this.state.log}</Text>
		// 			</View>

		// 		</View>
        //     </View>
        
        <Container>
            <Header>
                <Body><Title>{this.state.passedUsername}</Title></Body>
            </Header>
            <Content>
                <View>{imageElement}</View>
                {/* <Thumbnail square source={this.imageThumbnail}/> */}
                {/* <Thumbnail square source={this.state.followedImagesContainer}/> */}
                <Button onPress={this.onImagePickerHandler}>
                    <Text>Image Picker</Text>
                </Button>
                <Button onPress={this.onExplorePressedHandler}>
                    <Text>Explore</Text>
                </Button>
                <Text>{this.state.log}</Text>
            </Content>
        </Container>
        );
    }
}

const styles = StyleSheet.create({
	page: {
		width: window.width,
		height: window.height,
		flex: 1,
		flexDirection:'column',
		justifyContent: 'space-between'
	},
	outerHeader:{},
	body: {
		flex:1,
		// width:'100%',
		// height:'100%',
		flexDirection:'column',
		justifyContent: 'space-between'
	},
	imagesContainer: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		height: '100%'
	},
	currentUserOuter: {
		flex: 1,
		flexDirection:'column',
		width: '100%',
		height: '100%'
	},
	currentUserInner: {
		flexDirection:'row',
		flexWrap:'wrap'
	},
	buttonsContainer: {
		width: '100%',
		height: '100%',
		flex: 1
	},
	followedImagesOuter: {
		flex:1,
		flexDirection:'column'
	},
	followedImagesInner: {
		flex:1,
		flexDirection:'row',
		flexWrap:'wrap'
	},
	followedUsersOuterSingle: {
		flex:1,
		flexDirection: 'row'
	},
	followedUsersOuterMulti: {
		flex:1,
		flexDirection: 'column'
	},
	viewContainer: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
    pictures: {
        flex: 1, flexDirection: 'row',
        width: '80%',
        flexWrap:'wrap',
        justifyContent: 'center',
    },
    thumbnail: {
        width: 75,
        height: 75,
    }
});

module.exports = UserScreen;
