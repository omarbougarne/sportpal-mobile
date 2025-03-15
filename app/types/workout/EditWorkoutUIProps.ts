export interface EditWorkoutUIProps {
    name: string;
    description: string;
    duration: string;
    intensity: string;
    exercises: string[];
    loading: boolean;
    saving: boolean;
    error: string;
    isAuthorized: boolean; // Add this new prop
    showIntensityDropdown: boolean;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDurationChange: (value: string) => void;
    onIntensityChange: (value: string) => void;
    onToggleIntensityDropdown: () => void;
    onAddExercise: () => void;
    onRemoveExercise: (index: number) => void;
    onExerciseChange: (value: string, index: number) => void;
    onSubmit: () => void;
    onCancel: () => void;
    onRetry?: () => void;
}