import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const customLogoutBtn = (props) => {
	return(
		<View>
			<TouchableOpacity
				onPress={props.clicked}
			>
				<Icon
					name='log-out'
					type='feather'
					color='#fff'
				/>
			</TouchableOpacity>
		</View>
	);
};

export default customLogoutBtn;