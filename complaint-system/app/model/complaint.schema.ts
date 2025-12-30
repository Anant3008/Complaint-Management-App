import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ComplaintDocument extends Document {
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  dateSubmitted: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<ComplaintDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: String,
    priority: String,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    dateSubmitted: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Complaint: Model<ComplaintDocument> =
  mongoose.models.Complaint ||
  mongoose.model<ComplaintDocument>('Complaint', ComplaintSchema);

export default Complaint;