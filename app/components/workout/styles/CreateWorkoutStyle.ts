import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    // All your existing styles...
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    exerciseInput: {
        flex: 1,
    },
    removeButton: {
        marginLeft: 10,
        padding: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    addButtonText: {
        color: '#4caf50',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    customPickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    pickerText: {
        fontSize: 16,
    },
    dropdownArrow: {
        fontSize: 14,
    },
    dropdownList: {
        position: 'absolute',
        top: 85,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedDropdownItem: {
        backgroundColor: '#e8f4f8',
    },
    optionText: {
        fontSize: 16,
    },
    selectedOptionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    submitButton: {
        backgroundColor: '#4caf50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.7,
    },
    cancelButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
    spacer: {
        height: 40,
    },
});