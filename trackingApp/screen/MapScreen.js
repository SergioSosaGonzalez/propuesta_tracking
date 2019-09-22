import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import socketIO from 'socket.io-client';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);
export class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.78825,
      longitude: -122.4324,
      error: null,
    };
    this.socket = null;
  }
  componentDidMount() {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
      this.socket = socketIO('http://192.168.1.70:3000/', {
        query:
          'auth_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZDdjMTM2ZWQ0ZjBkMDA0OTc3ZDRhOTAiLCJuYW1lIjoidGVzdCIsImxhc3RfbmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAdXJnZWdhcy5jb20iLCJpYXQiOjE1NjkxNzc3NzB9.EXfPzmqw9pN7itQyeSTNjRU4EbCTKiib_gV7G9_C6u4',
      });
      //this.socket.connect();
      this.socket.on('connect', () => {
        console.log('connected to socket serv');
      });
      BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 50,
        distanceFilter: 50,
        debug: false,
        startOnBoot: false,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 10000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        stopOnStillActivity: false,
      });
      setInterval(() => {
        BackgroundGeolocation.getCurrentLocation((success, fail, options) => {
          //console.log(success);
          const obj = {
            latitude: success.latitude,
            longitude: success.longitude,
          };
          console.log(obj);
          this.socket.emit('coordenites', obj);
        });
      }, 1000);

      BackgroundGeolocation.getLocations(function(locations) {
        console.log(locations);
      });
    } catch (e) {}
  }
  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();
    this.socket.disconnect();
    console.log('Gola');
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };
  setRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.01,
  });
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'red'}}>
        <View style={{flex: 1, height: '100%'}}>
          <MapView
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.01,
            }}
            provider={PROVIDER_GOOGLE}
            style={{flex: 1, width: '100%', height: '100%'}}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
  },
});
export default MapScreen;
