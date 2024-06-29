import { Participant } from "./Participant.model";

export type Team = {
    id: string;
    teamName: string;
    createdById: string;
    participants: Participant[]
}