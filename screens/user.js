import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Header, Button} from 'react-native-elements';

const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_USERS_FOLLOWED_URI = 'https://app-api-testing.herokuapp.com/api/users?followed=followed';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class UserScreen extends Component {
    

    constructor(props) {
        super(props);
        // call props.navigation.state.params here
        const { params } = this.props.navigation.state;
        //setup image arrays here
        props.navigation.state.params.data.images.forEach(function () {
            
        });

        //initialize states
        this.state = {
             passedUsername : props.navigation.state.params.data.username ,
             fname : props.navigation.state.params.data.fname ,
             lname : props.navigation.state.params.data.lname ,
             email : props.navigation.state.params.data.email ,
             passedId : props.navigation.state.params.data._id ,
             images : props.navigation.state.params.data.images ,
             following : props.navigation.state.params.data.following ,
             followImageHeading: [],
             followImageElement: [],
             followedUsername: "",
			 FOLLOWS : props.navigation.state.params.data.following.length,
			 hasMultipleFollowing: false,
             followIDArray: [],
        }
        
        //check for number of follows and who
        console.log('[user js] NUMBER OF FOLLOWS', this.state.FOLLOWS)
        console.log('[user js] FOLLOWSs:', this.state.following);

    }

    componentDidMount(){

		// check if one or more following
			// if one following
				// if no images
					// notify user
				// if one image
					// display the image
				// if multiple images
					// lop through images and display them
			// if multiple following
				// loop through following
					// for each following
						// if no images
							//notify user
						// if one image
							// display the image
						// if multiple images
							// loop through images and display them

		console.log('[user js] componentDidMount - Number of following: ', this.state.following.length);
		// check for no of following
		if(this.state.following.length == 1){
			// ONE following
			console.log('[user js] componentDidMount - One Following: ', this.state.following);
			console.log('[user js] componentDidMount - One Following Contents: ', this.state.following[0]);
			const followingId = this.state.following[0];

			// fetch images from following id
			return fetch( GET_USERS_URI + followingId )
			.then(response => response.json())
			.then(response => {
				console.log('[user js] componentDidMount - fetch response: ', response);
				console.log('[user js] componentDidMount - fetch response images: ', response.images);
				console.log('[user js] componentDidMount - fetch response images length: ', response.images.length);
				if(response.images.length == 0){
					// ZERO images
					console.log('[user js] componentDidMount - fetch response images length is: ', response.images.length);
					let tempImageHeading = [( <Text key={response.username}>{response.username}</Text> )];
					let tempImageElement = [( <Text key={followingId}>No images available.</Text> )];
					this.setState({ 
						followImageHeading: [...tempImageHeading],
						followImageElement: [...tempImageElement] 
					});
				}else if(response.images.length == 1){
					// ONE image
					console.log('[user js] componentDidMount - fetch response images length is: ', response.images.length);
					const tempImageUri = GET_IMAGES_URI + response.images[0] + '/display';
					let tempImageHeading = [( <Text key={response.username}>{response.username}</Text> )];
					let tempImageElement = [( 
						<TouchableOpacity
							key={response.images[0]}
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
						followImageElement: [...tempImageElement] 
					});
				}else if(response.images.length > 1){
					// MULTIPLE images
					console.log('[user js] componentDidMount - fetch response images length is: ', response.images.length);
					let tempImageHeading = [( <Text key={response.username}>{response.username}</Text> )];
					// map
					let tempImageElement = response.images.map((imageId, index) => {
						let tempImageUri = GET_IMAGES_URI + imageId + '/display';
						return (
							<TouchableOpacity
								key={imageId + index}
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
						followImageHeading: [...tempImageHeading], 
						followImageElement: [...tempImageElement] 
					});
				}
			})
			.catch(error => console.log('[user js] componentDidMount - ONE fetch error: ', error));

		}else if(this.state.following.length > 1){
			// MULTIPLE following
			console.log('[user js] componentDidMount - Multiple Following: ', this.state.following);
			this.setState({ hasMultipleFollowing: true });
			
			fetch(GET_USERS_FOLLOWED_URI)
			.then(response => response.json())
			.then(response => {
				console.log('[user js] componentDidMount - MULTIPLE fetch response: ', response);
				let tempImageElement = response.data.map((item, index) => {
                    console.log('[user js] componentDidMount - MULTIPLE fetch map: ', item);
                    console.log('[user js] componentDidMount - MULTIPLE fetch image arrays: ', item.images);
                   let tempImageUri =GET_IMAGES_URI + item.images + '/display';
                   console.log('[user js] tempImageUri when followed users > 1:', tempImageUri)
                    return (
                        <TouchableOpacity
                            key={item.images + index}
                            onPress={() => this.onImageClicked2(item.images, this.state.passedId)}
                        >
                            <Image
                                key={item.images}
                                source={{ uri: tempImageUri }}
                                style={styles.thumbnail}
                            />
                        </TouchableOpacity>
                    );
                });
                this.setState({
                    followImageElement: [...tempImageElement]
                });
			})
			.catch(error => console.log('[user js] componentDidMount - MULTIPLE fetch error: ', error));

			
			
			
			// this.state.following.forEach((followingId,index) => {
			// 	fetch( GET_USERS_URI + followingId )
			// 	.then( response => response.json() )
			// 	.then( response => {
			// 		console.log('[user js] START============================>', index);
			// 		console.log('[user js] componentDidMount - MULTIPLE fetch response for: ', followingId);
			// 		console.log('[user js] componentDidMount - MULTIPLE fetch response: ', response);
			// 		console.log('[user js] componentDidMount - MULTIPLE fetch response images: ', response.images);
			// 		console.log('[user js] componentDidMount - MULTIPLE fetch response images length: ', response.images.length);
			// 		console.log('[user js] END==============================>', index);

			// 		tempImageArray.push(
			// 			{
			// 				followingId: followingId,
			// 				imageIds: response.images
			// 			}
			// 		);
			// 	})
			// 	.catch(error => console.log('[user js] componentDidMount - MULTIPLE fetch error: ', error));
			// });
		}

        // old code
        // let followIDArray = [];
        // let followImageUri = "";
        // this.state.following.forEach((followedID) => {
        //     //get followed users data
        //     console.log('[user js] FOLLOWEDID IN COMPONENTDIDMOUNT:', followedID);
        //     fetch('https://app-api-testing.herokuapp.com/api/users/' + followedID, {
        //         method: 'GET',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //     }).then(res => res.json())
        //         .then(res => {
        //             console.log('[user js] RESPONSE AT COMPONENT DID MOUNT', res);
        //             let followedImageID = res.images;
        //             console.log('[user js] FOLLOWEDIMAGEID AT COMPONENTDIDMOUNT', followedImageID);
        //             //push the followed users data into array
        //             followIDArray.push({
        //                 followedID: followedID,
        //                 images: followedImageID,
        //             });
        //             this.setState({ followIDArray: [...followIDArray] });
        //             console.log('[user js] FOLLOWIDARRAY', this.state.followIDArray);
        //             console.log('[user js] COMPONENT DID MOUNT FOLLOWIDARRAY.LENGTH', this.state.followIDArray.length);
        //             console.log('[user js] COMPONENT DID MOUNT FOLLOWIDARRAY.LENGTH IS TRUE', this.state.followIDArray.length == 1);
        //             if(this.state.followIDArray.length == 1){
        //                 //route for single followed user

        //                 //check for multiple images
        //                 console.log('[user js] FETCH FOLLOWIDARRAY[]', this.state.followIDArray[0].images.length);
        //                 if(this.state.followIDArray[0].images.length ==1){
        //                     console.log('[user js] FETCH IF 1 FOLLOW ONE IMAGE')
        //                     // console.log('[user js] FOLLOWIDARRAY IMAGES', this.state.followIDArray[0].images);
        //                     followImageUri = this.state.IMAGEURI + this.state.followIDArray[0].images + '/display';
        //                     // console.log('[user js] FOLLOWIMAGEURI AT COMPONENT:', followImageUri);
        //                     this.setState({
        //                         followImageElement: (
        //                             <TouchableOpacity
        //                                 onPress={() => this.onImageClicked2(followedImageID, this.state.passedId)}
        //                                 style={styles.thumbnail}
        //                             >
        //                                 <Image
        //                                     source={{ uri: followImageUri }}
        //                                     style={styles.thumbnail}
        //                                 />

        //                             </TouchableOpacity>
        //                             // <Text>followImageElement Test</Text>
        //                         )
        //                     });
        //                 }else if(this.state.followIDArray[0].images.length > 1){
        //                     console.log('[user js] FETCH IF 1 FOLLOW MULTIPLE IMAGES');
        //                     followImageArray = [];
        //                     this.setState({
        //                         followImageElement: (
        //                             followImageArray = this.state.followIDArray[0].images.map((imageId, index) => {
        //                                 // console.log('[user js] IMAGE ID AT COMPONENT: ', imageId);
        //                                 // console.log('[user js] FOLLOW IMAGE ID: ', followImageID);
        //                                 followImageUri = this.state.IMAGEURI + imageId+ '/display';
        //                                 // console.log('[user js] FOLLOWIMAGEURI if more than one image for one followed user', followImageUri)
        //                                 return (
        //                                     <TouchableOpacity
        //                                         onPress={() => this.onImageClicked2(imageId, this.state.passedId)}
        //                                         key={imageId}
        //                                         style={styles.thumbnail}
        //                                     >
        //                                         <Image
        //                                             source={{ uri: followImageUri }}
        //                                             style={styles.thumbnail}
        //                                         />
        //                                     </TouchableOpacity>
        //                                 );

        //                             })
        //                         )
        //                     });
        //                 }
                      
        //             }else if (this.state.followIDArray.length > 1){
                        
        //                 //route for more than one followed user
        //                 this.state.followIDArray.forEach((followMulti, index) => {
        //                     if(this.state.followIDArray[index].image.length == 1){
        //                         console.log('[user js] IF MULTIPLE FOLLOWED USERS AND ONE IMAGE')
        //                         console.log('[user js] FOLLOWIDARRAY IMAGES', this.state.followIDArray[index].images);
        //                         followImageUri = this.state.IMAGEURI + this.state.followIDArray[index].images + '/display';
        //                         console.log('[user js] FOLLOWIMAGEURI AT COMPONENT:', followImageUri);
                                
        //                         this.setState({
        //                             followImageElement: (
        //                                 <TouchableOpacity
        //                                     onPress={() => this.onImageClicked2(followedImageID, this.state.passedId)}
        //                                     style={styles.thumbnail}
        //                                 >
        //                                     <Image
        //                                         source={{ uri: followImageUri }}
        //                                         style={styles.thumbnail}
        //                                     />

        //                                 </TouchableOpacity>
        //                                 // <Text>followImageElement Test</Text>
        //                             )
        //                         });
        //                     } else if (this.state.followIDArray[index].image.length > 1) {
        //                         console.log('[user js] IF MULTIPLE FOLLOWED USERS AND MULTIPLE IMAGES')
        //                         followImageArray = [];
        //                         this.setState({
        //                             followImageElement: (
        //                                 followImageArray = this.state.followIDArray[index].images.map((imageId, index) => {
        //                                     // console.log('[user js] IMAGE ID AT COMPONENT: ', imageId);
        //                                     // console.log('[user js] FOLLOW IMAGE ID: ', followImageID);
        //                                     followImageUri = this.state.IMAGEURI + imageId + '/display';
        //                                     console.log('[user js] FOLLOWIMAGEURI if more than one image for one followed user', followImageUri)
        //                                     return (
        //                                         <TouchableOpacity
        //                                             onPress={() => this.onImageClicked2(imageId, this.state.passedId)}
        //                                             key={imageId}
        //                                             style={styles.thumbnail}
        //                                         >
        //                                             <Image
        //                                                 source={{ uri: followImageUri }}
        //                                                 style={styles.thumbnail}
        //                                             />
        //                                         </TouchableOpacity>
        //                                     );

        //                                 })
        //                             )
        //                         });
        //                     }
        //                 })//TODO push data into array and set state


        //             }
                    
                    

        //         }).catch((error) => {
        //             console.log('[user js] COMPONENTDIDMOUNT ERROR', error)
        //         })
        // });
    }

    

    onLogoutPressHandler = () => {
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
	};

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

    //get images of followed users
    // followImages = () => {
    //     // console.log('[user js] state FOLLOWS:', FOLLOWS)
    //     // console.log('[user js] FOLLOWS > 1? TEST ', FOLLOWS > 1)
        
    //     let followedUserUri = 'https://app-api-testing.herokuapp.com/api/users/';
    //     let followedUserID;//ID of followed users
    //     followedUserID = this.state.following;
    //     //fetch images of followed users from api
    //     // console.log('[user js] THIS.STATE.FOLLOWING', followedUserUri + followedUserID)
    //     //if only one user followed
    //     if (this.state.FOLLOWS == 1){
    //         // get details of followed Users from api
    //         fetch(followedUserUri + followedUserID, {
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json'
    //             }
    //         }).then(res => res.json())
    //             .then(res => {
    //                 this.setState({ followedUsername: res.username })
    //                 // console.log('[user js]  FOLLOWED USERNAMES: ', this.state.followedUsername)
    //                 // console.log('[user js] RES.IMAGE: ', res.images);
    //                 followImageID = res.images;//ID of images of followed users
                    
    //                 noOfFollows = followImageID.length;
                    
    //                 // console.log('[user js] NO OF FOLLOWS: ', noOfFollows);
    //                 const followImageUri2 = 'https://app-api-testing.herokuapp.com/api/images/'
    //                 //if followed user only has one image
    //                 if (noOfFollows == 1) {
    //                     // console.log("[user.js] render FOLLOW IMAGE ID", followImageID[0]);
    //                     // console.log("[user js] render FOLLOW IMAGE URI", followImageUri2 + followImageID[0])
    //                     this.setState({
    //                         followImageElement: (
    //                             <TouchableOpacity
    //                                 onPress={() => this.onImageClicked2(followImageID[0], this.state.passedId)}
    //                                 style={styles.thumbnail}
    //                             >
    //                                 <Image
    //                                     source={{ uri: followImageUri2 + followImageID[0] + '/display' }}
    //                                     style={styles.thumbnail}
    //                                 />
    //                             </TouchableOpacity>
    //                         )
    //                     });
    //                     // console.log('[user js] FOLLOW IMAGE ELEMENT IN FOLLOW ID()', this.state.followImageElement);
    //                 }
    //                 //if followed user more than one image
    //                 if (noOfFollows > 1) {
    //                     followImageArray = [];

    //                     this.setState({
    //                         followImageElement: (
    //                             followImageArray = followImageID.map((imageId, index) => {
    //                                 // console.log('[user js] IMAGE ID: ', imageId);
    //                                 // console.log('[user js] FOLLOW IMAGE ID: ', followImageID);
    //                                 return (
    //                                     <TouchableOpacity
    //                                         onPress={() => this.onImageClicked2(imageId, this.state.passedId)}
    //                                         key={imageId}
    //                                         style={styles.thumbnail}
    //                                     >
    //                                         <Image
    //                                             source={{ uri: followImageUri2 + imageId + '/display' }}
    //                                             style={styles.thumbnail}
    //                                         />
    //                                     </TouchableOpacity>
    //                                 );

    //                             })
    //                         )
    //                     });
    //                 }


    //             })
    //             .catch((error) => {
    //                 console.log('ERROR', error);
    //             })
    //     }
    //     //if more than one user followed
    //     if (this.state.FOLLOWS > 1){
    //         console.log('[user js] MORE THAN ONE FOLLOW:', this.state.following);
         
    //     }
    // }
  

    render() {
        // console.log('[user js] render PICTURES: ', this.state.images);
        console.log('[user js] render ID OF FOLLOWED IMAGES:', this.state.followIDArray)
        console.log('[user js] FOLLOWIMAGEELEMENT:', this.state.followImageElement)
       
        
        
        let imageElement;
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
				<View style={styles.viewContainer}>
                    <Text style={{justifyContent:'center', alignItems: 'center'}}>No images available
                    </Text>
				</View>
			);
        }
    

        // if(this.state.FOLLOWS > 0){
        //     this.followImages();
        // }
		
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>

                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: (this.state.passedUsername) , style: { color: "#fff" } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                />
                {/* <Text>username: {JSON.stringify(passedUsername)}</Text> */}
                <Text>FEEDS</Text>
                <View style= {styles.pictures}>
                    {imageElement}
                </View>
                <Text>Following: {JSON.stringify(this.state.followedUsername)}</Text>
                <View style= {styles.pictures}>
                    {this.state.followImageHeading}
                    {this.state.followImageElement}
                </View>
                
                <Button title="Image Picker" onPress={this.onImagePickerHandler} />
                <Button title="Explore" onPress={()=>{this.onExplorePressedHandler(this.state.passedId)}} />
                <Button title="Logout" onPress={this.onLogoutPressHandler} />
                <Text>{this.state.log}</Text>
                
            </View>

           
        );
    }
}



const styles = StyleSheet.create({
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
