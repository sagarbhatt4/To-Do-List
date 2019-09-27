import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Modal
} from 'react-native';

import { 
    PLUS_ICON, 
    PLUS_BLANK_ICON, 
    BLANK_CHECKBOX_ICON, 
    FILL_CHECKBOX_ICON, 
    AVATAR_ICON, 
    deviceWidth, 
    deviceHeight,
    aspectHeight
} from '../common/constant';

import { 
    WHITE_COLOR, 
    BLUE_COLOR, 
    GRAY_COLOR, 
    SHADOW_COLOR,
    TASKLIST_BACK_COLORS,
    INITIAL_TASK_COLOR
} from '../common/color';

import CustomAlert from '../common/customAlert';
import AnalogClock from "../clock/AnalogClock";

import { 
    insertTaskData, 
    getTaskList, 
    insertTodoData, 
    getToDoList, 
    updateTodoStatus
} from '../database/database.js';


function rightBarButton(state) {
    return (
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }} onPress={() => state.params.handleRightAction()}>
            <Image source={ AVATAR_ICON } style={{ height: 25, width: 25, marginRight: 10, resizeMode: 'contain' }} />
        </TouchableOpacity>
    );
}

export default class Home extends React.Component {

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
        headerLeft: <View />,
        headerRight: rightBarButton(navigation.state)
    })

    constructor() {
        super();
        this.state = {
            tasks: [],
            modalVisible: false,
            titleText: '',
            descriptionText: '',
            isForTodoInput: false,
            alertBody: '',
            titleInputPlaceholder: '',
            descriptionInputPlaceholder: '',
            selectedTaskId: null
        }
    }

    componentDidMount() {

        this.props.navigation.setParams({
            handleRightAction: this.onTapRightButton.bind(this),
        });

        const { navigation } = this.props;

        navigation.addListener('willFocus', () => {
            this.getTaskData()
        });

        this.getTaskData()
    }

    onTapRightButton = () => {
        // alert("Profile")
    }

    // Get task list
    getTaskData() {
        let data = []
        getTaskList((res) => {
            if (res.length > 0) {
                this.getTodoListData(0, res, data)
            }
        })
    }

    // Get todo list based on task id
    getTodoListData(index, res, mainArray) {
        getToDoList(res[index].taskId, (response) => {
            mainArray.push({ taskId: res[index].taskId, taskName: res[index].taskName, color: res[index].color, subTask: response })
            if (index == res.length - 1) {
                this.setState({
                    tasks: mainArray
                })
            }
            else {
                this.getTodoListData(index + 1, res, mainArray)
            }
        })
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    // Handle onPress event on tap of task title
    openDetailScreen(index) {

        var { tasks } = this.state

        if (index == tasks.length - 1 && tasks.length > 1) {
            this.props.navigation.navigate('TodoDetails', { firstTaskDetails: tasks[index], lastTaskDetail: tasks[0] })
        }
        else if (tasks.length > 1) {
            this.props.navigation.navigate('TodoDetails', { firstTaskDetails: tasks[index], lastTaskDetail: tasks[index + 1] })
        }
        else {
            this.props.navigation.navigate('TodoDetails', { firstTaskDetails: tasks[index], lastTaskDetail: null })
        }
    }

    // Task list render cell
    renderItem({ item, index }) {

        var textColor = WHITE_COLOR
        var addButtonTintColor = WHITE_COLOR

        return (
            <View style={styles.cellContainer}>
                <View style={styles.shadowView} />

                <View style={[styles.cellcontentContainer, { backgroundColor: item.color }]}>
                    <View style={styles.cellHeaderContainer} >
                        <Text style={[styles.cellTitle, { color: textColor }]} onPress={() => { this.openDetailScreen(index) }}>
                            {item.taskName}
                        </Text>
                        <TouchableOpacity style={styles.cellAddButtonTouchable} onPress={() => { this.oncellPlusButtonPress(item) }}>
                            <Image style={{ height: 10, width: 10, tintColor: addButtonTintColor }} source={PLUS_BLANK_ICON} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        style={{ flex: 1, width: '85%' }}
                        data={item.subTask}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={({ item, index }) => this.todoRenderItem(item, index)}
                    />

                </View>
            </View>
        );
    }

    // ToDo list render cell
    todoRenderItem(item, index) {

        var checkboxImage = BLANK_CHECKBOX_ICON
        var textStyle = 'none'

        if (item.isSelected) {
            checkboxImage = FILL_CHECKBOX_ICON
            textStyle = 'line-through'
        }

        textColor = WHITE_COLOR

        return (
            <TouchableOpacity style={styles.todoCellContainer} onPress={() => { this.onTodoCellPress(item) }}>
                <Image style={[styles.todoCheckBox, { tintColor: textColor }]} source={checkboxImage} />
                <Text style={[styles.todoTitle, { textDecorationLine: textStyle, color: textColor }]} >{item.todoName}</Text>
            </TouchableOpacity>
        );
    }

    // Handle onPress event on tap of todo item
    onTodoCellPress(details) {

        var status = details.isSelected == true ? 0 : 1

        updateTodoStatus(details.taskId, details.todoId, status, (message) => {
            this.setState({
                titleText: '',
                descriptionText: '',
            }, () => {
                this.getTaskData()
            })
        })
    }

    // Handle onPress event on tap of + for ToDo list
    oncellPlusButtonPress(taskDetails) {

        this.setState({
            isForTodoInput: true,
            alertBody: 'Add Todo',
            titleInputPlaceholder: 'Todo Title',
            descriptionInputPlaceholder: 'Todo Description',
            selectedTaskId: taskDetails.taskId
        }, () => {
            this.setModalVisible(true)
        })
    }

    // Handle onPress event on tap of + for Task list
    onAddTaskButtonPress() {

        this.setState({
            isForTodoInput: false,
            alertBody: 'Add Task List',
            titleInputPlaceholder: 'List Title',
            descriptionInputPlaceholder: '',
        }, () => {
            this.setModalVisible(true)
        })

    }

    // Handle onPress event for Add button in popup for Task and Todo
    onAddTaskOkButtonPress() {

        var { titleText, descriptionText, isForTodoInput, selectedTaskId } = this.state

        if (titleText == '') {
            this.setModalVisible(!this.state.modalVisible)
            return
        }

        if (isForTodoInput) {
            insertTodoData(titleText, descriptionText, selectedTaskId, (message) => {

                this.setState({
                    titleText: '',
                    descriptionText: '',
                }, () => {
                    this.getTaskData()
                })
                this.setModalVisible(!this.state.modalVisible)
            })
        }
        else {
            let index = (this.state.tasks.length % TASKLIST_BACK_COLORS.length);
            // // index = (index == TASKLIST_BACK_COLORS.length - 1) ? 0 : index;
            // if(this.state.tasks.length > TASKLIST_BACK_COLORS.length) {
            //     index = index + 1;
            // }
            // else if((index + 1) == TASKLIST_BACK_COLORS.length) {
            //     index = index;
            // }
            
            var ColorCode = this.state.tasks.length == 0 ? INITIAL_TASK_COLOR : TASKLIST_BACK_COLORS[index] ;
            // alert(ColorCode + ' ' + index);

            insertTaskData(titleText, ColorCode, (message) => {

                this.setState({
                    titleText: '',
                    descriptionText: '',
                }, () => {
                    this.getTaskData()
                })
                this.setModalVisible(!this.state.modalVisible)
            })
        }
    }

    onCancelButtonPress() {
        this.setModalVisible(!this.state.modalVisible)
    }

    render() {

        var { tasks, isForTodoInput, alertBody, titleInputPlaceholder, descriptionInputPlaceholder } = this.state
        var timeStatus = ''
        var today = new Date()
        var currentHour = today.getHours()

        if (currentHour > 20 && currentHour < 4) {
            timeStatus = 'Good Night'
        } 
        else if (currentHour > 4 && currentHour < 12) {
            timeStatus = 'Good Morning'
        } 
        else if (currentHour > 12 && currentHour < 17) {
            timeStatus = 'Good Afternoon'
        } 
        else {
            timeStatus = 'Good Evening'
        }

        var listContainer;

        if (tasks.length > 0) {
            listContainer = <View style={styles.listContainerView}>
                <FlatList
                    horizontal={true}
                    style={{ flex: 1 }}
                    data={tasks}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderItem.bind(this)}
                />
            </View>
        }
        else {
            listContainer = <View style={[styles.listContainerView, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.noDataFoundText}>{"No Task List Added"}</Text>
            </View>
        }

        return (
            <View style={styles.container}>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <CustomAlert
                        alertBody={alertBody}
                        titlePlaceholder={titleInputPlaceholder}
                        descriptionPlaceholder={descriptionInputPlaceholder}
                        isWithDescriptionInputText={isForTodoInput}
                        okButtonTitle={"ADD"}
                        cancelButtonTitle={"CANCEL"}
                        onOkButtonTap={() => { this.onAddTaskOkButtonPress() }}
                        onCancelButtonTap={() => { this.onCancelButtonPress() }}
                        onTextInputChange={(text) => { this.setState({ titleText: text }) }}
                        onDescriptionTextInputChange={(text) => { this.setState({ descriptionText: text }) }}
                    />

                </Modal>

                <View style={styles.topViewContainer}>
                    <Text style={styles.timeStatusText}>{timeStatus},</Text>
                    <Text style={styles.userNameText}>{"Varun Makhija"}</Text>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <AnalogClock
                            clockSize={ deviceHeight / 3.8 }
                            hourHandLength={ 40 * aspectHeight }
                            hourHandWidth={ 4 }
                            hourHandColor={ 'rgb(255,115,38)' }
                            minuteHandLength={ 50 * aspectHeight }
                            minuteHandWidth={ 3 }
                            minuteHandColor={ 'rgb(255,115,38)' }
                            secondHandLength={ 60 * aspectHeight }
                            secondHandWidth={ 1 }
                            secondHandColor={ 'rgb(255,115,38)' }
                            clockCentreColor={ 'rgb(84,180,205)' }
                        />
                    </View>
                </View>

                <View style={styles.bottomViewContainer}>

                    <View style={styles.bottomHeaderContainer}>
                        <Text style={styles.taskSuperText}>
                            {"Tasks"}
                            <Text style={{ fontWeight: '300' }}>{" List"}</Text>
                        </Text>
                        <TouchableOpacity style={styles.plusButtonTouchable} onPress={() => { this.onAddTaskButtonPress() }}>
                            <Image style={styles.plusIcon} source={PLUS_ICON} />
                        </TouchableOpacity>
                    </View>

                    {listContainer}

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    topViewContainer: {
        width: '100%',
        height: '45%',
    },
    timeStatusText: {
        fontSize: 22,
        color: GRAY_COLOR,
        marginLeft: 20,
        marginTop: 10
    },
    userNameText: {
        color: BLUE_COLOR,
        fontSize: 16,
        marginLeft: 20,
        marginTop: 5
    },
    bottomViewContainer: {
        flex: 1,
        width: '100%',
    },
    bottomHeaderContainer: {
        width: '100%',
        height: 35,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    listContainerView: {
        flex: 1,
        marginTop: 10
    },
    noDataFoundText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500'
    },
    taskSuperText: {
        color: 'gray',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 20
    },
    plusButtonTouchable: {
        height: 30,
        width: 30,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    plusIcon: {
        height: '70%',
        width: '70%'
    },
    cellContainer: {
        width: (deviceWidth / 1.7),
        height: deviceHeight * 0.40,
        marginLeft: 15,
    },
    cellcontentContainer: {
        position: 'absolute',
        height: '90%',
        width: '90%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: SHADOW_COLOR,
        alignItems: 'center'
    },
    shadowView: {
        marginLeft: '5%',
        marginTop: '5%',
        height: '90%',
        width: '90%',
        backgroundColor: SHADOW_COLOR,
        borderRadius: 10
    },
    cellHeaderContainer: {
        width: '85%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cellTitle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    cellAddButtonTouchable: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    todoCellContainer: {
        width: '100%',
        height: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    todoCheckBox: {
        height: 12,
        width: 12,
    },
    todoTitle: {
        fontSize: 12,
        marginLeft: 10,
        flex: 1,
    }
});
