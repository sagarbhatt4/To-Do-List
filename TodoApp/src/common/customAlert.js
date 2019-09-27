import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';

import { GREEN_COLOR } from '../common/color';

export default class CustomAlert extends React.Component {

    onOkButtonTap() {
        const { onOkButtonTap } = this.props;
        onOkButtonTap();
    }

    onCancelButtonTap() {
        const { onCancelButtonTap } = this.props;
        onCancelButtonTap();
    }

    onTextInputChange(text) {
        const { inputText } = this.props;
        inputText = text

    }
    onDescriptionTextInputChange(text) {
        const { inputDescriptionText } = this.props;
        inputDescriptionText = text
    }

    render() {
        const { alertBody, okButtonTitle, cancelButtonTitle, inputText, isWithDescriptionInputText, titlePlaceholder, descriptionPlaceholder } = this.props;
        var DescriptionView = <View />
        var alertHeight = 170

        if (isWithDescriptionInputText) {
            DescriptionView = <TextInput
                style={{ width: '80%', height: 100, marginTop: 20, padding: -5, textAlignVertical: 'top' }}
                multiline={true}
                placeholder={descriptionPlaceholder}
                onChangeText={(text) => { this.props.onDescriptionTextInputChange(text) }}
            />
            alertHeight = 290
        }

        const offset = Platform.OS == 'ios' ? 30 : 0;

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}  behavior="padding" enabled keyboardVerticalOffset={offset}>
                    <View style={[styles.alertBodyContainer, { height: alertHeight }]}>
                        <Text style={styles.alertBodyText}>{alertBody}</Text>

                        <TextInput
                            style={{ width: '80%', height: 50, marginTop: 20, padding: -5, textAlignVertical: 'top' }}
                            multiline={true}
                            placeholder={titlePlaceholder}
                            onChangeText={(text) => { this.props.onTextInputChange(text) }}
                            autoFocus={ true }
                        />

                        { DescriptionView }

                        <View style={styles.buttonContainer} >
                            <TouchableOpacity style={styles.cancelButtonContainer} onPress={() => { this.onCancelButtonTap() }}>
                                <Text style={styles.buttonText}>{cancelButtonTitle}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.okButtonContainer} onPress={() => { this.onOkButtonTap() }}>
                                <Text style={styles.buttonText}>{okButtonTitle}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </KeyboardAvoidingView>
            </View>
        )

    }
}

CustomAlert.propTypes = {
    onOkButtonTap: PropTypes.func,
    onCancelButtonTap: PropTypes.func,
    onTextInputChange: PropTypes.func,
    alertBody: PropTypes.string,
    okButtonTitle: PropTypes.string,
    cancelButtonTitle: PropTypes.string,
    inputText: PropTypes.string,
    isWithDescriptionInputText: PropTypes.bool,
    inputDescriptionText: PropTypes.string,
    onDescriptionTextInputChange: PropTypes.func,
    titlePlaceholder: PropTypes.string,
    descriptionPlaceholder: PropTypes.string
}

CustomAlert.defaultProps = {
    onOkButtonTap: null,
    onCancelButtonTap: null,
    onTextInputChange: null,
    alertBody: 'Title',
    okButtonTitle: 'OK',
    cancelButtonTitle: 'CANCEL',
    inputText: '',
    isWithDescriptionInputText: false,
    inputDescriptionText: '',
    onDescriptionTextInputChange: null,
    titlePlaceholder: '',
    descriptionPlaceholder: ''

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertBodyContainer: {
        // height: 170, 
        width: '70%',
        backgroundColor: 'white',
        alignItems: 'center'
    },

    buttonContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    alertBodyText: {
        width: '80%',
        marginTop: 20,
        fontSize: 15,
        fontWeight: 'bold'
    },
    okButtonContainer: {
        marginRight: 10,
        height: 35,
        width: 50,
        justifyContent: 'center'
    },
    cancelButtonContainer: {
        marginRight: 5,
        height: 35,
        width: 60,
        justifyContent: 'center'
    },
    buttonText: {
        color: GREEN_COLOR,
        width: '100%',
        textAlign: 'center'
    }
})