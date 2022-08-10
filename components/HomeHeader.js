import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants'
import { TextInput } from 'react-native-gesture-handler'

const HomeHeader = ({ searchFound, todos, setSearchFound, todosLength, setSearchFilter }) => {
  return (
    <View style={{ padding: 35, paddingBottom: 20 }}>
      <View style={{
        alignContent: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          borderTopColor: COLORS.ACCENT,
          borderTopWidth: 5,
          fontSize: 45,
          color: COLORS.WHITE,
          fontFamily: FONTS.bold,
          padding: 0,
          margin: 0,
          textAlign: 'center'
        }}>DoDoo</Text>
      </View>
      <TextInput
      onChangeText={(text) => {
        setSearchFound(todos.filter(todo => todo.title.toLowerCase().includes(text.toLowerCase()) || todo.content.toLowerCase().includes(text.toLowerCase())).length)
        setSearchFilter(text)
      }}
      placeholder='Search'
      placeholderTextColor='#636D80'
      style={{
        ...SHADOWS.extraLarge,
        color: COLORS.WHITE,
        backgroundColor: COLORS.BLACK_LIGHTER,
        width: '100%',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontFamily: FONTS.medium,
      }}
      />
      <Text style={{
        fontSize: SIZES.base,
        color: COLORS.WHITE,
        fontFamily: FONTS.semiBold,
        padding: 0,
        margin: 0,
        textAlign: 'left',
        marginTop: 10
      }}>
        {`${searchFound} out of ${todosLength} Found.`}
      </Text>
      {/* <Text style={{
        fontSize: SIZES.small,
        color: COLORS.WHITE,
        fontFamily: FONTS.light,
      }}>A simple ToDo app</Text> */}
    </View>
  )
}

export default HomeHeader