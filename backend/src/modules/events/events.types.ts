export interface Event {
  id: number;
  user_id: number;
  business_id: number | null;
  event_title: string;
  event_description?: string;
  event_address?: string;
  event_type_id: number;
  is_public: boolean;
  is_paid: boolean;
  ticket_price: number;
  start_at: Date;
  end_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface EventInputDataRepo {
  userId: number;
  businessId?: number;
  eventTitle: string;
  eventDescription?: string;
  eventAddress?: string;
  eventTypeId: number;
  isPaid: boolean;
  ticketPrice?: number;
  startAt: string;
  endAt: string;
}

export interface EventInputData {
  userId: number;
  businessId?: number;
  eventTitle: string;
  eventDescription?: string;
  eventAddress?: string;
  eventType: EventCategoryName;
  isPaid: boolean;
  ticketPrice?: number;
  startAt: string;
  endAt: string;
  media?: Buffer;
}

export interface UploadEventMedia {
  media: {
    mediaUrl: string;
    cloudId: string;
  };
  eventId: number;
}

export type EventCategoryName =
  | "Festival"
  | "Religious"
  | "Cultural"
  | "Sports"
  | "Education"
  | "Career"
  | "Health"
  | "Social Service"
  | "Government"
  | "Business"
  | "Community"
  | "Workshop"
  | "Competition"
  | "Political"
  | "Other";

export interface EventMediaInputData {
  eventId: number;
  mediaUrl: string;
  cloudId: string;
}

export interface UpdateEventDataRepo {
  userId: number;
  eventId: number;
  businessId?: number;
  eventTitle: string;
  eventDescription?: string;
  eventAddress?: string;
  eventTypeId: number;
  isPaid: boolean;
  ticketPrice?: number;
  startAt: string;
  endAt: string;
}

export interface UpdateEventData {
  userId: number;
  eventId: number;
  businessId?: number;
  eventTitle: string;
  eventDescription?: string;
  eventAddress?: string;
  eventType: EventCategoryName;
  isPaid: boolean;
  ticketPrice?: number;
  startAt: string;
  endAt: string;
}
