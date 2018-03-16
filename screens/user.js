import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Button, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';

import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';

import GalleryImage from './../components/ImageComponent';




class UserScreen extends Component {

    
    constructor(props) {
        super(props);
    }
    state = {
        message: ""
    };

    onUploadPressHandler = () =>{
        RNFetchBlob
        .config({
            fileCache : true,
        })
        .fetch('GET', 'https://via.placeholder.com/200x150', {

        })
        .then((res) => {
            console.log('The file saved to ', res.path());
            test = res.path();
            console.log("PATH to FILE: " + test);

            RNFetchBlob.fetch('POST', 'https://app-api-testing.herokuapp.com/upload', {
                'Content-Type': 'multipart/form-data',
            }, [
                    { name: 'sampleFile', filename: 'file.png', type: 'image/png', data: RNFetchBlob.wrap(test)},
            ]).then((resp) => {
                console.log("TEST RESPONSE" + resp.text());
                this.setState({
                    message: resp.text()
                });
            }).catch((err) => {
                console.log("TEST ERROR: " + err);
                this.setState({
                    message: "ERROR"
                });
            });
        });
    }

    onLogoutPressHandler = () => {
        return fetch('https://app-api-testing.herokuapp.com/logout', {
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

            console.log('Image Picker Response: ', response);
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

                // save image
                RNFetchBlob.fetch('POST', 'https://app-api-testing.herokuapp.com/upload',
                    { 'Content-Type': 'multipart/form-data' },
                    [
                        {
                            name: 'sampleFile', filename: response.fileName,
                            // type: response.type, data: RNFetchBlob.wrap(response.path)
                            data: RNFetchBlob.wrap(platformPath)
                        }
                    ]
                ).then((res) => {
                    console.log("TEST RESPONSE: " + res.text());
                    this.setState({
                        log: "Response from server",
                        logDetails: "test" + res.text()
                    });
                }).catch((err) => {
                    console.log("TEST ERROR: " + err);
                    this.setState({
                        log: "Error uploading",
                        logDetails: err
                    });
                });
            }
        });
    }

    onImageClicked = () => {
        console.log("IMAGE CLICKED" );

    }
    onImageClicked2 = (index) => {
        console.log("IMAGE CLICKED 2: ", index );

    }
    
    render() {
        const {params} = this.props.navigation.state;
        const username = params ? params.username : null;
        const fname = params ? params.fname : null;
        const lname= params ? params.lname: null;
        const email = params ? params.email : null;
        const _id = params ? params._id : null;
        const images = params ? params.images : null;
        console.log('PICTURES', images);
		console.log('PICLENGTH',images.length);
		
		// find out length of image array
		let imageCount = images.length;
		console.log("Image Count: ", imageCount);

		// setup variable to contain Image element
		let imageElement;
		let imageUri = 'https://app-api-testing.herokuapp.com/api/users/' + _id + '/images/';
		if(imageCount == 1){
            // console.log("ON CLICK SINGLE", this.onImageClicked);
			imageElement = (
                <TouchableOpacity
                    onPress={this.onImageClicked} 
                >
                <Image 
					source={{uri: imageUri + images}}
                    style={styles.thumbnail} 
                    
                    />
                
                </TouchableOpacity>
			);
		}else if(imageCount > 1 ){
			imageElement = [];
			imageElement = images.map((image, index) => {
				console.log("TEST IMAGE ELEMENT");
				console.log("IMAGE: ", image);
				console.log("INDEX: ", index);
				console.log("FUNCTION: ", this.onImageClicked2);

				return (
					<TouchableOpacity
						onPress={() => this.onImageClicked2(image)}
						key={image} >

						<Image  
							source={{uri: imageUri + image}}
							style={styles.thumbnail} 
						/>
					</TouchableOpacity>
				);
			});
            // imageElement = [];
			// images.forEach(function(image, index){
            //     console.log("IMAGES", image);
            //     console.log("INDEX", index);
			// 	imageElement.push(
                    
            //         <TouchableOpacity
            //             onPress={this.onImageClicked2}
            //             key={index}                         
            //         >
                        
			// 		<Image  
			// 			source={{uri: imageUri + image}}
			// 			style={styles.thumbnail} 
            //         />
                    
                    
            //         </TouchableOpacity>
                    
                   

			// 	);
			// }); 
		}

        return (
            <View style={styles.viewContainer}>
				<View>
					<Text>username: {JSON.stringify(username)}</Text>
					<Text>FEEDS</Text>
                 {/* <Text>fname: {JSON.stringify(fname)}</Text>
                    <Text>lname: {JSON.stringify(lname)}</Text>
                    <Text>email: { JSON.stringify(email) }</Text >
                    <Text>id: { JSON.stringify(_id) }</Text > */}
				
				</View>
					
				<View style={styles.pictures}>
                    {imageElement}
				</View> 

				<Button title="Upload" onPress={this.onUploadPressHandler} />
                <Button title="Image Picker" onPress={this.onImagePickerHandler} />
				<Button title="Logout" onPress={this.onLogoutPressHandler} />
                
				
                <Text>{this.state.message}</Text>
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
// export default ImageGallery;