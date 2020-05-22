import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Dimensions, KeyboardAvoidingView } from 'react-native';
import {connect} from 'react-redux';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

function MapScreen(props) {
  const [currentLatitude, setCurrentLatitude] = useState(48.866667);
  const [currentLongitude, setCurrentLongitude] = useState(2.3333334);
  const [addPOI, setAddPOI] = useState(false);
  // const [listPOI, setListPoi] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [coordPOI, setCoordPOI] = useState();
  const [titrePOI, setTitrePOI] = useState();
  const [descPOI, setDescPOI] = useState();

  useEffect(() => {
    async function askPermissions() {
      var { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        Location.watchPositionAsync({distanceInterval: 2},
          (location) => {
            setCurrentLatitude(location.coords.latitude);
            setCurrentLongitude(location.coords.longitude)
          }
        )
      }
    }
    askPermissions();
  }, [currentLongitude, currentLatitude])

  var POIMarkersTab = props.POIListToDisplay.map((POI, i) => {
    return (
      <Marker 
        key={i}
        coordinate={{latitude: POI.latitude, longitude: POI.longitude}}
        title = {POI.title}
        description = {POI.description}
        pinColor={'blue'}
      />
    )
  })

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <MapView style={{flex : 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.3333334,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={e => {
          if (addPOI) {
            setAddPOI(false);
            setIsVisible(true);
            setCoordPOI({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
          }          
        }}
      >
        <Marker 
          coordinate={{latitude: currentLatitude, longitude: currentLongitude}}
          title = {props.userPseudo}
          description = "You are here"
          pinColor={'red'}
        />

        {POIMarkersTab}
      </MapView>

      <Button 
        title="Add POI"
        icon={
            <Icon
                name="map-marker"
                size={20}
                color="#ffffff"
            />
        }
        type="solid"
        buttonStyle={{backgroundColor: '#ea4e52', width: Dimensions.get('window').width}}
        onPress={() => setAddPOI(true)}
        disabled={addPOI}
      />  
      
      <Overlay isVisible={isVisible} overlayStyle={{width: 300, height: 300}}>
        <View>
          <TextInput 
            placeholder="Titre" 
            onChangeText={(val) => setTitrePOI(val)}
            style={{borderColor: "#000000", borderBottomWidth: 1, marginBottom: 36, marginTop: 15}} />
          <TextInput 
            placeholder="Description" 
            onChangeText={(val) => setDescPOI(val)}
            style={{borderColor: "#000000", borderBottomWidth: 1, marginBottom: 36}} />
          <Button title="Ajouter POI" buttonStyle={{backgroundColor: '#ea4e52'}} 
            onPress={() => {
              props.addPOI({latitude: coordPOI.latitude, longitude: coordPOI.longitude, title: titrePOI, description: descPOI});
              setIsVisible(false)}
            }
          />
        </View>
      </Overlay>
      
    </View>
  );
}

function mapStateToProps(state) {
  return { userPseudo: state.pseudo, POIListToDisplay: state.POIList }
}

function mapDispatchToProps(dispatch) {
  return {
      addPOI: function(POI) { 
          dispatch( {type: 'savePOI', POI: POI} ) 
      }
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(MapScreen);