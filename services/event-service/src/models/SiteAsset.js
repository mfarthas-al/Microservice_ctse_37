import mongoose from "mongoose"

const siteAssetSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("SiteAsset", siteAssetSchema)
