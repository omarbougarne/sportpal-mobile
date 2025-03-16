import React from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, 
  TouchableOpacity, ActivityIndicator, ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SpecializationType, CertificationType } from '@/app/types/trainer';

interface EditTrainerUIProps {
  name: string;  // Add this new prop
  bio: string;
  yearsOfExperience: string;
  hourlyRate: string;
  selectedSpecializations: SpecializationType[];
  certifications: {
    type: CertificationType;
    name: string;
    issueDate: Date;
    expiryDate?: Date;
  }[];
  showSpecializationsDropdown: boolean;
  showCertificationTypeDropdown: boolean;
  selectedCertType: CertificationType;
  currentCertName: string;
  currentCertIssueDate: Date;
  currentCertExpiryDate?: Date;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isAuthorized: boolean;
  
  onNameChange: (text: string) => void;  // Add this handler
  onBioChange: (text: string) => void;
  onYearsOfExperienceChange: (text: string) => void;
  onHourlyRateChange: (text: string) => void;
  onToggleSpecialization: (specialization: SpecializationType) => void;
  onToggleSpecializationsDropdown: () => void;
  onToggleCertificationTypeDropdown: () => void;
  onCertTypeSelect: (type: CertificationType) => void;
  onCertNameChange: (text: string) => void;
  onCertIssueDateChange: (date: Date) => void;
  onCertExpiryDateChange: (date: Date | undefined) => void;
  onAddCertification: () => void;
  onRemoveCertification: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onRetry: () => void;
}

export default function EditTrainerUI({
  name,  // Add this
  bio,
  yearsOfExperience,
  hourlyRate,
  selectedSpecializations,
  certifications,
  showSpecializationsDropdown,
  showCertificationTypeDropdown,
  selectedCertType,
  currentCertName,
  currentCertIssueDate,
  currentCertExpiryDate,
  loading,
  saving,
  error,
  isAuthorized,
  onNameChange,  // Add this
  onBioChange,
  onYearsOfExperienceChange,
  onHourlyRateChange,
  onToggleSpecialization,
  onToggleSpecializationsDropdown,
  onToggleCertificationTypeDropdown,
  onCertTypeSelect,
  onCertNameChange,
  onCertIssueDateChange,
  onCertExpiryDateChange,
  onAddCertification,
  onRemoveCertification,
  onSubmit,
  onCancel,
  onRetry
}: EditTrainerUIProps) {
  // Helper to format dates for display
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Render content based on loading, error, and authorization status
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading trainer profile...</Text>
        </View>
      );
    }
    
    if (!isAuthorized) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>Unauthorized Access</Text>
          <Text style={styles.subText}>You don't have permission to edit this profile</Text>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (error && !saving) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>Error</Text>
          <Text style={styles.subText}>{error}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, {backgroundColor: 'rgba(150, 150, 150, 0.7)', marginLeft: 10}]} 
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Trainer Profile</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={onNameChange}
            placeholder="Your name as a trainer"
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio*</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={onBioChange}
            placeholder="Tell clients about your training philosophy, experience, and approach..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Years of Experience*</Text>
          <TextInput
            style={styles.input}
            value={yearsOfExperience}
            onChangeText={onYearsOfExperienceChange}
            placeholder="e.g. 5"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hourly Rate ($)</Text>
          <TextInput
            style={styles.input}
            value={hourlyRate}
            onChangeText={onHourlyRateChange}
            placeholder="e.g. 50"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Specializations*</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={onToggleSpecializationsDropdown}
          >
            <Text style={styles.dropdownText}>
              {selectedSpecializations.length > 0
                ? `${selectedSpecializations.length} selected`
                : 'Select specializations'}
            </Text>
            <Ionicons
              name={showSpecializationsDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          
          {showSpecializationsDropdown && (
            <View style={styles.dropdownList}>
              {Object.values(SpecializationType).map((specialization) => (
                <TouchableOpacity
                  key={specialization}
                  style={styles.dropdownItem}
                  onPress={() => onToggleSpecialization(specialization)}
                >
                  <Text style={styles.dropdownItemText}>{specialization}</Text>
                  {selectedSpecializations.includes(specialization) && (
                    <Ionicons name="checkmark" size={20} color="#4a90e2" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {selectedSpecializations.length > 0 && (
            <View style={styles.selectedTags}>
              {selectedSpecializations.map((specialization) => (
                <View key={specialization} style={styles.tag}>
                  <Text style={styles.tagText}>{specialization}</Text>
                  <TouchableOpacity onPress={() => onToggleSpecialization(specialization)}>
                    <Ionicons name="close-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Certifications</Text>
          
          <View style={styles.certificationForm}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={onToggleCertificationTypeDropdown}
            >
              <Text style={styles.dropdownText}>
                {selectedCertType || 'Select certification type'}
              </Text>
              <Ionicons
                name={showCertificationTypeDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
            
            {showCertificationTypeDropdown && (
              <View style={styles.dropdownList}>
                {Object.values(CertificationType).map((certType) => (
                  <TouchableOpacity
                    key={certType}
                    style={styles.dropdownItem}
                    onPress={() => onCertTypeSelect(certType)}
                  >
                    <Text style={styles.dropdownItemText}>{certType}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <TextInput
              style={[styles.input, styles.certInput]}
              value={currentCertName}
              onChangeText={onCertNameChange}
              placeholder="Certification name"
              placeholderTextColor="#999"
            />
            
            <View style={styles.dateContainer}>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Issue Date:</Text>
                <TouchableOpacity 
                  style={styles.datePicker}
                  onPress={() => {
                    /* Add DatePicker component here */
                    // For now, let's assume we have a function that shows a date picker
                  }}
                >
                  <Text style={styles.dateText}>{formatDate(currentCertIssueDate)}</Text>
                  <Ionicons name="calendar" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Expiry Date (optional):</Text>
                <TouchableOpacity 
                  style={styles.datePicker}
                  onPress={() => {
                    /* Add DatePicker component here */
                  }}
                >
                  <Text style={styles.dateText}>{formatDate(currentCertExpiryDate)}</Text>
                  <Ionicons name="calendar" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddCertification}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Certification</Text>
            </TouchableOpacity>
          </View>
          
          {certifications.length > 0 && (
            <View style={styles.certificationsList}>
              {certifications.map((cert, index) => (
                <View key={index} style={styles.certificationItem}>
                  <View style={styles.certificationHeader}>
                    <Text style={styles.certificationName}>{cert.name}</Text>
                    <TouchableOpacity onPress={() => onRemoveCertification(index)}>
                      <Ionicons name="trash" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.certificationDetails}>
                    {cert.type} • Issued: {formatDate(cert.issueDate)}
                    {cert.expiryDate ? ` • Expires: ${formatDate(cert.expiryDate)}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={onCancel}
            disabled={saving}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.submitButton, saving && styles.disabledButton]}
            onPress={onSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    );
  };

  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {renderContent()}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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