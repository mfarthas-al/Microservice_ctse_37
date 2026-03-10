const SiteAsset = require("../models/SiteAsset")
const cloudinary = require("../config/cloudinary")

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result)
    })

    stream.end(buffer)
  })
}

exports.uploadBannerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" })
    }

    const result = await uploadToCloudinary(req.file.buffer, "ctse-booking/banners")

    return res.json({ imageUrl: result.secure_url })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getBanner = async (_req, res) => {
  try {
    const banner = await SiteAsset.findOne({ key: "home-banner" })
    return res.json({ imageUrl: banner?.imageUrl || "" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updateBanner = async (req, res) => {
  try {
    const { imageUrl } = req.body

    const banner = await SiteAsset.findOneAndUpdate(
      { key: "home-banner" },
      { imageUrl, updatedAt: Date.now() },
      { upsert: true, new: true }
    )

    return res.json(banner)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
