import React from 'react';
import {connect} from 'react-redux';
import { Text, View, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

function ChatScreen(props) { 
    return (
        <View>
            <Text style={{textAlign: 'center', marginTop: 50, marginBottom: 20}}>POI List</Text>
            <ScrollView>
                {
                    props.POIListToDisplay.map((POI, i) => (
                        <ListItem 
                            key={i}
                            //leftAvatar={{ source: { uri: l.avatar_url } }}
                            title={POI.title}
                            subtitle={POI.description}
                            rightIcon={
                                <Icon
                                    type='font-awesome'
                                    name='trash'
                                    size={24}
                                    color='#EA4E52'
                                    onPress={() => {props.deletePOI(POI.title)}}
                                />
                            }
                            bottomDivider
                        />
                    ))
                }
            </ScrollView>
        </View>
    )
}

function mapStateToProps(state) {
    return { POIListToDisplay: state.POIList }
}

function mapDispatchToProps(dispatch) {
    return {
        deletePOI: function(POItitle) { 
            dispatch( {type: 'deletePOI', POItitle: POItitle} ) 
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ChatScreen);