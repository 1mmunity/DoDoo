import React from 'react'
import { Text, View, useWindowDimensions } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS, FONTS, SHADOWS, SIZES, STORAGE_KEY } from '../constants'

// import XMark from '../assets/icons/xmark.svg'
// import TrashCan from '../assets/icons/trashcan.svg'
import CheckmarkWhite from '../assets/icons/checkmarkwh.svg'
// import CheckmarkGreen from '../assets/icons/checkmarkgr.svg'
import Pencil from '../assets/icons/pencil.svg'
import PencilWhite from '../assets/icons/pencilwh.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Details = ({ route, navigation }) => {
  const { data, todos, index } = route.params
  const [todo, setTodo] = React.useState(data)

  const size = useWindowDimensions()
  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.BLACK_DARKER,
    }}>
      <View style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
      }}>
        <View
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 5,
        }}>
          <TopButton
          style={{
            // borderColor: 'red',
            // borderWidth: 1,
            opacity: .9,
            width: 50,
            height: 50
          }}
          onPress={() => {
            const x = todo
            x.title = todo.title.trim()
            x.content = todo.content.trim()
            // check if data title and content is the same as todo
            if (x.title !== data.title || x.content !== data.content) {
              x.updatedAt = Date.now()
            }
            todos[index] = x
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
            navigation.goBack()
          }}
          >
            <View style={{
              position: 'absolute',
              right: 0
            }}>
              <CheckmarkWhite width={20} height={20} />
            </View>
          </TopButton>
          {/* <TopButton
          style={{
            marginTop: 5
          }}
          >
            <TrashCan width={20} height={20} />
          </TopButton>
          <TopButton
          onPress={() => {
            setTodo(p => ({
              ...p,
              done: !p.done
            }))
          }}
          style={{
            marginTop: 5,
          }}>
            {todo.done ? <CheckmarkGreen width={20} height={20} /> : <CheckmarkWhite width={20} height={20} />}
          </TopButton> */}
        </View>

        <View style={{
          borderTopLeftRadius: 29,
          borderTopRightRadius: 29,
          padding: SIZES.large,
          backgroundColor: COLORS.BLACK,
          zIndex: -1,
          ...SHADOWS.extraLarge
        }}>
          {!todo.title && <View style={{
            position: 'absolute',
            flexDirection: 'row',
            top: 20,
            left: 20,
            fontSize: 13
          }}>
            <View style={{
              position: 'absolute',
              top: 3,
              opacity: .2,
            }}>
              <PencilWhite width={13} height={13} />
            </View>
            <Text style={{
              marginLeft: 20,
              fontFamily: FONTS.medium,
              fontSize: 15,
              opacity: .2,
              color: COLORS.WHITE
            }}>(Add Title...)</Text>
          </View>}
          <TextInput
          
          multiline={true}
          // maxHeight={20}
          onChangeText={(text) => setTodo(p => ({
            ...p,
            title: text,
          }))}
          placeholderTextColor={COLORS.WHITE}
          style={{
            fontFamily: FONTS.semiBold,
            maxHeight: 75,
            marginBottom: 20,
            fontSize: SIZES.extraLarge,
            color: COLORS.WHITE,
            letterSpacing: .1,
            marginRight: 40,
            opacity: todo.done ? .5 : 1,
            textDecorationLine: todo.done ? 'line-through' : 'none'
          }}
          >
            {todo.title}
          </TextInput>
          <SubText>{formatDate(new Date(todo.createdAt))} (Created)</SubText>
          <SubText>{formatDate(new Date(todo.updatedAt))} (Last Modified)</SubText>
        </View>

        <View style={{
          padding: 15,
        }}>
          {!todo.content && <View style={{
            position: 'absolute',
            flexDirection: 'row',
            top: 30,
            left: 26,
            fontSize: 13
          }}>
            <View style={{
              position: 'absolute',
              top: 3,
              opacity: .2
            }}>
              <Pencil width={13} height={13} />
            </View>
            <Text style={{
              marginLeft: 20,
              fontFamily: FONTS.medium,
              fontSize: 15,
              opacity: .2
            }}>(Add Content...)</Text>
          </View>}
          <TextInput
          onChangeText={(text) => setTodo(p => ({
            ...p,
            content: text
          }))}
          multiline={true}
          style={{
            maxHeight: size.height - 200,
            fontFamily: FONTS.semiBold,
            fontSize: 13,
            color: COLORS.BLACK,
            letterSpacing: .1,
          }}>
            {todo.content}
          </TextInput>
        </View>
      </View>
    </View>
  )
}

export default Details

function TopButton({ style, ...props }) {
  return <TouchableOpacity
    style={{
      ...style
    }}
    activeOpacity={.5}
    {...props} />
}

function SubText({ children }) {
  return <Text style={{
    fontFamily: FONTS.medium,
    fontSize: SIZES.base,
    color: COLORS.WHITE,
    opacity: .5,
    letterSpacing: .1,
    marginRight: 40,
  }}>
    {children}
  </Text>
}

function formatDate(date) {
  // dd/mm/yyyy hh:mm
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}
