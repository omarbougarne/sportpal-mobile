export interface Group {
    _id: string;
    name: string;
    sport: string;
    activity: string;
    location: { city: string };
    members: []
}