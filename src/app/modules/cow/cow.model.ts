import { Schema, model } from "mongoose";
import { ICow, CowModel } from "./cow.interface";
import { Breed, Category, Label, Location } from "./cow.constants";

// Cow Schema
const cowSchema = new Schema<ICow, CowModel>(
  {
    name: {
      type: String,
      required: [true, "name is missing!"],
    },
    age: {
      type: Number,
      required: [true, "age is missing!"],
    },
    price: {
      type: Number,
      required: [true, "price is missing!"],
    },
    location: {
      type: String,
      enum: {
        values: Location,
        message: "{VALUE} is not matched",
      },
      required: [true, "location is missing!"],
    },
    breed: {
      type: String,
      enum: {
        values: Breed,
        message: "{VALUE} is not matched",
      },
      required: [true, "breed is missing!"],
    },
    label: {
      type: String,
      enum: {
        values: Label,
        message: "{VALUE} is not matched",
      },
      default: "for sale",
      required: [true, "label is missing!"],
    },
    category: {
      type: String,
      enum: {
        values: Category,
        message: "{VALUE} is not matched",
      },
      required: [true, "category is missing!"],
    },
    weight: {
      type: Number,
      required: [true, "weight is missing!"],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "seller is missing!"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Cow = model<ICow, CowModel>("Cow", cowSchema);
