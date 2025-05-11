import React, {ReactElement, useRef} from 'react';
import {SafeAreaView, TouchableOpacity, View, Text, Animated, Image} from 'react-native';
import {STATUSBAR_HEIGHT} from "../TrucoScreen/constants.ts";
import {useNavigation} from "@react-navigation/native";
import {styles} from "./styles.ts";
import Icon from "react-native-vector-icons/FontAwesome";

interface HomeProps {
}

const Home: React.FC<HomeProps> = (): ReactElement => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.backgroundContainer}>
            <View style={{ height: STATUSBAR_HEIGHT }} />
            <View style={styles.overlay} />

            <Animated.View style={[styles.headerContainer, { opacity: 1 }]}>
                <View style={styles.header}>
                    <View style={{}} >
                        <Text style={styles.title}>Show, e ai galera?</Text>
                        <Text style={styles.titleSec}>Vamos jogar o que hoje ai? show valeu</Text>
                    </View>
                </View>
            </Animated.View>
            <View style={{height: 20}} />
            <TouchableOpacity onPress={() => navigation.navigate('TrucoScreen')} style={styles.button}>
                <Text style={styles.titleButton}>Truco</Text>
            </TouchableOpacity>
            <View style={{height: 20}} />
            <TouchableOpacity onPress={() => navigation.navigate('LittleFuckScreen')} style={styles.button}>
                <Text style={styles.titleButton}>Fodinha</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Home;

