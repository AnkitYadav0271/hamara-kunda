import type { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../../errors/not-authorised-error";
import {
  createEventService,
  deleteEventService,
  fetchEventByIdService,
  fetchEventFeedService,
  updateEventService,
} from "./events.services";

import { BadRequestError } from "../../errors/bad-request-error";

export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId ? Number(req.userId) : null;
    const businessId = req.params.businessId
      ? Number(req.params.businessId)
      : null;

    if (!userId) {
      throw new NotAuthorizedError();
    }

    const file = req.file?.buffer;

    let {
      eventTitle,
      eventDescription,
      eventAddress,
      eventType,
      isPaid,
      ticketPrice,
      startAt,
      endAt,
    } = req.body;

    const event = await createEventService({
      eventTitle,
      eventDescription,
      eventAddress,
      eventType,
      isPaid,
      ticketPrice,
      startAt,
      endAt,
      media: file,
      userId,
    });

    return res
      .status(201)
      .json({ success: true, message: "event created successfully", event });
  } catch (err) {
    next(err);
  }
};

//*FetchEventByIdController

export const FetchEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const eventId = req.params.eventId ? Number(req.params.eventId) : null;

  if (!eventId) {
    throw new BadRequestError("eventId is missing");
  }

  try {
    const event = await fetchEventByIdService(eventId);
    return res
      .status(200)
      .json({ success: false, message: "got the event", event });
  } catch (err) {
    next(err);
  }
};

//*fetchEventFeedService

export const fetchEventFeedController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

  try {
    const response = await fetchEventFeedService(limit, cursor);
    return res.status(200).json({
      success: true,
      message: "got the events feed",
      events: response,
    });
  } catch (err) {
    next(err);
  }
};

export const updateEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  if (!userId) {
    throw new NotAuthorizedError();
  }

  const eventId = req.params.eventId ? Number(req.params.eventId) : null;

  if (!eventId) {
    throw new BadRequestError("eventId is missing");
  }

  let isPaid = Boolean(req.body?.isPaid);
  //*to ensure we do not get entered any accidental amount in a free event
  let ticketPrice = req.body.ticketPrice;
  if (!isPaid) {
    ticketPrice = null;
  }


  try {
    const updatedEvent = await updateEventService({
      ticketPrice,
      ...req.body,

      userId,
      eventId,
    });

    return res.status(200).json({
      success: true,
      message: "updated the event successfully",
      event: updatedEvent,
    });
  } catch (err) {
    next(err);
  }
};

//*deleteEventsController

export const deleteEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId ? Number(req.userId) : null;
  const eventId = req.params.eventId ? Number(req.params.eventId) : null;

  if (!userId) {
    throw new NotAuthorizedError();
  }

  if (!eventId) {
    throw new BadRequestError("eventId is missing");
  }

  try {
    const deletedEvent = await deleteEventService({ userId, eventId });

    return res.status(200).json({
      success: true,
      message: "deleted Event successfully",
      event: deletedEvent,
    });
  } catch (err) {
    next(err);
  }
};
