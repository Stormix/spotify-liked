import { SchemaTypes, Schema, model } from 'mongoose'
import mongoose_delete from 'mongoose-delete'
import { IUser } from '../interfaces/user.interface'
const { ObjectId } = SchemaTypes

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
    },
    password: String,
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
