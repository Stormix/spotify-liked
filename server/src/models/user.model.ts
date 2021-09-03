import { Schema, model } from 'mongoose'
import mongoose_delete from 'mongoose-delete'
import { IUser } from '../interfaces/user.interface'

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
    },
    spotifyId: String,
    tokens: {
      access_token: String,
      token_type: String,
      expires_in: Number,
      scope: String,
      refresh_token: String
    },
    displayName: String,
    imageUrl: String,
    playlist: {
      type: {
        id: String,
        name: String,
        description: String,
        sync: Boolean,
        isPublic: Boolean,
        lastUpdated: { type: Date, default: null },
        snapshot_id: { type: String, default: null },
        length: { type: Number, default: 0 },
        status: { type: String, default: 'created' }
      },
      default: null
    }
  },
  {
    timestamps: true
  }
)

userSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

export default model<IUser>('users', userSchema)
