import { Event, EventInputData, UpdateEventData } from "./events.types";
import { findUserById } from "../users/users.repository.ts";
import { NotFoundError } from "../../errors/not-found-error.ts";
import { findBusinessById } from "../businesses/business.repository.ts";
import {
  createEvent,
  deleteEvent,
  fetchEventById,
  findEventTypeIdByEventTypeName,
  getEventMedia,
  getEvents,
  updateEvent,
  uploadEventMedia,
} from "./events.repository.ts";
import { BadRequestError } from "../../errors/bad-request-error.ts";
import { ForbiddenError } from "../../errors/forbidden-error.ts";
import { cloudinaryUploader } from "../../utils/cloudinary-uploader.ts";

export async function createEventService(
  data: EventInputData,
): Promise<Event | null> {
  const user = await findUserById(data.userId);
  if (!user) {
    throw new NotFoundError("can not found user");
  }

  let business;
  if (data.businessId) {
    business = await findBusinessById(data.businessId);
    if (!business) {
      throw new NotFoundError("can not find business");
    }
  }

  const eventCategoryId = await findEventTypeIdByEventTypeName(data.eventType);
  if (!eventCategoryId) {
    throw new BadRequestError("wrong event type");
  }

  let uploadResult;
  if (data.media) {
    uploadResult = await cloudinaryUploader(data.media, "events");
  }

  const isPaid = Boolean(data.isPaid);

  const event = await createEvent({
    ...data,
    isPaid,
    eventTypeId: eventCategoryId,
  });
  if (event.id) {
    if (uploadResult) {
      await uploadEventMedia({
        eventId: Number(event.id),
        media: {
          mediaUrl: uploadResult.secure_url,
          cloudId: uploadResult.public_id,
        },
      });
    }
  }

  return event;
}

//*fetch eventById Service
export async function fetchEventByIdService(eventId: number) {
  return await fetchEventById(eventId);
}

//*get eventsFeed

export async function fetchEventFeedService(limit: number, cursor?: number) {
  const events = await getEvents(limit, cursor);

  const eventId = events.map((e) => e.id);

  const media = await getEventMedia(eventId);

  const mediaMap = new Map<number, any[]>();

  for (const image of media) {
    if (!mediaMap.has(image.event_id)) {
      mediaMap.set(image.event_id, []);
    }

    mediaMap.get(image.event_id)?.push({
      cloudId: image.cloud_id,
      mediaUrl: image.media_url,
    });
  }

  const response = events.map((event) => {
    return {
      ...event,

      media: mediaMap.get(event.id) || [],
    };
  });

  return response;
}

//*updateEventsService

export async function updateEventService(data: UpdateEventData) {
  const event = await fetchEventById(data.eventId);
  console.log("logging event ticket Price :)", data.ticketPrice);
  if (!event) {
    throw new NotFoundError("can not find event");
  }

  if (event.user_id != data.userId) {
    throw new ForbiddenError();
  }

  const eventTypeId = await findEventTypeIdByEventTypeName(data.eventType);
  if (!eventTypeId) {
    throw new BadRequestError("Invalid Event type");
  }

  return await updateEvent({ ...data, eventTypeId });
}

//*deleteEvents service

export async function deleteEventService(data: {
  eventId: number;
  userId: number;
}) {
  const event = await fetchEventById(data.eventId);
  console.log("logging the event :", event);
  if (!event) {
    throw new NotFoundError("can not find event");
  }

  if (event.user_id != data.userId) {
    throw new ForbiddenError();
  }

  return await deleteEvent(data);
}
