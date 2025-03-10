export interface Workout {
    _id: string;
    name: string;
    description?: string;
    duration?: number;
    intensity?: string;
    exercises?: string[];
    creator: string;
    createdAt: Date;
    updatedAt: Date;
    caloriesBurn?: number; // Add this property
    workoutType?: string; // Add this property too
}