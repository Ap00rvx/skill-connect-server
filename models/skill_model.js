const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the teacher who owns the skill
      ref: 'User',
      required: true,
    },
    title: {
      type: String, // Name of the skill (e.g., "Web Development", "Data Science")
      required: true,
      trim: true,
    },
    description: {
      type: String, // A brief description of the skill
      required: true,
    },
    category: {
      type: String, // General category for the skill (e.g., "Programming", "Design")
      required: true,
    },
    tags: {
      type: [String], // Keywords for filtering or searching
      default: [],
    },
    experience: {
      type: Number, // Years of experience in this skill
      required: true,
      min: 0,
    },
    price: {
      type: Number, // Price or rate for teaching this skill (per hour/session)
      required: true,
      min: 0,
    },
    media: {
      images: [
        {
          type: String, // URLs of images showcasing work, certificates, etc.
        },
      ],
      videos: [
        {
          type: String, // URLs of videos demonstrating skill expertise
        },
      ],
    },
    availability: {
      days: {
        type: [String], // Available days (e.g., ["Monday", "Wednesday", "Friday"])
        default: [],
      },
      timeSlots: {
        type: [String], // Available time slots (e.g., ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"])
        default: [],
      },
    },
    rating: {
      type: Number, // Average rating for the skill
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number, // Total number of reviews for the skill
      default: 0,
    },
    isActive: {
      type: Boolean, // Whether the skill is currently active and visible
      default: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);


skillSchema.virtual('totalRevenue').get(function () {
  return this.price * this.totalReviews; 
});


skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;

// {
//     "_id": "64c3f9bc17c58e0f4a0e12d3",
//     "teacher": "64c3f9a517c58e0f4a0e12d2",
//     "title": "Advanced JavaScript",
//     "description": "Learn JavaScript from basics to advanced concepts.",
//     "category": "Programming",
//     "tags": ["JavaScript", "Web Development", "Frontend"],
//     "experience": 5,
//     "price": 50,
//     "media": {
//       "images": ["https://example.com/image1.jpg"],
//       "videos": ["https://example.com/video1.mp4"]
//     },
//     "availability": {
//       "days": ["Monday", "Wednesday", "Friday"],
//       "timeSlots": ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"]
//     },
//     "rating": 4.8,
//     "totalReviews": 25,
//     "isActive": true,
//     "createdAt": "2024-01-01T12:00:00Z",
//     "updatedAt": "2024-01-10T12:00:00Z"
//   }