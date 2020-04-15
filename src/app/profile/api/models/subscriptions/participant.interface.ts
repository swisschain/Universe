import { ParticipantRole } from './participant-role.enum';

export interface Participant {
    userId: string;
    name: string;
    email: string;
    role: ParticipantRole
}