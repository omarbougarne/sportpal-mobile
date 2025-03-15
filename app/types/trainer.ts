export enum CertificationType {
    ACE = 'ACE',
    NASM = 'NASM',
    ACSM = 'ACSM',
    NSCA = 'NSCA',
    ISSA = 'ISSA',
    OTHER = 'OTHER',
    Personal = "Personal"
}

export enum SpecializationType {
    STRENGTH = 'Strength Training',
    CARDIO = 'Cardiovascular Training',
    FLEXIBILITY = 'Flexibility Training',
    WEIGHT_LOSS = 'Weight Loss',
    BODYBUILDING = 'Bodybuilding',
    SPORTS_SPECIFIC = 'Sports Specific',
    REHABILITATION = 'Rehabilitation',
    YOGA = 'Yoga',
    PILATES = 'Pilates',
    NUTRITION = 'Nutrition',
    CROSSFIT = 'CrossFit',
    HIIT = 'HIIT',
    SENIOR_FITNESS = 'Senior Fitness',
    YOUTH_FITNESS = 'Youth Fitness',
    FUNCTIONAL = 'Functional Training'
}

export interface Certification {
    type: CertificationType;
    name: string;
    issueDate: Date;
    expiryDate?: Date;
    certificateUrl?: string;
}

export interface Review {
    userId: string; // Use string instead of Types.ObjectId
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface TimeSlot {
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string; // Format: "HH:MM" in 24h format
    endTime: string; // Format: "HH:MM" in 24h format
}

export interface Trainer {
    _id?: string | null;
    isNew: boolean;
    userId: string; // Use string instead of Types.ObjectId
    bio: string;
    yearsOfExperience: number;
    certifications?: Certification[];
    specializations: SpecializationType[];
    availability?: TimeSlot[];
    hourlyRate?: number;
    reviews: Review[];
    averageRating: number;
    workouts: string[]; // Use string[] instead of Types.ObjectId[]
    location?: string; // Use string instead of Types.ObjectId
    introVideo?: string;
    galleryImages?: string[];
    isVerified: boolean;
}