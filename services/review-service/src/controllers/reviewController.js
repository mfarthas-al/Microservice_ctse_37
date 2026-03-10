const Review = require("../models/Review")

exports.createReview = async (req,res)=>{

try{

const {userId,bookingId,rating,comment} = req.body

const review = new Review({
userId,
bookingId,
rating,
comment
})

await review.save()

res.status(201).json(review)

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.getReviews = async(req,res)=>{

try{

const reviews = await Review.find()

res.json(reviews)

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.deleteReview = async(req,res)=>{

try{

await Review.findByIdAndDelete(req.params.id)

res.json({message:"Review deleted"})

}catch(error){

res.status(500).json({message:error.message})

}

}
