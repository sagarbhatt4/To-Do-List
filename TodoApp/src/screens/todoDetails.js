import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    Modal
} from 'react-native';

import {
    AVATAR_ICON,
    BACK_ICON,
    deviceHeight,
    deviceWidth
} from '../common/constant';

import {
    BLUE_COLOR,
    SHADOW_COLOR,
    WHITE_COLOR
} from '../common/color';

import {
    PLUS_BLANK_ICON,
    BLANK_CHECKBOX_ICON,
    FILL_CHECKBOX_ICON
} from '../common/constant';

import {
    insertTodoData,
    getToDoList,
    updateTodoStatus
} from '../database/database.js';

import CustomAlert from '../common/customAlert';
import SlidingPanel from 'react-native-sliding-up-down-panels';


function rightBarButton(state) {
    return (
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }} onPress={() => state.params.handleRightAction()}>
            <Image source={AVATAR_ICON} style={{ height: 25, width: 25, marginRight: 10, resizeMode: 'contain' }} />
        </TouchableOpacity>
    );
}

function leftBarButton(state) {
    return (
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }} onPress={() => state.params.handleLeftAction()}>
            <Image source={BACK_ICON} style={{ height: 20, width: 20, marginLeft: 20, resizeMode: 'contain', tintColor: BLUE_COLOR }} />
        </TouchableOpacity>
    );
}

export default class TodoDetails extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '',
        headerStyle: {
            borderBottomWidth: 0,
            elevation: 0,
            backgroundColor: ''
        },
        headerTitleStyle: {
            alignSelf: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: 18,
            lineHeight: 24,
            color: 'white',
        },
        headerLeft: leftBarButton(navigation.state),
        headerRight: rightBarButton(navigation.state)
    })

    constructor(props) {
        super(props);

        this.state = {
            currentTaskData: this.props.navigation.state.params.firstTaskDetails,
            lastTaskData: this.props.navigation.state.params.lastTaskDetail,
            titleText: '',
            descriptionText: '',
            modalVisible: false,
            selectedTask: 0
        }
    }

    componentDidMount() {

        this.props.navigation.setParams({
            handleRightAction: this.onTapRightButton.bind(this),
            handleLeftAction: this.onTapLeftButton.bind(this),
        });

        this.setState({
            currentTaskData: this.props.navigation.state.params.firstTaskDetails
        })
    }

    onTapRightButton = () => {
        // alert("Profile")
    }

    onTapLeftButton = () => {
        this.props.navigation.goBack(null)
    }

    // Redner todo item cell
    todoRenderItem(item, index, selectedTask) {

        var checkboxImage = BLANK_CHECKBOX_ICON
        var textStyle = 'none'
        var descriptionTextView = <Text style={[styles.todoDescription, { color: textColor }]} >{item.todoDescription}</Text>


        if (item.isSelected) {
            checkboxImage = FILL_CHECKBOX_ICON
            textStyle = 'line-through'
            descriptionTextView = <View />
        }
        textColor = WHITE_COLOR

        return (
            <TouchableOpacity style={styles.todoCellContainer} onPress={() => { this.onTodoCellPress(item, selectedTask) }}>
                <Image style={[styles.todoCheckBox, { tintColor: textColor }]} source={checkboxImage} />

                <View style={{ flex: 1 }}>
                    <Text style={[styles.todoTitle, { textDecorationLine: textStyle, color: textColor }]} >{item.todoName}</Text>
                    {descriptionTextView}
                </View>
            </TouchableOpacity>
        );
    }

    // Handle onPress event on tap of todo item and update status to done/undone
    onTodoCellPress(details, selectedTask) {

        this.setState({
            selectedTask: selectedTask
        }, () => {

            var status = details.isSelected == true ? 0 : 1
            updateTodoStatus(details.taskId, details.todoId, status, (message) => {

                this.setState({
                    titleText: '',
                    descriptionText: '',
                }, () => {
                    this.getUpdatedTaskData()
                })
            })
        })
    }

    // Get updated todo list
    getUpdatedTaskData() {

        var { currentTaskData, lastTaskData, selectedTask } = this.state

        var taskObject = selectedTask == 0 ? currentTaskData : lastTaskData

        getToDoList(taskObject.taskId, (response) => {

            let updatedData = { taskId: taskObject.taskId, taskName: taskObject.taskName, color: taskObject.color, subTask: response }

            if (selectedTask == 0) {
                this.setState({
                    currentTaskData: updatedData
                })
            }
            else {
                this.setState({
                    lastTaskData: updatedData
                })
            }
        })
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onPlusButtonPress(index) {
        this.setState({
            selectedTask: index
        }, () => {
            this.setModalVisible(true)
        })
    }

    onAddTaskOkButtonPress() {

        var { titleText, descriptionText, currentTaskData, lastTaskData, selectedTask } = this.state

        if (titleText == '') {
            this.setModalVisible(!this.state.modalVisible)
            return
        }

        var taskId = selectedTask == 0 ? currentTaskData.taskId : lastTaskData.taskId

        insertTodoData(titleText, descriptionText, taskId, (message) => {

            this.setState({
                titleText: '',
                descriptionText: '',
            }, () => {
                this.getUpdatedTaskData()
            })
            this.setModalVisible(!this.state.modalVisible)
        })
    }

    onCancelButtonPress() {
        this.setModalVisible(!this.state.modalVisible)
    }

    renderTaskTitle(addButtonTintColor, taskName, index) {
        return(
            <View style={ styles.taskTitleView }>
                <Text style={[styles.titleText, { color: textColor }]} >
                    { taskName }
                </Text>
                <TouchableOpacity style={styles.addButtonTouchable} onPress={() => { this.onPlusButtonPress(index) }}>
                    <Image style={{ height: 20, width: 20, tintColor: addButtonTintColor }} source={PLUS_BLANK_ICON} />
                </TouchableOpacity>
            </View>
        )
    }

    renderTaskList(subTask, ind) {
        return(
            <FlatList
                style={{ flex: 1, width: '75%', marginTop: 10 }}
                data={subTask}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => this.todoRenderItem(item, index, ind)}
            />
        )
    }

    render() {

        var { currentTaskData, lastTaskData } = this.state
        var textColor = WHITE_COLOR
        var addButtonTintColor = WHITE_COLOR
        var lastTaskView = <View />

        if (lastTaskData != null) {

            lastTaskView = <SlidingPanel
                headerLayoutHeight={350}
                headerLayout={() =>
                    <View style={{ height: 80, marginTop: 200, width: deviceWidth, backgroundColor: lastTaskData.color, borderTopRightRadius: 35, alignItems: 'center' }}>

                        <View style={[styles.headerContainer, { width: '85%' }]} >
                            { this.renderTaskTitle(addButtonTintColor, lastTaskData.taskName, 1) }
                        </View>

                    </View>
                }
                slidingPanelLayout = { () =>
                    <View style={{ height: deviceHeight - 280, marginTop: -70, width: deviceWidth, backgroundColor: lastTaskData.color, alignItems: 'center' }}>
                        { this.renderTaskList(lastTaskData.subTask, 1) }
                    </View>
                }
            />
        }

        return (
            <View style={styles.container}>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <CustomAlert
                        alertBody={"Add Todo"}
                        titlePlaceholder={"Todo Title"}//
                        descriptionPlaceholder={"Todo Description"}
                        isWithDescriptionInputText={true}
                        okButtonTitle={"ADD"}
                        cancelButtonTitle={"CANCEL"}
                        onOkButtonTap={() => { this.onAddTaskOkButtonPress() }}
                        onCancelButtonTap={() => { this.onCancelButtonPress() }}
                        onTextInputChange={(text) => { this.setState({ titleText: text }) }}
                        onDescriptionTextInputChange={(text) => { this.setState({ descriptionText: text }) }}
                    />

                </Modal>

                <View style={[styles.mainContentContainer, { backgroundColor: currentTaskData.color }]}>
                    <View style={styles.headerContainer} >
                        { this.renderTaskTitle(addButtonTintColor, currentTaskData.taskName, 0) }
                    </View>

                    { this.renderTaskList(currentTaskData.subTask, 0) }

                </View>
                
                { lastTaskView }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContentContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        borderTopRightRadius: 30,
        alignItems: 'center'
    },
    headerContainer: {
        width: '85%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    taskTitleView: { 
        height: '100%', 
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    titleText: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    addButtonTouchable: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    todoCellContainer: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
    },
    todoCheckBox: {
        height: 14,
        width: 14,
    },
    todoTitle: {
        fontSize: 13,
        marginLeft: 10,
        width: '100%',
    },
    todoDescription: {
        fontSize: 9,
        marginLeft: 10,
        width: '100%',
    },
})
