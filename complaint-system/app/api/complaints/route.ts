import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Complaint from '@/app/model/complaint.schema';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const complaint = await Complaint.create(body);
        return NextResponse.json({ success: true, data: complaint }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const complaints = await Complaint.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: complaints }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}