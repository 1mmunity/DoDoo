import { View, Text, Image } from 'react-native'
import React from 'react'
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'

import Plus from '../assets/icons/plus.svg'
import Up from '../assets/icons/up.svg'
import Down from '../assets/icons/down.svg'
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions'

const HomeFooter = ({ todoList, setNewOpen, todoLengthLeft, todoLength }) => {
  const size = useWindowDimensions()
  return (
    <View style={{
      paddingTop: 15,
      alignItems: 'center',
      position: 'absolute',
      zIndex: 4,
      bottom: 0,
      alignSelf: 'center',
      width: size.width
    }}>
      <View style={{
        ...SHADOWS.large,
        position: 'absolute',
        zIndex: 4,
        bottom: 0,
        backgroundColor: COLORS.BLACK,
        width: '100%',
        height: 75,
        transform: [{
          rotate: '180deg'
        }],
      }} />
      <Text style={{
        position: 'absolute',
        bottom: 14,
        color: COLORS.WHITE,
        zIndex: 9,
        fontFamily: FONTS.semiBold,
        fontSize: SIZES.base,
        width: '100%',
        textAlign: 'center'
      }}>
        {`${!todoLength ? 'No' : `${todoLengthLeft}/${todoLength}`} Tasks`}</Text>
      <View style={{ zIndex: 5, position: 'absolute', right: 30, bottom: 100 }}>
        <TouchableOpacity
          onPress={() => {
            if (todoLength != 0) todoList.scrollToIndex({ animated: true, index: 0, viewOffset: 200 })
          }}
          activeOpacity={.75} style={{
            ...SHADOWS.medium,
            backgroundColor: COLORS.BLACK,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}>
            <Up width={15} height={15} />
          </TouchableOpacity>
          <TouchableOpacity
          activeOpacity={.75}
          onPress={() => {
            todoList.scrollToEnd({ animated: true, viewOffset: -999 })
          }}
          style={{
            ...SHADOWS.medium,
            backgroundColor: COLORS.BLACK,
            padding: 10,
            borderRadius: 5
          }}>
            <Down width={15} height={15} />
          </TouchableOpacity>
      </View>
      <View style={{zIndex: 5}}>
        <TouchableHighlight
        underlayColor={COLORS.ACCENT_DARK}
        onPress={() => {
          setNewOpen(true)
        }}
        activeOpacity={.9} style={{
          ...SHADOWS.base,
          backgroundColor: COLORS.ACCENT,
          padding: 15,
          borderRadius: 9999,
          marginBottom: 47,
        }}>
          <Plus width={25} height={25} />
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default HomeFooter