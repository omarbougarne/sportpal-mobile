import React from 'react';
import { Button, Alert } from 'react-native';
import { deleteGroup } from '@/app/services/api/groupApi';
import { useRouter } from 'expo-router';

interface DeleteGroupProps {
  groupId: string;
  onDeleted?: () => void;
  buttonTitle?: string;
}

export default function DeleteGroup({ 
  groupId, 
  onDeleted, 
  buttonTitle = "Delete Group" 
}: DeleteGroupProps) {
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroup(groupId);
              
              if (onDeleted) {
                onDeleted();
              } else {
                router.push('/');
              }
            } catch (error) {
              console.error('Failed to delete group:', error);
              Alert.alert('Error', 'Failed to delete group. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Button 
      title={buttonTitle} 
      onPress={handleDelete} 
      color="red"
    />
  );
}