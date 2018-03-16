import React, { Component } from 'react';
import {   StyleSheet, View, Image, TouchableHighlight } from 'react-native'






const GalleryImage = ({ test }) => {
    // console.log('TEST:', test);
    return (
        <TouchableHighlight  >
            <View style={styles.imageContainer}>
                {/* <Image source={source} style={styles.images} /> */}

                
            </View>
        </TouchableHighlight>
    );

};


const styles = StyleSheet.create({

    imageContainer: {
        
    },
    images: {
        width: 75,
        height: 75,
    },

});


export default GalleryImage;