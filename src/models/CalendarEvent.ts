import { Schema, model, Document, Types } from 'mongoose';

export interface ICalendarEvent extends Document {
  title: string;
  start?: Date;
  end?: Date;
  rrule?: string;
  duration?: { hours?: number; minutes?: number };
  allDay?: boolean;
  note?: string;
  user: Types.ObjectId | string;
}

const CalendarEventSchema = new Schema<ICalendarEvent>({
  title: { type: String, required: true },
  start: { type: Date },
  end: { type: Date },
  rrule: { type: String },
  duration: {
    hours: { type: Number },
    minutes: { type: Number }
  },
  allDay: { type: Boolean, default: false },
  note: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }

});

export const CalendarEventModel = model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);