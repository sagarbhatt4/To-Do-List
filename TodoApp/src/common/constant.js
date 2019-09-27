import { Dimensions } from 'react-native';

// Device Height/Width
const deviceHeight  = Dimensions.get('window').height;
const deviceWidth   = Dimensions.get('window').width;

const aspectWidth = deviceWidth/375;
const aspectHeight = deviceHeight/667;

// Images
const PLUS_ICON             = require('../../res/homeScreen/plus_ic.png');
const PLUS_BLANK_ICON       = require('../../res/homeScreen/plus_blank_ic.png');

const BLANK_CHECKBOX_ICON   = require('../../res/homeScreen/blank_check.png');
const FILL_CHECKBOX_ICON    = require('../../res/homeScreen/fill_check.png');

const AVATAR_ICON           = require('../../res/todoDetailScreen/avatar_ic.png');
const BACK_ICON           = require('../../res/todoDetailScreen/back_button_ic.png')

export {
    deviceHeight,
    deviceWidth,

    aspectWidth,
    aspectHeight,

    PLUS_ICON,
    PLUS_BLANK_ICON,
    BLANK_CHECKBOX_ICON,
    FILL_CHECKBOX_ICON,
    AVATAR_ICON,
    BACK_ICON
}