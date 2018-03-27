import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Header, Button} from 'react-native-elements';


class UserScreen extends Component {
    state = {
        username: "",
        fname: "",
        lname: "",
        email: "",
        _id: "",
        imageSource: "",
        log: "",
        followIDs: ""
        
    };

    constructor(props) {
        super(props); 
    }

    followID = () => {
        
        fetch('https://app-api-testing.herokuapp.com/api/users')
            .then(response => {
                console.log('[user js] fetchListofUsers response: ', response.following);
                if (response.status !== 200) {
                    console.log('[user js] fetchListofUsers bad response: ', response.following);
                    return;
                }
                response.json().then(data => {
                    console.log('[user js] fetchListofUsers json response: ', data);
                    this.setState({ followIDs: [...data] });
                    console.log('[user js] fetchListofUsers listOfUsers state: ', this.state.listOfUsers);
                });
            })
            .catch(err => console.log('[user js] fetchListofUsers error: ', err));

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

    onImageClicked = (imageId,) => {
        console.log("[user.js] onImageClicked: ", imageId );
        this.props.navigation.navigate('Image', {
            imageId: imageId,
        });

    }
  

    render() {
        const {params} = this.props.navigation.state;
        console.log('[user js] render PARAMS: ',params)
        const passedUsername = params ? params.data.username : null;
        const fname = params ? params.data.fname : null;
        const lname= params ? params.data.lname: null;
        const email = params ? params.data.email : null;
        const passedId = params ? params.data._id : null;
        const images = params ? params.data.images : null;
        const following = params ? params.data.following : null;

        
        // const likes = params ? params.likes : null;
        
        console.log('[user js] render PICTURES: ', images);
        // console.log('PICLENGTH',images.length);
        let imageElement;
        let followImageElement;
        let follows = following.length
        if(typeof images != undefined && images != null && images.length != null && images.length > 0){
           console.log('[user js] render IN THE IF STATEMENT');
           console.log('[user js] render IF STATEMENT',(images != undefined || images.length == 0)); 
           // find out length of image array
            let imageCount = images.length;
		    console.log("[user js] render Image Count: ", imageCount);
		    // setup variable to contain Image element
            let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
            // let imageUri = 'http://localhost:5000/api/images/';
		    if(imageCount == 1){
                console.log("[user.js] render IMAGE ID", images[0]);
                console.log("[user js] render IMAGE URI", imageUri + images[0])
			    imageElement = (
                <TouchableOpacity
                    onPress={() => this.onImageClicked(images[0] )}
                    style={styles.thumbnail}    
                >
                    <Image 
					    source={{uri: imageUri + images[0] + '/display'}}
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
                            onPress={() => this.onImageClicked(imageId)}
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
            console.log("[user js] FOLLOWS FOUND")
            this.followID();
            let followImageCount = images.length;
            let followImageUri = 'https://app-api-testing.herokuapp.com/api/images/';
            if (followImageCount == 1) {
                console.log("[user.js] render IMAGE ID", images[0]);
                console.log("[user js] render IMAGE URI", followImageUri + images[0])
                followImageElement = (
                    <TouchableOpacity
                        onPress={() => this.onImageClicked(images[0])}
                        style={styles.thumbnail}
                    >
                        <Image
                            source={{ uri: followImageUri + images[0] + '/display' }}
                            style={styles.thumbnail}
                        />
                    </TouchableOpacity>
                );
            } else if (followImageCount > 1) {
                followImageElement = [];
                followImageElement = images.map((imageId, index) => {
                    console.log("[user js] render TEST IMAGE ELEMENT");
                    console.log("[user.js] render ARGUMENT FOR MULTIPLE IMAGES: ", imageId);
                    console.log("[user js] render INDEX: ", index);
                    console.log("[user js] render FUNCTION: ", this.onImageClicked);

                    return (
                        <TouchableOpacity
                            onPress={() => this.onImageClicked(imageId)}
                            key={imageId}
                            style={styles.thumbnail}
                        >

                            <Image
                                source={{ uri: followImageUri + imageId + '/display' }}
                                style={styles.thumbnail}
                            />
                        </TouchableOpacity>
                    );
                });
            }
        }
		
        return (
            // <View style={styles.viewContainer}>
			// 	<View>
			// 		<Text>username: {JSON.stringify(passedUsername)}</Text>
			// 		<Text>FEEDS</Text>
			// 	</View>
					
			// 	<View style={styles.pictures}>
            //         {imageElement}
			// 	</View> 
				
            //     <Button title="Image Picker" onPress={this.onImagePickerHandler} />
            //     <Button title="Explore" onPress={()=>{this.onExplorePressedHandler(passedId)}} />
			// 	<Button title="Logout" onPress={this.onLogoutPressHandler} />

			// 	<Text>{this.state.log}</Text>
            // </View>

            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                {/* <View style={{ width: 50, height: 50,  }} />
				<View style={{ width: 50, height: 50, }} />
				<View style={{ width: 50, height: 50,  }} /> */}

                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: (passedUsername) , style: { color: "#fff" } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                />
                {/* <Text>username: {JSON.stringify(passedUsername)}</Text> */}
                <Text>FEEDS</Text>
                <View style= {styles.pictures}>
                    {imageElement}
                </View>
                <Text>Following: {JSON.stringify(following.username)}</Text>
                <View style= {styles.pictures}>
                    {followImageElement}
                </View>
                <Button title="Image Picker" onPress={this.onImagePickerHandler} />
                <Button title="Explore" onPress={()=>{this.onExplorePressedHandler(passedId)}} />
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
