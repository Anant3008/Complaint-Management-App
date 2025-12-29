import mongoose from 'mongoose'

const ComplaintSchema= new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    description:{
        type:String
    },
    category:String,
    priority:String,
    status:{
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);

export default Complaint;