import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Button, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

class UserScreen extends Component {
    state = {
        username: "",
        fname: "",
        lname: "",
        email: "",
        _id: "",
        imageSource: "",
		log: "" 
    };

    constructor(props) {
        super(props); 
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
                                console.log("LOGGED OUT")

                            }
                        }
                    ]
                ) 
            })
            .catch ((error) => {
                console.error(error);
            });
    }

    onImagePickerHandler = () => {

        let imagePickerOptions = {
            title: 'Select Image',

            storageOptions: {
                skipBackup: true,


            }
        };

        ImagePicker.showImagePicker(imagePickerOptions, (response) => {

			console.log('Image Picker Response: ', response.fileSize);
			this.setState({log:''});
            if (response.didCancel) {
                console.log('User cancelled the picker.');
            } else if (response.error) {
                console.log('ImagePicker Error:', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = { uri: response.uri };
                this.setState({
                    imageSource: source,
                    log: "Image chosen"
                });

                console.log('IMAGE CHOSEN: ', source);

                let platformPath = '';
                if (Platform.OS == 'ios') {
                    console.log("PATH OF IMAGE SELECTED IOS: ", response.uri);
                    platformPath = response.uri.replace(/^file?\:\/\//i, "");
                    console.log('SPECIAL CHARACTERS REMOVED: ', platformPath);
                } else if (Platform.OS == 'android') {
                    console.log("PATH OF IMAGE SELECTED ANDROID: ", response.path);
                    platformPath = response.path;
                }

                if (platformPath == '') {
                    return this.setState({
                        log: "Platform path empty"
                    });
                }
                console.log('TEST:',response.uri);
                console.log("PLATFORM PATH ",platformPath);
                // save image
                // RNFetchBlob.fetch('POST', 'https://app-api-testing.herokuapp.com/upload', {
                // // RNFetchBlob.fetch('POST', 'http://localhost:5000/upload', {
                //     Authorization: 'application/json',
                //     'Content-Type': 'application/json'
                //     [
                //         {
                //             name: 'sampleFile', filename: response.fileName,
                //             data: RNFetchBlob.wrap(platformPath)
                //         }
                //     ]
                // }
                // ).then((res) => {
                //     console.log("TEST RESPONSE: " + res.text());
                //     this.setState({
                //         log: "Response from server",
                //         logDetails: "test" + res.text()
                //     });
                // }).catch((err) => {
                //     console.log("TEST ERROR: " + err);
                //     this.setState({
                //         log: "Error uploading",
                //         logDetails: err
                //     });
				// });
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
					console.log('[user js] Error response - ', res);
				});
               
            }
        });
    }

    onImageClicked = (imageId,) => {
        console.log("[user.js] IMAGE ID: ", imageId );
        this.props.navigation.navigate('ImagePage', {
            imageId: imageId,
        });

    }
  

    render() {
        const {params} = this.props.navigation.state;
        console.log('PARAMS',params)
        const username = params ? params.username : null;
        const fname = params ? params.fname : null;
        const lname= params ? params.lname: null;
        const email = params ? params.email : null;
        const _id = params ? params._id : null;
        const images = params ? params.images : null;
        // const likes = params ? params.likes : null;
        
        console.log('PICTURES', images);
        // console.log('PICLENGTH',images.length);
        let imageElement;
        if(typeof images != undefined && images != null && images.length != null && images.length > 0){
           console.log('IN THE IF STATEMENT');
           console.log('IF STATEMENT',(images != undefined || images.length == 0)); 
           // find out length of image array
            let imageCount = images.length;
		    console.log("Image Count: ", imageCount);
		    // setup variable to contain Image element
            let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
            // let imageUri = 'http://localhost:5000/api/images/';
		    if(imageCount == 1){
                console.log("[user.js] IMAGE ID", images[0]);
                console.log("IMAGE URI", imageUri + images[0])
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
				    console.log("TEST IMAGE ELEMENT");
				    console.log("[user.js]ARGRUMENT FOR MULTIPLE IMAGES: ", imageId);
				    console.log("INDEX: ", index);
				    console.log("FUNCTION: ", this.onImageClicked);

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
            console.log("IN THE ELSE STATEMENT")
            imageElement = 
                <View style={styles.viewContainer}>
                    <Text style={{justifyContent:'center', alignItems: 'center'}}>No images available
                    </Text>
                </View>}
		
		
		

        return (
            <View style={styles.viewContainer}>
				<View>
					<Text>username: {JSON.stringify(username)}</Text>
					<Text>FEEDS</Text>
				</View>
					
				<View style={styles.pictures}>
                    {imageElement}
				</View> 

                <Button title="Image Picker" onPress={this.onImagePickerHandler} />
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
