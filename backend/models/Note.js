const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true // mongo DB gives us the created and updatedTime
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNum',
  start_seq: 500
})

module.exports = mongoose.model('Note', noteSchema);