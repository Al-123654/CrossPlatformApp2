import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Header, Button} from 'react-native-elements';


class UserScreen extends Component {
    

    constructor(props) {
        super(props);
        // check if props.navigation.state.params exists
        const { params } = this.props.navigation.state;
        console.log('[user js] constructor: ', props.navigation.state.params)
        //setup image arrays here
        props.navigation.state.params.data.images.forEach(function () {
            
        });
        // this.followImages();

        //initialize states
        this.state = {
             passedUsername : props.navigation.state.params.data.username ,
             fname : props.navigation.state.params.data.fname ,
             lname : props.navigation.state.params.data.lname ,
             email : props.navigation.state.params.data.email ,
             passedId : props.navigation.state.params.data._id ,
             images : props.navigation.state.params.data.images ,
             following : props.navigation.state.params.data.following ,
             followImageElement: [],
        }
        console.log('[user js] state FOLLOWS:', this.state.following.length)
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
                following: passedId
            });
        });
    }

    //get images of followed users
    followImages = () => {
        //check if following can be called here
        console.log('[user js] THIS.STATE.FOLLOWING', this.state.following);
        //use following to get followedUserUri
        let followedUserUri = 'https://app-api-testing.herokuapp.com/api/users/';
        
        console.log('[user js] FOLLOW URI:', followedUserUri + '/');
        let followID;
        fetch(followedUserUri + this.state.following, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(res => {
            console.log('[user js] RES.JSON ', res);
            console.log('[user js] RES.IMAGE: ', res.images);
            followImageID = res.images;
            console.log('[user js] RES.IMAGES.LENGTH ', followImageID.length);
            noOfFollows = followImageID.length;
            console.log('[user js] NO OF FOLLOWS: ', noOfFollows);
            const followImageUri2 = 'https://app-api-testing.herokuapp.com/api/images/'
            if(noOfFollows== 1){
                console.log("[user.js] render FOLLOW IMAGE ID", followImageID[0]);
                console.log("[user js] render FOLLOW IMAGE URI", followImageUri2 + followImageID[0])
                this.setState({
                    followImageElement : (
                        <TouchableOpacity
                            onPress={() => this.onImageClicked2(followImageID[0], this.state.passedId)}
                            style={styles.thumbnail}
                        >
                            <Image
                                source={{ uri: followImageUri2 + followImageID[0] + '/display' }}
                                style={styles.thumbnail}
                            />
                        </TouchableOpacity>
                    )
                });
               console.log('[user js] FOLLOW IMAGE ELEMENT IN FOLLOW ID()', this.state.followImageElement);
            }
            if(noOfFollows > 1){
                followImageArray = [];
                
                this.setState({
                    followImageElement : (
                        followImageArray = followImageID.map((imageId, index) => {
                            console.log("[user.js] FOLLOWIMAGES() ARGUMENT FOR MULTIPLE IMAGES: ", imageId);
                            return (
                                <TouchableOpacity
                                    onPress={() => this.onImageClicked2(imageId, this.state.passedId)}
                                    key={imageId}
                                    style={styles.thumbnail}
                                >
                                    <Image
                                        source={{ uri: followImageUri2 + imageId + '/display' }}
                                        style={styles.thumbnail}
                                    />
                                </TouchableOpacity>
                            );

                        })
                    )
                });
            }
        })
        .catch((error) =>{
            console.log('ERROR' ,error);
        })
    }
  

    render() {
        // check for images
        console.log('[user js] render PICTURES: ', this.state.images);
        // console.log('PICLENGTH',images.length);
        let imageElement;
        // let followImageElement;
        let follows = this.state.following.length
        
        if(typeof this.state.images != undefined && this.state.images != null && this.state.images.length != null && this.state.images.length > 0){
           console.log('[user js] render IN THE IF STATEMENT');
           console.log('[user js] render IF STATEMENT',(this.state.images != undefined || this.state.images.length == 0)); 
           // find out length of image array
            let imageCount = this.state.images.length;
		    console.log("[user js] render Image Count: ", imageCount);
		    // setup variable to contain Image element
            let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
            // let imageUri = 'http://localhost:5000/api/images/';
		    if(imageCount == 1){
                console.log("[user.js] render IMAGE ID", this.state.images);
                console.log("[user js] render IMAGE URI", imageUri + this.state.images[0])
			    imageElement = (
                <TouchableOpacity
                    onPress={() => this.onImageClicked(this.state.images[0], this.state.passedId )}
                    style={styles.thumbnail}    
                >
                    <Image 
					    source={{uri: imageUri + this.state.images[0] + '/display'}}
                        style={styles.thumbnail} 
                    />
                </TouchableOpacity>
                );
                
		    }else if(imageCount > 1 ){
			    imageElement = [];
			    imageElement = images.map((imageId, index) => {
				    console.log("[user js] render TEST IMAGE ELEMENT");
				    console.log("[user.js] render ARGUMENT FOR MULTIPLE IMAGES: ", imageId);
				    console.log("[user js] render INDEX: ", index);
				    console.log("[user js] render FUNCTION: ", this.onImageClicked);

				    return (
					    <TouchableOpacity
                            onPress={() => this.onImageClicked(imageId, this.state.passedId)}
                            key={imageId} 
                            style={styles.thumbnail}
                        >

                            <Image  
                                source={{ uri: imageUri + imageId + '/display'}}
                                style={styles.thumbnail} 
                            />
					    </TouchableOpacity>
				    );
			    });

		    }
        }else {
            console.log("[user js] render IN THE ELSE STATEMENT");
            imageElement = (
				<View style={styles.viewContainer}>
                    <Text style={{justifyContent:'center', alignItems: 'center'}}>No images available
                    </Text>
				</View>
			);
        }
    

        if(follows > 0){
            this.followImages();

        }
		
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
                <Text>Following: {JSON.stringify(this.state.following)}</Text>
                <View style= {styles.pictures}>
                    {console.log('[user js] FOLLOW IMAGE ELEMENT ' ,this.state.followImageElement)}
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
