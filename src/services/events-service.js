import { event_repository } from '../repositories/events-repository.js';

export const event_service = {
  async list_events({ page = 1, page_size = 10 }) {
    const limit = Number(page_size) || 10;
    const offset = (Number(page) - 1) * limit;

    const { items, total } = await event_repository.find_all_paginated({ limit, offset });

    return {
      page,
      page_size: limit,
      total,
      events: items.map(ev => ({
        id: ev.id,
        name: ev.name,
        description: ev.description,
        start_date: ev.start_date,
        duration_in_minutes: ev.duration_in_minutes,
        price: ev.price,
        enabled_for_enrollment: ev.enabled_for_enrollment,
        max_assistance: ev.max_assistance,
        creator_user: {
          id: ev.creator_user.id,
          first_name: ev.creator_user.first_name,
          last_name: ev.creator_user.last_name,
          username: ev.creator_user.username
        },
        location: {
          id: ev.location.id,
          name: ev.location.name,
          full_address: ev.location.full_address,
          max_capacity: ev.location.max_capacity,
          latitude: ev.location.latitude,
          longitude: ev.location.longitude
        }
      }))
    };
  }
};
