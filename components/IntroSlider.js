import { View, Text } from 'react-native'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS, FONTS, SHOW_REAL_APP_KEY, SIZES } from '../constants'

import Slide1 from '../assets/icons/slides/slide1.svg'
import Slide2 from '../assets/icons/slides/slide2.svg'
import Slide3 from '../assets/icons/slides/slide3.svg'
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions'

import WhiteCheckmark from '../assets/icons/checkmarkwh.svg'
import ArrowRight from '../assets/icons/arrowright.svg'

export function useIntroSlider() {
  const size = useWindowDimensions()
  const slides = [
    {
      key: 1,
      title: 'Organize your life.',
      text: 'DoDoo is a simple todo app built to make tasks managing easier.',
      image: <Slide1 width={size.width - 150} />,
    },
    {
      key: 2,
      title: 'Adding a task.',
      text: 'Press the big plus button at the bottom of your screen to add your first task.',
      image: <Slide2 width={size.width - 150} />,
    },
    {
      key: 3,
      title: 'Explore.',
      text: 'There are many more features that are available in this app, but for now, explore the app and see what it has to offer.',
      image: <Slide3 width={size.width - 50} />,
    },
  ]
  const [loading, setLoading] = React.useState(true)
  const [showRealApp, setShowRealApp] = React.useState(true)
  React.useEffect(() => {
    AsyncStorage.getItem(SHOW_REAL_APP_KEY).then((x) => {
      if (x != 'shown') setShowRealApp(false)
    })
    .then(() => setLoading(false))
  }, [])
  return [showRealApp, loading, <AppIntroSlider
    style={{
      backgroundColor: '#fafafa',
    }}
    data={slides}
    onDone={() => {
      AsyncStorage.setItem(SHOW_REAL_APP_KEY, 'shown').then(() => {
        setShowRealApp(true)
      })
    }}
    keyExtractor={(item) => item.key}
    renderItem={({ item }) => (
      <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
      }}
      >
        <Text style={{
          fontSize: 30,
          fontFamily: FONTS.bold,
          textAlign: 'center',
          position: 'absolute',
          top: 50,
        }}>
          {item.title}
        </Text>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {item.image}
        </View>
        <Text style={{
          fontSize: SIZES.small,
          fontFamily: FONTS.light,
          textAlign: 'center',
          marginBottom: 50
        }}>
          {item.text}
        </Text>
      </View>
    )}
    showSkipButton={false}
    renderNextButton={() => 
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.BLACK,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ArrowRight width={20} height={20} />
      </View>}
    renderDoneButton={() => 
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.ACCENT,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <WhiteCheckmark width={20} height={20} />
      </View>
    }
    // bottomButton={true}
    dotStyle={{
      backgroundColor: 'rgba(0, 0, 0, .1)',
    }}
    activeDotStyle={{
      backgroundColor: COLORS.ACCENT
    }}
  />];
}

// export default IntroSlider