import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import colors from '../../theme/colors'
import _debounce from 'lodash.debounce'
import useMapService from '../../hooks/api/mapService'
import * as Location from 'expo-location'

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [errorState, setErrorState] = useState({ isShown: false, message: "" })

    const mapService = useMapService();

    const [predictions, setPredictions] = useState([])

    const PredictionItem = ({ main_text, secondary_text }) => (
        <TouchableOpacity activeOpacity={0.5} style={{ borderBottomWidth: 1, borderColor: colors.tertiary, paddingBottom: 10, paddingRight: 50, marginVertical: 5 }}>
            <Text style={{ fontSize: 15, fontWeight: '600' }}>{main_text}</Text>
            <Text numberOfLines={1}>{secondary_text}</Text>
        </TouchableOpacity>
    )

    const handleDebounceFn = async (input) => {
        if (!input) return;
        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: 1 })
            const data = await mapService.autoComplete({ lat: location.coords.latitude, lng: location.coords.longitude }, input)
            setPredictions(data)
        } catch (error) {
            if (error.status === 429) {
                setErrorState({ message: error.error, isShown: true })
                setTimeout(() => {
                    setErrorState({ isShown: false })
                }, 5000);
            }
        }
    }

    const debounceFn = useCallback(_debounce(handleDebounceFn, 400), []);

    const handleTextInput = (t) => {
        setSearchTerm(t)
        debounceFn(t)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.searchContainer}>
                    <FontAwesome name='search' size={22} color={colors.secondary} style={styles.searchIcon} />
                    <TextInput placeholder='Search for a place' autoCapitalize='sentences' value={searchTerm} onChangeText={handleTextInput} autoCorrect={false} style={styles.searchInput} />
                </View>
                <ScrollView style={styles.predictionsContainer} overScrollMode="never">
                    {predictions.map(prediction => <PredictionItem main_text={prediction.structured_formatting.main_text} secondary_text={prediction.structured_formatting.secondary_text} key={prediction.reference} />)}
                </ScrollView>
            </View>
            {errorState.isShown && <View style={styles.errorContainer}><Text style={styles.errorText}>{errorState.message}</Text></View>}
        </SafeAreaView>
    )
}

export default Search

const styles = StyleSheet.create({
    container: { flex: 1 },
    topContainer: { flex: 1 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, borderRadius: 10, marginTop: 10, },
    searchIcon: { marginHorizontal: 10 },
    searchInput: { padding: 10, width: '100%' },
    predictionsContainer: { marginHorizontal: 20, marginTop: 20 },
    errorContainer: { backgroundColor: 'red', minHeight: 50, alignItems: 'center', justifyContent: 'center' },
    errorText: { color: 'white', textAlign: 'center', fontWeight: '600', width: '100%' }
})