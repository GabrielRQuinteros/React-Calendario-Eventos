import { CalendarEventModel, ICalendarEvent } from '../models/CalendarEvent';

export class CalendarEventService {
  async getAll(): Promise<ICalendarEvent[]> {
    return CalendarEventModel.find().select('-__v');
  }

  async getById(id: string): Promise<ICalendarEvent | null> {
    return CalendarEventModel.findById(id).select('-__v');
  }

  async create(data: Partial<ICalendarEvent>): Promise<ICalendarEvent> {
    const event = new CalendarEventModel(data);
    return event.save();
  }

  async update(id: string, updates: Partial<ICalendarEvent>): Promise<ICalendarEvent | null> {
    return CalendarEventModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await CalendarEventModel.findByIdAndDelete(id);
    return !!result;
  }
}