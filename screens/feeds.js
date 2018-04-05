import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { 
	Container, Header, Left, Body, Right, Icon, 
	Title, Content, Text, Button, Item, Input, 
	Form, Label, Thumbnail, Footer, FooterTab 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_USERS_FOLLOWED_URI = 'https://app-api-testing.herokuapp.com/api/users?followed=followed';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class FeedsScreen extends Component {
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
			 oneFollowMultiImageFlag: false,
			 feedImagesArray: []
        }
        
        //check for number of follows and who
        console.log('[feeds js] Constructor - Number of followed users: ', this.state.followed.length);
        console.log('[feeds js] Constructor - Followed users list: ', this.state.followed);
	}

	componentDidMount(){
		console.log('[feeds js] componentDidMount - Number of following: ', this.state.followed.length);
		let tempFeedImagesArray = [];
		if(this.state.followed.length === 1){
			// ONE FOLLOWED
			console.log('[feeds js] componentDidMount - One followed: ', this.state.followed);
			console.log('[feeds js] componentDidMount - One followed Contents: ', this.state.followed[0]);
			const followedId = this.state.followed[0];

			return fetch(GET_USERS_URI+followedId)
			.then(response => response.json())
			.then(response => {
				console.log('[feeds js] componentDidMount - fetch response: ', response);
				console.log('[feeds js] componentDidMount - fetch response images: ', response.images);
				console.log('[feeds js] componentDidMount - fetch response images length: ', response.images.length);

				if(response.images.length >= 1){
					// save images
					tempFeedImagesArray = response.images.map((imageId, index) => {
						let tempImageUri = GET_IMAGES_URI + imageId + '/display';
						return (
							<Button 
								transparent style={styles.thumbnail} 
								onPress={() => this.onImageClicked(imageId, this.state.passedId)} 
								key={imageId} 
							>
								<Thumbnail
									large square source={{ uri: tempImageUri }}
								/>
							</Button>
						);
					});

					this.setState({
						feedImagesArray: [...tempFeedImagesArray]
					});
				}
			})
			.catch(error => console.log('[feeds js] componentDidMount - ONE followed fetch error: ', error));
		}else if(this.state.followed.length > 1){
			// MULTIPLE FOLLOWED
			console.log('[feeds js] componentDidMount - Multiple followed: ', this.state.followed);
			return fetch(GET_USERS_FOLLOWED_URI)
			.then(response => response.json())
			.then(response => {
				// save images
				// data: [ 
				// 	{ 
				// 		_id: '5ac5c7d8c86aad0004a44de6',
				// 		username: 'user_c',
				// 		images: [ 
				// 			'5ac5c7d8c86aad0004a44dec', 
				// 			'5ac5c7d8c86aad0004a44ded' 
				// 		] 
				// 	},
				// 	{ 
				// 		_id: '5ac5c7d8c86aad0004a44de7',
				// 		username: 'user_d',
				// 		images: [ 
				// 			'5ac5c7d8c86aad0004a44de9',
				// 			'5ac5c7d8c86aad0004a44dea',
				// 			'5ac5c7d8c86aad0004a44deb' 
				// 		] 
				// 	} 
				// ]
				console.log('[feeds js] componentDidMount - Multiple followed response: ', response);
				
				// let tempFeedImagesArray = response.data.map((item, index) => {
				// 	if(item.images.length >= 1){
				// 		item.images.forEach((imageId,index) => {
				// 			let tempImageUri = GET_IMAGES_URI + imageId + '/display';
				// 			return (
				// 				<Button 
				// 					transparent style={styles.thumbnail} 
				// 					onPress={() => this.onImageClicked(imageId, this.state.passedId)} 
				// 					key={imageId} 
				// 				>
				// 					<Thumbnail
				// 						large square source={{ uri: tempImageUri }}
				// 					/>
				// 				</Button>
				// 			);
				// 		});	
				// 	}		
				// });
				// loop through followed users
				let tempArray1 = [];
				response.data.forEach((followedUser,index) => {
					// check image array length
					if(followedUser.images.length >= 1){
						let tempArray2 = followedUser.images.map((imageId,index) => {
							let tempImageUri = GET_IMAGES_URI + imageId + '/display';
							return(
								<Button 
									transparent style={styles.thumbnail}
									onPress={() => this.onImageClicked(imageId, this.state.passedId)} 
									key={imageId} 
								>
									<Thumbnail
										large square source={{ uri: tempImageUri }}
									/>
								</Button>
							);
						});
						tempArray1 = [...tempArray1, ...tempArray2];
					}
				});
				this.setState({
					feedImagesArray: [...tempArray1]
				});
				console.log('[feeds js] componentDidMount - Multiple feedImagesArray: ', this.state.feedImagesArray);
			})
			.catch(error => console.log('[feeds js] componentDidMount - MULTIPLE followed fetch error: ', error));
		}
		// if(this.state.followed.length == 1){
		// 	// ONE followed
		// 	console.log('[feeds js] componentDidMount - One followed: ', this.state.followed);
		// 	console.log('[feeds js] componentDidMount - One followed Contents: ', this.state.followed[0]);
		// 	const followedId = this.state.followed[0];

		// 	return fetch(GET_USERS_URI+followedId)
		// 		.then(response => response.json())
		// 		.then(response => {
		// 			console.log('[feeds js] componentDidMount - fetch response: ', response);
		// 			console.log('[feeds js] componentDidMount - fetch response images: ', response.images);
		// 			console.log('[feeds js] componentDidMount - fetch response images length: ', response.images.length);

		// 			if(response.images.length == 0){
		// 				// zero images
		// 				console.log('[feeds js] componentDidMount - fetch response images length: ZERO');
		// 				let tempImageHeading = [( <Text key={response.username}>{response.username}</Text> )];
		// 				let tempImageElement = [( <Text key={followingId}>No images available.</Text> )];
		// 				this.setState({ 
		// 					followImageHeading: [...tempImageHeading],
		// 					followedImagesContainer: [...tempImageElement] 
		// 				});
		// 			}else if(response.images.length == 1){
		// 				// one image
		// 				console.log('[feeds js] componentDidMount - fetch response images length: ONE');
		// 				const tempImageUri = GET_IMAGES_URI + response.images[0] + '/display';
		// 				let tempImageHeading = [( <Text key={response.username}>{response.username}</Text> )];
		// 				let tempImageElement = [( 
		// 					// <TouchableOpacity
		// 					// 	key={response.images[0]}
		// 					// 	style={styles.thumbnail}
		// 					// 	onPress={() => this.onImageClicked2(response.images[0], this.state.passedId)}
		// 					// >
		// 					// 	<Image
		// 					// 		key={response.images[0]}
		// 					// 		source={{uri:tempImageUri}}
		// 					// 		style={styles.thumbnail}
		// 					// 	/>
		// 					// </TouchableOpacity>
		// 					<Button
		// 						transparent style={styles.thumbnail} 
		// 						onPress={() => this.onImageClicked(response.images[0], this.state.passedId)} 
		// 						key={response.images[0]} >
		// 						<Thumbnail
		// 							key={response.images[0]}
		// 							large square source={{ uri: tempImageUri}}
		// 						/>
		// 					</Button>
		// 				)];
		// 				this.setState({ 
		// 					followImageHeading: [...tempImageHeading],
		// 					followedImagesContainer: [...tempImageElement] 
		// 				});
		// 			}else if(response.images.length > 1){
		// 				// multiple images
		// 				console.log('[feeds js] componentDidMount - fetch response images length: MORE THAN ONE');
		// 				// map
		// 				let tempImageElement = response.images.map((imageId, index) => {
		// 					let tempImageUri = GET_IMAGES_URI + imageId + '/display';
		// 					return (
		// 						// <TouchableOpacity
		// 						// 	key={imageId + index}
		// 						// 	style={styles.thumbnail}
		// 						// 	onPress={() => this.onImageClicked2(imageId, this.state.passedId)}
		// 						// >
		// 						// 	<Image
		// 						// 		key={imageId}
		// 						// 		source={{uri:tempImageUri}}
		// 						// 		style={styles.thumbnail}
		// 						// 	/>
		// 						// </TouchableOpacity>
		// 						<Button 
		// 							transparent style={styles.thumbnail} 
		// 							onPress={() => this.onImageClicked(imageId, this.state.passedId)} 
		// 							key={imageId} 
		// 						>
		// 							<Thumbnail
		// 								large square source={{ uri: tempImageUri }}
		// 							/>
		// 						</Button>
		// 					);
		// 				});
		// 				this.setState({
		// 					oneFollowMultiImageFlag: true, 
		// 					followedImagesContainer: [...tempImageElement] 
		// 				});
		// 			}
		// 		})
		// 		.catch(error => console.log('[feeds js] componentDidMount - ONE followed fetch error: ', error));

		// }else if(this.state.followed.length > 1){
		// 	// MULTIPLE followed
		// 	console.log('[feeds js] componentDidMount - Multiple followed: ', this.state.followed);
		// 	return fetch(GET_USERS_FOLLOWED_URI)
		// 		.then(response => response.json())
		// 		.then(response => {
		// 			console.log('[feeds js] componentDidMount - Multiple followed fetch response: ', response);

		// 			let tempImageElements = [];
		// 			// modify and then save response data to tempImagesArray
		// 			let tempImagesArray = response.data.map((item, index) => {
		// 				console.log('[feeds js] componentDidMount - MULTIPLE fetch map: ', item);
		// 				console.log('[feeds js] componentDidMount - MULTIPLE fetch image arrays: ', item.images);
		// 				console.log('[feeds js] componentDidMount - MULTIPLE fetch image arrays length: ', item.images.length);
	
		// 				if(item.images.length <= 0){
		// 					// TODO: logic for when followed user does not have images
		// 				}else if(item.images.length >= 1){
		// 					// followed user has multiple images
		// 					// modify and then save each image to tempImageElements
		// 					let tempImageElements = item.images.map((item,index) => {
		// 						let tempImageUri =GET_IMAGES_URI + item + '/display';
		// 						return (
		// 							// <TouchableOpacity
		// 							// 	key={item + index}
		// 							// 	style={styles.thumbnail}
		// 							// 	onPress={() => this.onImageClicked2(item, this.state.passedId)}
		// 							// >
		// 							// 	<Image
		// 							// 		key={item}
		// 							// 		source={{ uri: tempImageUri }}
		// 							// 		style={styles.thumbnail}
		// 							// 	/>
		// 							// </TouchableOpacity>
		// 							<Button 
		// 								transparent style={styles.thumbnail}
		// 								key={item} 
		// 								onPress={() => this.onImageClicked(item, this.state.passedId)} 
		// 							>
		// 								<Thumbnail
		// 									key={item}
		// 									large square source={{ uri: tempImageUri }}
		// 								/>
										
		// 							</Button>
		// 						);
		// 					});

		// 					console.log('[feeds js] componentDidMount - MULTIPLE fetch tempImageElements: ', tempImageElements);
		// 					// return View element containing tempImageElements 
		// 					return (
		// 						<View style={styles.followedImagesOuter}
		// 							key = {item._id + index}
		// 						>
		// 							<Text>{item.username}</Text>
		// 							<View style={styles.followedImagesInner}>
		// 								{[...tempImageElements]}
		// 							</View>
									
		// 						</View>
		// 					);
		// 				}
		// 			});
		// 			this.setState({
		// 				followedImagesContainer: [...tempImagesArray]
		// 			});
		// 		})
		// 		.catch(error => console.log('[feeds js] componentDidMount - Multiple followed fetch error: ', error));
		// }
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
                                console.log("[feeds js] LOGGED OUT!");

                            }
                        }
                    ]
                ) 
            })
            .catch ((error) => {
                console.log("[feeds js] onLogoutPressHandler: ", error);
            });
	}

	// when Explore btn is clicked
	onExplorePressedHandler = (currentUserId) => {
		console.log('[feeds js] onExplorePressedHandler clicked!');
		// this.props.navigation.navigate('User', data);
		console.log('[feeds js] ID passed by app js: ', currentUserId);
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

			console.log('[feeds js] Image Picker Response: ', response.fileSize);
			this.setState({log:''});
            if (response.didCancel) {
                console.log('[feeds js] User cancelled the picker.');
            } else if (response.error) {
                console.log('[feeds js] ImagePicker Error:', response.error);
            } else if (response.customButton) {
                console.log('[feeds js] User tapped custom button: ', response.customButton);
            } else {
                let source = { uri: response.uri };
                this.setState({
                    imageSource: source,
                    log: "Image chosen"
                });

                console.log('[feeds js] IMAGE CHOSEN: ', source);

                let platformPath = '';
                if (Platform.OS == 'ios') {
                    console.log("[feeds js] PATH OF IMAGE SELECTED IOS: ", response.uri);
                    platformPath = response.uri.replace(/^file?\:\/\//i, "");
                    console.log('[feeds js] SPECIAL CHARACTERS REMOVED: ', platformPath);
                } else if (Platform.OS == 'android') {
                    console.log("[feeds js] PATH OF IMAGE SELECTED ANDROID: ", response.path);
                    platformPath = response.path;
                }

                if (platformPath == '') {
                    return this.setState({
                        log: "Platform path empty"
                    });
                }
                console.log('[feeds js] TEST:',response.uri);
                console.log("[feeds js] PLATFORM PATH ",platformPath);
                
				RNFetchBlob.fetch('POST', 
					'https://app-api-testing.herokuapp.com/upload',
					// 'http://localhost:5000/upload',
					{},
					[
						{name:'sampleFile', filename:response.fileName, data:RNFetchBlob.wrap(platformPath)}
					])
				.then((res) => {
					// console.log('[user js] Response from server - ', res);
					console.log('[feeds js] Status code - ', res.respInfo.status);
					if(res.respInfo.status == 200){
						console.log('[feeds js] UPLOAD OK');
						this.setState({log: 'Upload ok!'});
					}else{
						console.log('[feeds js] UPLOAD FAILED - ', res);
						this.setState({log: 'Upload failed!'});
					}
				})
				.catch((err) => {
					console.log('[feeds js] showImagePicker: ', res);
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
            console.log('[feeds js] IMAGE DETAILS TRANSFER ', response)
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
	onBackBtnPressed = () => {
		console.log('[feeds js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

	onProfilePressedHandler = () => {
		console.log('[feeds js] onProfilePressedHandler clicked!');
		
		this.props.navigation.navigate('Profile');
	}

	render() {
        // console.log('[user js] render PICTURES: ', this.state.images);
        console.log('[feeds js] followedImagesContainer:', this.state.followedImagesContainer);
       
        let imageElement;
        let imageThumbnail;
        //check if user have images and display them
        if(typeof this.state.images != undefined && this.state.images != null && this.state.images.length != null && this.state.images.length > 0){
           console.log('[feeds js] render IN THE IF STATEMENT');
           console.log('[feeds js] render IF STATEMENT',(this.state.images != undefined || this.state.images.length == 0)); 
           // find out length of image array
            let imageCount = this.state.images.length;
		    console.log("[feeds js] render Image Count: ", imageCount);
		    // setup variable to contain Image element
            // let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
            // let imageUri = 'http://localhost:5000/api/images/';
            //if user has only one image
		    if(imageCount == 1){
                console.log("[feeds js] render IMAGE ID", this.state.images);
                console.log("[feeds js] render IMAGE URI", GET_IMAGES_URI + this.state.images[0])
			    imageElement = (
                // <TouchableOpacity
                //     onPress={() => this.onImageClicked(this.state.images[0], this.state.passedId )}
                //     style={styles.thumbnail}    
                // >
                //     <Image 
				// 	    source={{uri: GET_IMAGES_URI + this.state.images[0] + '/display'}}
                //         style={styles.thumbnail} 
                //     />
                // </TouchableOpacity>
					<Button 
						transparent style={styles.thumbnail} 
						onPress={() => this.onImageClicked(this.state.images[0], this.state.passedId)} 
					>
						<Thumbnail
								large square  source={{ uri: GET_IMAGES_URI + this.state.images[0] + '/display' }}
						/> 
					</Button>
					
                
                );
                
                
		    }else if(imageCount > 1 ){
			    imageElement = [];
			    imageElement = this.state.images.map((imageId, index) => {
				    return (
					    // <TouchableOpacity
                        //     onPress={() => this.onImageClicked(imageId, this.state.passedId)}
                        //     key={imageId} 
                        //     style={styles.thumbnail}
                        // >

                        //     <Image  
                        //         source={{ uri: GET_IMAGES_URI + imageId + '/display'}}
                        //         style={styles.thumbnail} 
                        //     />
						// </TouchableOpacity>
						<Button 
							transparent style={styles.thumbnail} 
							onPress={() => this.onImageClicked(imageId, this.state.passedId)} 
							key={imageId} 
						>
							<Thumbnail 
									large square  source={{ uri: GET_IMAGES_URI + imageId + '/display' }} 
							/> 
						</Button>
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
				<Left>
					
				</Left>
                <Body><Title>{this.state.passedUsername}</Title></Body>
				<Right>
					<Button transparent onPress={this.onLogoutHandler}>
						<Icon name='home' />
					</Button>
				</Right>
            </Header>
            <Content>
				<Grid>
					<Text>USER IMAGES</Text>
					<Row>
						<View style={styles.imagesContainer}>
							{imageElement}
						</View>
					</Row>
					<Text>FOLLOWED IMAGES</Text>
					<Row>
						<View style={styles.imagesContainer}>
							{this.state.feedImagesArray}
						</View>
					</Row>
					<Row>
						<Text>{this.state.log}</Text>
					</Row>
				</Grid>
                
            </Content>
			<Footer>
				<FooterTab >
					<Button full onPress={this.onImagePickerHandler}>
						<Text>Image Picker</Text>
					</Button>
					<Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
						<Text>Explore</Text>
					</Button>
					<Button full onPress={() => { this.onProfilePressedHandler() }}>
						<Text>Profile</Text>
					</Button>
				</FooterTab>
			</Footer>
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
		width: '100%',
		height: '100%',
		flexDirection:'row',
		flexWrap:'wrap'
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
		width: 60,
		height: 60,
		flex: 1,
		flexDirection:'column'
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

module.exports = FeedsScreen;
