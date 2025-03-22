import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
    // Background & Container Styles
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    // Typography Styles
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 24,
        marginTop: 20,
        textAlign: 'center',
        letterSpacing: 1,
    },
    loadingText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#DDDDDD',
    },

    // Form Elements
    form: {
        width: '100%',
    },
    formGroup: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 16,
        color: 'white',
    },
    error: {
        color: '#ff6b6b',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },

    // Button Styles
    updateButton: {
        backgroundColor: 'rgba(33, 150, 243, 0.9)',  // Material Blue
        paddingVertical: 14,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.5)',
    },
    // Add this new style for the trainer button
    trainerButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',  // Material Green
        paddingVertical: 14,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.5)',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: 'rgba(244, 67, 54, 0.9)',  // Material Red
        paddingVertical: 14,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(244, 67, 54, 0.5)',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    debugContainer: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'absolute',
        top: 40,
        right: 10,
        borderRadius: 5,
    },
    debugText: {
        color: 'white',
        fontSize: 12,
    },
    notTrainerText: {
        color: '#aaa',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 14,
    }
});