import 'react-native-gesture-handler';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import Onboarding from './screens/Onboarding';
import Routes from './navigation';

import { enableLatestRenderer } from 'react-native-maps';

export default function App() {

  enableLatestRenderer();

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}