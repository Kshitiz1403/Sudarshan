import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import colors from '../theme/colors';

const OtpInput = ({ code, setCode, maximumLength, setIsPinReady }) => {
    const boxArray = new Array(maximumLength).fill(0);
    const inputRef = useRef();

    const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

    const handleOnPress = () => {
        setIsInputBoxFocused(true);
        inputRef.current.focus();
    };

    const handleOnBlur = () => {
        setIsInputBoxFocused(false);
    };

    useEffect(() => {
        // update pin ready status
        setIsPinReady(code.length === maximumLength);
        // clean up function
        return () => {
            setIsPinReady(false);
        };
    }, [code]);


    const boxDigit = (_, index) => {
        const emptyInput = "";
        const digit = code[index] || emptyInput;

        const isCurrentValue = index === code.length;
        const isLastValue = index === maximumLength - 1;
        const isCodeComplete = code.length === maximumLength;

        const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

        const SplitBoxes = ({ children }) => <View style={{ borderColor: colors.tertiary, borderWidth: 1, borderRadius: 50, padding: 9, width: 50, height: 50, marginHorizontal:5 }}>{children}</View>
        const SplitBoxesFocused = ({ children }) => <View style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 50, padding: 9, width: 50, height: 50, marginHorizontal:5 }}>{children}</View>

        const StyledSplitBoxes =
            isInputBoxFocused && isValueFocused ? SplitBoxesFocused : SplitBoxes;
        return (
            <StyledSplitBoxes key={index}>
                <Text style={{ fontSize: 20, textAlign: 'center', color: 'black' }}>{digit}</Text>
            </StyledSplitBoxes>
        );
    };
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Pressable style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }} onPress={handleOnPress}>
                {boxArray.map(boxDigit)}
            </Pressable>
            <TextInput style={{ position: 'absolute', opacity: 0 }}
                keyboardType='numeric'
                value={code}
                onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))}
                maxLength={maximumLength}
                ref={inputRef}
                onBlur={handleOnBlur}
            />
        </View>
    )
}

export default OtpInput
