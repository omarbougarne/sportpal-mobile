import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#DDDDDD',
        fontWeight: 'bold',
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 107, 107, 0.3)',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
    },
    errorMessage: {
        color: '#ff6b6b',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 16,
        color: '#DDDDDD',
        textAlign: 'center',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#DDDDDD',
    },
    input: {
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 5,
        color: 'white',
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 5,
        padding: 12,
    },
    dropdownText: {
        color: 'white',
        fontSize: 16,
    },
    dropdownList: {
        backgroundColor: 'rgba(34, 34, 34, 0.95)',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 5,
        marginTop: 5,
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    dropdownItemText: {
        color: 'white',
        fontSize: 16,
    },
    selectedTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(33, 150, 243, 0.3)',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.5)',
    },
    tagText: {
        color: 'white',
        fontSize: 14,
        marginRight: 5,
    },
    certificationForm: {
        backgroundColor: 'rgba(34, 34, 34, 0.7)',
        padding: 12,
        borderRadius: 5,
        marginBottom: 15,
    },
    certInput: {
        marginTop: 10,
    },
    dateContainer: {
        marginTop: 10,
    },
    dateField: {
        marginBottom: 10,
    },
    dateLabel: {
        color: '#DDDDDD',
        marginBottom: 5,
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 5,
        padding: 12,
    },
    dateText: {
        color: 'white',
        fontSize: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        borderRadius: 5,
        padding: 12,
        marginTop: 10,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    certificationsList: {
        marginTop: 15,
    },
    certificationItem: {
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        borderRadius: 5,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    certificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    certificationName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    certificationDetails: {
        color: '#BBBBBB',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'rgba(150, 150, 150, 0.7)',
        marginRight: 8,
    },
    submitButton: {
        backgroundColor: 'rgba(33, 150, 243, 0.9)',
        marginLeft: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    button: {
        backgroundColor: 'rgba(33, 150, 243, 0.9)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.5)',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    spacer: {
        height: 40,
    }
});