var mongoose = require("mongoose");
var cartSchema = mongoose.Schema({
	
	
	quantity:Number,
	products:{
		id:{
			type : mongoose.Schema.Types.ObjectId,
			ref :"Product"
		},
		
		name:String,
		price:Number,
		image:String,
		bestseller:String
		
		},
		
		
		
	
	
	
});
module.exports = mongoose.model("Cart",cartSchema);