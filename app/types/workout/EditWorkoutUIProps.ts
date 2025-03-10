export interface EditWorkoutUIProps {
    name: string;
    description: string;
    duration: string;
    intensity: string;
    exercises: string[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    showIntensityDropdown: boolean;
    onNameChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    onDurationChange: (text: string) => void;
    onIntensityChange: (intensity: string) => void;
    onToggleIntensityDropdown: () => void;
    onAddExercise: () => void;
    onRemoveExercise: (index: number) => void;
    onExerciseChange: (text: string, index: number) => void;
    onSubmit: () => void;
    onCancel: () => void;
    onRetry?: () => void;  // Optional prop with ? suffix
}