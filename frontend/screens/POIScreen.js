import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { AsyncStorage, Text, View, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

function POIScreen(props) { 
    

    return (
        <View>
            <Text style={{textAlign: 'center', marginTop: 50, marginBottom: 20}}>POI List</Text>
            <ScrollView>
                {
                    props.POIListToDisplay.map((POI, i) => (
                        <ListItem 
                            key={i}
                            title={POI.title}
                            subtitle={POI.description}
                            rightIcon={
                                <Icon
                                    type='font-awesome'
                                    name='trash'
                                    size={24}
                                    color='#EA4E52'
                                    onPress={() => {
                                        var copyListPOI = props.POIListToDisplay.filter((e) => {e.id !== POI.id});
                                        AsyncStorage.setItem("POIList", JSON.stringify(copyListPOI));
                                        props.deletePOI(POI.id);
                                    }}
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
        deletePOI: function(POIId) { 
            dispatch( {type: 'deletePOI', POIId: POIId} ) 
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(POIScreen);