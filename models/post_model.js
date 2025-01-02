const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the post
      ref: 'User',
      required: true,
    },
    title: {
      type: String, // Title of the post (e.g., "Looking for a React Tutor")
      required: true,
      trim: true,
    },
    description: {
      type: String, // Detailed description of the user's requirement
      required: true,
    },
    category: {
      type: String, // General category (e.g., "Programming", "Design", "Data Science")
      required: true,
    },
    tags: {
      type: [String], // Keywords for filtering or searching (e.g., ["React", "Frontend"])
      default: [],
    },
    budget: {
      type: Number, // User's budget for the service (optional)
      default: 0,
    },
    attachments: {
      type: [String], // Array of file URLs (e.g., documents, images related to the post)
      default: [],
    },
    location: {
      type: String, // Optional field for specifying a location
      default: '',
    },
    deadline: {
      type: Date, // Deadline for completing the task/service
      required: false,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'canceled'], // Current status of the post
      default: 'open',
    },
    responses: [
      {
        teacher: {
          type: mongoose.Schema.Types.ObjectId, // Teacher responding to the post
          ref: 'User',
          required: true,
        },
        message: {
          type: String, // Response message from the teacher
          required: true,
        },
        proposedBudget: {
          type: Number, // Optional budget proposed by the teacher
        },
        createdAt: {
          type: Date,
          default: Date.now, // Timestamp of the response
        },
      },
    ],
   
  },
  {
    timestamps: true,
  }
);

// Add Index for Search Optimization
postSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;


// {
//     "_id": "64c3f9bc17c58e0f4a0e12d4",
//     "user": "64c3f9a517c58e0f4a0e12d2",
//     "title": "Looking for a Machine Learning Tutor",
//     "description": "I am a college student looking to learn supervised and unsupervised ML techniques.",
//     "category": "Data Science",
//     "tags": ["Machine Learning", "Python", "AI"],
//     "budget": 500,
//     "attachments": ["https://example.com/file1.pdf", "https://example.com/image1.jpg"],
//     "location": "Remote",
//     "deadline": "2024-12-31T23:59:59Z",
//     "status": "open",
//     "responses": [
//       {
//         "teacher": "64c3f9bc17c58e0f4a0e12d5",
//         "message": "I can help you with your ML requirements. I have 5 years of experience.",
//         "proposedBudget": 400,
//         "createdAt": "2024-12-29T12:00:00Z"
//       }
//     ],
//   }
  