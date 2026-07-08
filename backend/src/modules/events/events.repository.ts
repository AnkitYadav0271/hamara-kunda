import { pool } from "../../config/db.ts";
import {
  Event,
  EventInputDataRepo,
  UpdateEventDataRepo,
  UploadEventMedia,
} from "./events.types.ts";

export async function createEvent(data: EventInputDataRepo) {
  const query = `INSERT INTO events(user_id,business_id,event_title,event_description,
                       event_address,event_type_id,is_paid,ticket_price,start_at,end_at) 
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;
  const values = [
    data.userId,
    data.businessId,
    data.eventTitle,
    data.eventDescription,
    data.eventAddress,
    data.eventTypeId,
    data.isPaid,
    data.ticketPrice,
    data.startAt,
    data.endAt,
  ];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*getEventTypeIdByName

export async function findEventTypeIdByEventTypeName(eventTypeName: string) {
  const query = `SELECT id FROM event_types WHERE category_name = $1`;
  const values = [eventTypeName];

  try {
    const typeId = (await pool.query(query, values)).rows[0];
    return typeId?.id;
  } catch (err) {
    throw err;
  }
}

//*uploadMedia

export async function uploadEventMedia(data: UploadEventMedia) {
  const query = `INSERT INTO event_media(media_url,cloud_id,event_id) VALUES($1,$2,$3) RETURNING *`;
  const values = [data.media.mediaUrl, data.media.cloudId, data.eventId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*fetchEventsById;

export async function fetchEventById(eventId: number): Promise<Event | null> {
  const query = `
SELECT
    e.id,
    e.event_title,
    e.event_description,
    e.event_address,
    e.is_paid,
    e.ticket_price,
    e.start_at,
    e.end_at,

    m.media_url,
    m.cloud_id,

    u.id AS user_id,
    u.user_name,
    u.full_name,
    u.profile_image,

    b.id AS business_id,
    b.business_name

FROM events e

JOIN users u
    ON e.user_id = u.id

LEFT JOIN businesses b
    ON e.business_id = b.id

LEFT JOIN event_media m
    ON m.event_id = e.id

WHERE e.id = $1;
`;

  const values = [eventId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}

//*events feed

export async function getEvents(limit: number, cursor?: number) {
  const query = `
    SELECT
        e.id,
        e.event_title,
        e.event_description,
        e.event_address,

        u.id as user_id,
        u.full_name,
        u.user_name,
        u.profile_image,

        b.id as business_id,
        b.business_name

    FROM events e

    JOIN users u
        ON u.id=e.user_id

    LEFT JOIN businesses b
        ON b.id=e.business_id

    ORDER BY e.id DESC

    LIMIT $1
    WHERE e.event_status = 'active'
    `;

  return (await pool.query(query, [limit])).rows;
}

//*get event media
export async function getEventMedia(eventIds: number[]) {
  const query = `
    SELECT
        event_id,
        cloud_id,
        media_url
    FROM event_media

    WHERE event_id = ANY($1)
    `;

  return (await pool.query(query, [eventIds])).rows;
}

//*updateEvent Details

export async function updateEvent(data: UpdateEventDataRepo) {
  const query = `UPDATE events SET 

               event_title = $1, event_description = $2, 
               event_address = $3 , is_paid = $4 ,
               ticket_price = $5,start_at = $6,
               end_at = $7, event_type_id = $8,
               updated_at = CURRENT_TIMESTAMP
               
               WHERE id = $9 AND user_id = $10 RETURNING *`;

  const values = [
    data.eventTitle,
    data.eventDescription,
    data.eventAddress,
    data.isPaid,
    data.ticketPrice,
    data.startAt,
    data.endAt,
    data.eventTypeId,
    data.eventId,
    data.userId,
  ];

  return (await pool.query(query, values)).rows[0];
}

//*deleteEvents

export async function deleteEvent(data: { eventId: number; userId: number }) {
  const query = `UPDATE  events SET event_status = 'hidden' WHERE id = $1 AND user_id = $2 RETURNING *`;
  const values = [data.eventId, data.userId];

  try {
    return (await pool.query(query, values)).rows[0];
  } catch (err) {
    throw err;
  }
}
