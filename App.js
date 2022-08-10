import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { useFonts } from 'expo-font'

import Screens from './screens'

const Stack = createStackNavigator()
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  }
}

const App = () => {
  const [loaded] = useFonts({
    PoppinsBold: require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    PoppinsMedium: require('./assets/fonts/Poppins/Poppins-Medium.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsLight: require('./assets/fonts/Poppins/Poppins-Light.ttf'),
  })

  if (!loaded) return null

  return (
    <NavigationContainer
    theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
        <Stack.Screen name='Home' component={Screens.Home} />
        <Stack.Screen name='Details' component={Screens.Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App
