import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { AsyncStorage, Text, View, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

function POIScreen(props) { 
    const [listPOI, setListPOI] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem("POIList", (error, value) => {
            if (value) {
              setListPOI(JSON.parse(value))
            }
        })
    })

    return (
        <View>
            <Text style={{textAlign: 'center', marginTop: 50, marginBottom: 20}}>POI List</Text>
            <ScrollView>
                {
                    listPOI.map((POI, i) => (
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
                                        //props.deletePOI(POI.title)
                                        AsyncStorage.removeItem("POIList");
                                        var copyListPOI = [...listPOI];
                                        console.log(copyListPOI)
                                        copyListPOI = copyListPOI.filter((e) => {e.title !== POI.title});
                                        console.log(copyListPOI)
                                        AsyncStorage.setItem("POIList", JSON.stringify(copyListPOI));
                                        setListPOI(copyListPOI);
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
        deletePOI: function(POItitle) { 
            dispatch( {type: 'deletePOI', POItitle: POItitle} ) 
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(POIScreen);