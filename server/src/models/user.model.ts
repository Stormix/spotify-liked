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
    imageUrl: String
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
