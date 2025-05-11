import {Dimensions, Platform, StatusBar} from "react-native";

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
export const { width, height } = Dimensions.get('window');
export const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 0;
