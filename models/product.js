var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
   name: String,
   image: String,
	price:String,
	bestseller:String,
   description: String,
	comments :[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref :"Comment"
		}
	],
	
});

module.exports= mongoose.model("Product", productSchema);
