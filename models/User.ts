import mongoose, { Schema, type Document, type Model } from "mongoose"
import bcrypt from "bcryptjs"

// Define the interface for the User document
export interface IUser extends Document {
  email: string
  password: string
  name: string
  company: string
  phoneNumber: string
  country: string
  loginHistory: Date[]
  isAdmin: boolean
  accountType: "free" | "paid"
  subscription: {
    plan: "trial" | "pro" | "enterprise"
    status: "active" | "canceled" | "past_due" | "unpaid"
    trialEndsAt: Date
    currentPeriodEnds: Date
    customerId?: string
    subscriptionId?: string
    paymentMethod?: "stripe" | "paypal" | "mastercard"
  }
}

// Define the schema
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    phoneNumber: { type: String, default: "123456789" }, // Make optional with default
    country: { type: String, default: "Singapore" }, // Make optional with default
    loginHistory: { type: [Date], default: [] },
    isAdmin: { type: Boolean, default: false },
    accountType: { type: String, enum: ["free", "paid"], default: "free" },
    subscription: {
      plan: { type: String, enum: ["trial", "pro", "enterprise"], default: "trial" },
      status: { type: String, enum: ["active", "canceled", "past_due", "unpaid"], default: "active" },
      trialEndsAt: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }, // 3 days from now
      currentPeriodEnds: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      customerId: { type: String },
      subscriptionId: { type: String },
      paymentMethod: { type: String, enum: ["stripe", "paypal", "mastercard"] },
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next()

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// This is the key change - we're using a function to get the model
// instead of directly exporting it
export function getUserModel(): Model<IUser> {
  // Check if the model already exists to prevent overwriting
  return mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

