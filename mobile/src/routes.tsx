import React, { useState, useEffect } from 'react';
import { 
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,

    } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack'

import {
    Provider as PaperProvider,
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme,
    useTheme
    } from 'react-native-paper';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';


const AppStack = createStackNavigator();

const Routes = () => {

    const [isEnabledDarkTheme, setIsEnabledDarkTheme] = useState(false);

    const toggleSwitch = () => setIsEnabledDarkTheme(previousState => !previousState);

    const CustomDefaultTheme = {
        ... NavigationDefaultTheme,
        ... PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            text: '#322153',
            border: '#34CB79',
            toggleSwitch,
            isEnabledDarkTheme
        },
        dark: isEnabledDarkTheme
    }

    const CustomDarkTheme = {
        ... NavigationDarkTheme,
        ... PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            text: '#F5F5F5',
            border: '#222841',
            background: '#222841',
            card: '#30475E',
            toggleSwitch,
            
        },
        dark: isEnabledDarkTheme
    }

    const paperTheme = useTheme();

    const theme = isEnabledDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <AppStack.Navigator 
                    headerMode="none"
                    
                >
                    <AppStack.Screen name="Home" component={Home} />
                    <AppStack.Screen name="Points" component={Points} />
                    <AppStack.Screen name="Detail" component={Detail} />
                </AppStack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    )
}

export default Routes;