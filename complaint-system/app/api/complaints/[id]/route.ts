import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Complaint from '@/app/model/complaint.schema';
import { sendStatusUpdateEmail } from '@/app/lib/email/templates';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const complaint = await Complaint.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        
        if (!complaint) {
            return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
        }

        if (body.status && process.env.ADMIN_EMAIL) {
            try {
                await sendStatusUpdateEmail({
                    title: complaint.title,
                    status: complaint.status,
                    complaintId: complaint._id.toString(),
                    updatedAt: new Date().toISOString(),
                });
            } catch (emailError) {
                console.error('Failed to send status update email:', emailError);
            }
        }
        
        return NextResponse.json({ success: true, data: complaint }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const complaint = await Complaint.findByIdAndDelete(id);
        
        if (!complaint) {
            return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
