import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { COLORS, FONTS, SHADOWS, SIZES, STORAGE_KEY } from '../constants'

import Checkmark from '../assets/icons/checkmark.svg'
import CheckmarkGreen from '../assets/icons/checkmarkgr.svg'
import Trashcan from '../assets/icons/trashcan.svg'
import Pencil from '../assets/icons/pencil.svg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
const TodoCard = ({ todo, index, setTodos, todos, setSearchFound, setDeleteModal }) => {
  const navigation = useNavigation()
  return (
    <View
    style={{
      padding: SIZES.large,
      paddingLeft: 45,
      marginBottom: 15,
      marginHorizontal: 20,
      backgroundColor: '#fff',
      borderRadius: 5,
      ...SHADOWS.medium
      }}>
      <View style={{
        position: 'absolute',
        top: 20,
        left: 15
      }}>
        <TouchableOpacity
        activeOpacity={.5}
        onPress={() => {
          setTodos(prev => {
            // set to done
            prev[index].done = !prev[index].done
            const x = sortToDone([...prev])
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(x))
            return x
          })
        }}
        >
          {todo.done ? <CheckmarkGreen width={20} height={20} /> : <View style={{ opacity: .2 }}><Checkmark width={20} height={20} /></View>}
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => {
          // delete this todo
          setDeleteModal({
            visible: true,
            title: todo.title,
            index
          })
        }}
        activeOpacity={.75}
        style={{ backgroundColor: COLORS.ROSE, marginTop: 5, padding: 5, borderRadius: 5 }}>
          <Trashcan width={10} height={10} />
        </TouchableOpacity>
      </View>
      <View style={{
        opacity: todo.done ? .25 : 1,
        flexDirection: 'row',
        marginRight: 15
      }}>
        <View>
          {todo.title ? <Text style={{
            fontSize: SIZES.large,
            fontFamily: FONTS.bold,
            letterSpacing: .5,
            textDecorationLine: todo.done ? 'line-through' : 'none',
            }}>{todo.title.length > 50 ? `${todo.title.slice(0, 50)}...` : todo.title}</Text> : 
            <Text style={{
              fontSize: SIZES.large,
              fontFamily: FONTS.semiBold,
              letterSpacing: .5,
              color: COLORS.GRAY,
              textDecorationLine: todo.done ? 'line-through' : 'none',
              }}>Untitled</Text>}
          {todo.content ? <Text
          style={{
            fontSize: SIZES.small,
            fontFamily: FONTS.light
          }}
          >
            {todo.content.length > 500 ? `${todo.content.slice(0, 500)}...` : todo.content}
          </Text> : <Text
          style={{
            fontSize: SIZES.small,
            fontFamily: FONTS.semiBold,
            color: COLORS.GRAY
          }}
          >
            No content.
          </Text>}
        </View>
      </View>
      <View
      style={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}>
          <TouchableOpacity
          onPress={() => {
            navigation.navigate('Details', { data: todo, todos, index }
          )}}
          activeOpacity={.5}
          style={{
            height: 50,
            width: 50,
            // borderColor: 'red',
            // borderWidth: 1
          }}>
            <View style={{
              position: 'absolute',
              top: 0,
              right: 0
            }}>
              <Pencil width={10} height={10} />
            </View>
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default TodoCard

function sortToDone(todos) {
  return todos.sort((a, b) => a.done===b.done?0:a.done?1:-1)
}
