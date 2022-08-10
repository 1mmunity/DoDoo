import React from 'react'
import { Text, View, SafeAreaView, FlatList } from 'react-native'

import { COLORS, dummyTodo, EMAIL, FONTS, SHADOWS, SIZES, STORAGE_KEY } from '../constants'
import { HomeHeader, FocusedStatusBar, TodoCard, HomeFooter } from '../components'

import Info from '../assets/icons/info.svg'
import Empty from '../assets/icons/empty.svg'
import AJALogo from '../assets/icons/aja.svg'
import FileImport from '../assets/icons/fileimport.svg'

import { TouchableHighlight as RTouchableHighlight, TouchableOpacity as RTouchableOpacity, Linking } from 'react-native'
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'

import ReactNativeModal from 'react-native-modal'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions'
import * as Clipboard from 'expo-clipboard'
import * as yup from 'yup'

import { useIntroSlider } from '../components/IntroSlider'
import AppIntroSlider from 'react-native-app-intro-slider'

const importValidationSchema = yup.array(
  yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
    createdAt: yup.number().required(),
    updatedAt: yup.number().required(),
    done: yup.boolean().required()
  }).required()
).required()

const Home = ({ navigation }) => {
  const [todos, setTodos] = React.useState([])
  const [todoRef, setTodoRef] = React.useState(null)
  const [infoOpen, setInfoOpen] = React.useState(false)
  const [newOpen, setNewOpen] = React.useState(false)
  const [importOpen, setImportOpen] = React.useState(false)
  const [importError, setImportError] = React.useState(null)
  const [searchFilter, setSearchFilter] = React.useState('')
  const [searchFound, setSearchFound] = React.useState(0)
  const [copyMessage, setCopyMessage] = React.useState('Copy JSON')
  const [deleteModal, setDeleteModal] = React.useState({
    visible: false,
    title: null,
    index: null
  })

  const size = useWindowDimensions()
  const [showRealApp, loading, IntroSlider] = useIntroSlider()

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action and update data
      AsyncStorage.getItem(STORAGE_KEY).then(t => {
        if (t) {
          const x = sortToDone(JSON.parse(t))
          const d = todos.filter(a => a.title.toLowerCase().includes(searchFilter.toLowerCase()) || a.content.toLowerCase().includes(searchFilter.toLowerCase())).length
          setSearchFound(d)
          setTodos(x)
        }
      })
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation])

  // const onGoBack = (data, index) => {
  //   // modify the todos with the index
  //   setTodos(p => {
  //     const newTodos = [...p]
  //     newTodos[index] = data
  //     return newTodos
  //   })
  //   setNewOpen(false)
  // }
  if (!showRealApp && !loading) return IntroSlider
  else return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      {DeleteModal(deleteModal, setDeleteModal, setTodos, setSearchFound)}
      {ImportDataModal(importOpen, setImportOpen, importError, setImportError, setTodos, setSearchFound, searchFilter)}
      {CreateTaskModal(newOpen, setNewOpen, setTodos, setSearchFound, size)}
      <AppInfoModal copyMessage={copyMessage} setCopyMessage={setCopyMessage} infoOpen={infoOpen} setInfoOpen={setInfoOpen} />
      <View style={{
        position: 'absolute',
        right: 0,
        zIndex: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          padding: 10,
          borderBottomLeftRadius: 5,
        }}>
          <TouchableHighlight
          activeOpacity={1}
          underlayColor={COLORS.ACCENT_DARK}
          onPress={() => setImportOpen(true)}
          style={{
            ...SHADOWS.extraLarge,
            padding: 6,
            backgroundColor: COLORS.ACCENT,
            borderRadius: 5
          }}>
            <FileImport width={12} height={12} />
          </TouchableHighlight>
          <TouchableHighlight
          activeOpacity={1}
          underlayColor={COLORS.ACCENT_DARK}
          onPress={() => setInfoOpen(true)}
          style={{
            ...SHADOWS.extraLarge,
            padding: 6,
            backgroundColor: COLORS.ACCENT,
            borderRadius: 5,
            marginLeft: 5
          }}>
            <Info width={12} height={12} />
          </TouchableHighlight>
        </View>
      </View>
      <HomeFooter setNewOpen={setNewOpen} todoLengthLeft={todos.filter(({done}) => !done).length} todoLength={todos.length} todoList={todoRef} />
      <FocusedStatusBar background={COLORS.PRIMARY} />

      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          <FlatList
            ref={(r) => { setTodoRef(r) }}
            data={todos}
            renderItem={({ item, index }) => {
              if (!item || !Object.keys(item).length) return null // crash handler
              if (item.title.toLowerCase().includes(searchFilter.toLowerCase()) || item.content.toLowerCase().includes(searchFilter.toLowerCase())) return <TodoCard setDeleteModal={setDeleteModal} setSearchFound={setSearchFound} todos={todos} todo={item} index={index} setTodos={setTodos} />
              else return null
            }}
            keyExtractor={(_, i) => i}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<HomeHeader searchFound={searchFound} todosLength={todos.length} todos={todos} setSearchFound={setSearchFound} setSearchFilter={setSearchFilter} />}
            ListFooterComponent={<View style={{ padding: 50 }} />}
            ListEmptyComponent={<View
            style={{
              height: 350,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: .2,
            }}
            >
              <Empty width={150} height={150} />
              <Text
              style={{
                fontFamily: FONTS.bold
              }}
              >No Tasks</Text>
            </View>}
          />
        </View>

        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: -1
        }}>
          <View style={{ height: 225, backgroundColor: COLORS.BLACK, ...SHADOWS.medium }} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home

function DeleteModal(deleteModal, setDeleteModal, setTodos, setSearchFound) {
  return <ReactNativeModal
    animationIn='bounceIn'
    animationOut='bounceOut'
    backdropTransitionOutTiming={0}
    isVisible={deleteModal.visible}
    onBackButtonPress={() => setDeleteModal(p => ({
      ...p,
      visible: false,
    }))}
    onBackdropPress={() => setDeleteModal(p => ({
      ...p,
      visible: false,
    }))}>
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 25,
        borderRadius: 5,
        marginHorizontal: 20
      }}>
      <Text style={{
        paddingVertical: 20,
        color: COLORS.WHITE,
        backgroundColor: COLORS.BLACK,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontFamily: FONTS.bold,
        fontSize: SIZES.extraLarge,
        textAlign: 'center',
      }}>Delete Todo</Text>
      <View style={{
        paddingHorizontal: 25,
        paddingTop: 20,
      }}>
        <View style={{
          flexDirection: 'row',
        }}>
          <Text style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.base,
            color: COLORS.BLACK,
            marginBottom: 10,
          }}>
            Are you sure you want to delete "{deleteModal.title || 'Untitled'}"?
            It's going to be deleted forever (a very long time!)
          </Text>
        </View>
        <RTouchableHighlight
          activeOpacity={1}
          underlayColor={COLORS.ROSE_DARK}
          style={{
            ...SHADOWS.medium,
            backgroundColor: COLORS.ROSE,
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => {
            setDeleteModal(p => ({
              ...p,
              visible: false,
              index: null
            }))
            setTodos(prev => {
              if (deleteModal.index !== null) {
                // if the button keeps being pressed by the user,
                // the next todo with the same index after the previous one
                // is deleted will also be deleted,
                // This is a check if the index is null to prevent this
                // from happening.
                setSearchFound(p => p - 1)
                const x = sortToDone([
                  ...prev.slice(0, deleteModal.index),
                  ...prev.slice(deleteModal.index + 1)
                ])
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(x))
                return x
              } else
                return prev
            })
          } }>
          <Text style={{
            color: COLORS.WHITE,
            fontFamily: FONTS.medium,
            letterSpacing: .2,
            textAlign: 'center'
          }}>
            Delete
          </Text>
        </RTouchableHighlight>
      </View>
    </View>
  </ReactNativeModal>
}

function ImportDataModal(importOpen, setImportOpen, importError, setImportError, setTodos, setSearchFound, searchFilter) {
  return <ReactNativeModal
    animationIn='bounceIn'
    animationOut='bounceOut'
    backdropTransitionOutTiming={0}
    isVisible={importOpen}
    onBackButtonPress={() => setImportOpen(false)}
    onBackdropPress={() => setImportOpen(false)}>
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 25,
        borderRadius: 5,
        marginHorizontal: 20
      }}>
      <Text style={{
        paddingVertical: 20,
        color: COLORS.WHITE,
        backgroundColor: COLORS.BLACK,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontFamily: FONTS.bold,
        fontSize: SIZES.extraLarge,
        textAlign: 'center',
      }}>Import Tasks</Text>
      <View style={{
        paddingHorizontal: 25,
        paddingTop: 20,
      }}>
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.medium,
            color: COLORS.BLACK,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >How to Import/Export Tasks:</Text>
        <InstructionText>
          [Export] Copy The JSON data from the export button (This can be found on the top right corner button with the "i" symbol.)
        </InstructionText>
        <InstructionText style={{
          marginBottom: 20
        }}>
          [Import] Click the import button below. The JSON data in your clipboard will be automatically added to your tasks.
        </InstructionText>
        {importError && <InstructionText style={{
          color: COLORS.ROSE,
          marginBottom: 10
        }}>
          {importError}
        </InstructionText>}
        <RTouchableHighlight
          activeOpacity={1}
          underlayColor={COLORS.ACCENT_DARK}
          style={{
            ...SHADOWS.medium,
            backgroundColor: COLORS.ACCENT,
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => {
            setImportError(null)
            Clipboard.getStringAsync().then(data => {
              if (data) {
                let r
                try {
                  r = JSON.parse(data)
                } catch {
                  return setImportError('Invalid JSON provided.')
                }

                if (!importValidationSchema.isValidSync(r)) return setImportError('Cannot import from clipboard. Please check if the data is in the right scheme.')

                setTodos((p) => {
                  const m = sortToDone([...p, ...r])
                  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(m))
                  return m
                })

                const d = r.filter(a => a.title.toLowerCase().includes(searchFilter.toLowerCase()) || a.content.toLowerCase().includes(searchFilter.toLowerCase())).length
                setSearchFound(p => p + d)
                setImportOpen(false)
              } 
            })
          } }>
          <Text style={{
            color: COLORS.WHITE,
            fontFamily: FONTS.medium,
            letterSpacing: .2,
            textAlign: 'center'
          }}>
            Import from Clipboard
          </Text>
        </RTouchableHighlight>
      </View>
    </View>
  </ReactNativeModal>
}

function InstructionText({ style, ...props }) {
  return <Text
    style={{
      fontFamily: FONTS.regular,
      fontSize: SIZES.base,
      color: COLORS.BLACK,
      marginBottom: 10,
      ...style
    }}
    {...props}
  />
}

function CreateTaskModal(newOpen, setNewOpen, setTodos, setSearchFound, size) {
  return <ReactNativeModal
    animationIn='bounceIn'
    animationOut='bounceOut'
    backdropTransitionOutTiming={0}
    isVisible={newOpen}
    onBackButtonPress={() => setNewOpen(false)}
    onBackdropPress={() => setNewOpen(false)}>
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 0,
        borderRadius: 5,
        marginHorizontal: 20
      }}>
      <Text style={{
        paddingVertical: 20,
        color: COLORS.WHITE,
        backgroundColor: COLORS.BLACK,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontFamily: FONTS.bold,
        fontSize: SIZES.extraLarge,
        textAlign: 'center',
      }}>Create New Task</Text>
      <View style={{
        padding: 25
      }}>
        <Formik
          initialValues={{ title: '', content: '' }}
          onSubmit={(values, { resetForm }) => {
            const d = Date.now()
            values.createdAt = d
            values.updatedAt = d

            // trim any trailling whitespaces
            values.title = values.title.trim()
            values.content = values.content.trim()

            //* Might refactor
            setTodos(prev => {
              const x = sortToDone([...prev, values])
              AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(x))
              return x
            })
            setSearchFound(p => p + 1)

            setNewOpen(false)
            resetForm()
          } }>
          {({ handleChange, handleSubmit, values }) => (
            <View>
              <TextArea
                name='title'
                onChangeText={handleChange('title')}
                value={values.title}
                placeholder='Title' />
              <TextArea
                name='content'
                onChangeText={handleChange('content')}
                value={values.content}
                multiline={true}
                placeholder='Content'
                style={{
                  marginTop: 5,
                  maxHeight: size.height / 2
                }} />
              <RTouchableHighlight
                activeOpacity={1}
                underlayColor={COLORS.ACCENT_DARK}
                style={{
                  ...SHADOWS.medium,
                  backgroundColor: COLORS.ACCENT,
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 25
                }}
                onPress={handleSubmit}>
                <Text style={{
                  color: COLORS.WHITE,
                  fontFamily: FONTS.medium,
                  letterSpacing: .2,
                  textAlign: 'center'
                }}>
                  Create Task
                </Text>
              </RTouchableHighlight>
            </View>
          )}
        </Formik>
      </View>
    </View>
  </ReactNativeModal>
}

function TextArea({ style, placeholder, ...props }) {
  return <TextInput
    placeholder={placeholder}
    autoCorrect={false}
    style={{
      fontFamily: FONTS.regular,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      backgroundColor: COLORS.LIGHT_GRAY,
      letterSpacing: .4,
      ...style
    }}
    {...props}/>
}

function AppInfoModal({ infoOpen, setInfoOpen, copyMessage, setCopyMessage }) {
  return <ReactNativeModal
    animationIn='bounceIn'
    animationOut='bounceOut'
    backdropTransitionOutTiming={0}
    isVisible={infoOpen}
    onBackButtonPress={() => setInfoOpen(false)}
    onBackdropPress={() => setInfoOpen(false)}>
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 25,
        borderRadius: 5,
        marginHorizontal: 20
      }}>
      <Text style={{
        paddingVertical: 20,
        color: COLORS.WHITE,
        backgroundColor: COLORS.BLACK,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        fontFamily: FONTS.bold,
        fontSize: SIZES.extraLarge,
        textAlign: 'center',
      }}>App Information</Text>
      <View style={{
        paddingHorizontal: 25,
        paddingTop: 20,
      }}>
        <FlatList
          data={[['Version', '1.0.3'], ['Creator', 'AdrielJ Apps']]}
          keyExtractor={(a, i) => `${a[0]}-${i}`}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={{
                borderRadius: 999,
                paddingVertical: 1,
                paddingHorizontal: 10,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontFamily: FONTS.semiBold,
                marginRight: 10,
                fontSize: SIZES.base
              }}>
                {item[0]}
              </Text>
              <View style={{
                flexDirection: 'row'
              }}>
              {item[0] == 'Creator' && <View style={{ marginRight: 5 }}><AJALogo width={20} height={20} /></View>}
                <Text style={{
                  fontFamily: FONTS.light
                }}>
                  {item[1]}
                </Text>
              </View>
            </View>
          )} />
        <RTouchableHighlight
          activeOpacity={1}
          underlayColor={COLORS.ACCENT_DARK}
          style={{
            ...SHADOWS.medium,
            backgroundColor: COLORS.ACCENT,
            padding: 10,
            borderRadius: 5,
            marginTop: 25
          }}
          onPress={() => {
            const url = `mailto:${EMAIL}`
            Linking.canOpenURL(url).then(() => {
              Linking.openURL(url)
            })
          }}>
          <Text style={{
            color: COLORS.WHITE,
            fontFamily: FONTS.medium,
            letterSpacing: .2,
            textAlign: 'center'
          }}>
            Submit Feedback
          </Text>
        </RTouchableHighlight>
        <RTouchableHighlight
          activeOpacity={1}
          underlayColor='#4f46e5'
          style={{
            ...SHADOWS.medium,
            backgroundColor: '#6366f1',
            padding: 10,
            borderRadius: 5,
            marginTop: 5
          }}
          onPress={() => {
            AsyncStorage.getItem(STORAGE_KEY)
            .then(v => {
              Clipboard.setStringAsync(v)
              setCopyMessage('Copied!')
            })
            .catch(() => {
              setCopyMessage('Something went wrong!')
            })
            .then(() => {
              setTimeout(() => {
                setCopyMessage('Copy JSON')
              }, 750)
            })
          }}>
          <Text style={{
            color: COLORS.WHITE,
            fontFamily: FONTS.medium,
            letterSpacing: .2,
            textAlign: 'center'
          }}>
            {copyMessage}
          </Text>
        </RTouchableHighlight>
      </View>
    </View>
  </ReactNativeModal>
}

function sortToDone(todos) {
  return todos.sort((a, b) => a.done===b.done?0:a.done?1:-1)
}
