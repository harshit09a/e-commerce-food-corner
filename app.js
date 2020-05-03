var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	Product = require("./models/product"),
	Comment    = require("./models/comment"),
	Cart        = require("./models/cart"), 
	flash   = require("connect-flash"),
	methodOverride = require("method-override"),
	User = require("./models/user.js"),
	connectDB = require('./DB/collectio.js'),
	passport    = require("passport"),
    LocalStrategy = require("passport-local");
	connectDB();
/*mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/hotels");*/
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
	
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
		
   next();
});
//****************************************************products routs start*****************************************************
app.get("/",function(req,res){

	res.redirect("/product");
});
app.get("/product",function(req,res){
	
	Product.find({},function(err,foundProduct){
		
		if(err)
			{
				res.redirect("back");
				console.log("/product error");
			}
		else
			{
				res.render("product/product",{product:foundProduct});
			}
	})
	
})
//add new product
/*app.get("/product/new",function(req,res){
	res.render("product/new");
})

app.post("/product",function(req,res){
	
Product.create(req.body.product,function(err,foundProduct){
	
	if(err)
		{
			console.log("post product error");
		}
	else
		{
			res.redirect("/product");
		}
	
});	
	
	
});

//edit a new post
app.get("/product/:id/edit",function(req,res){
	//<a href="/product/<%=product[i]._id%>edit">edit</a> link
	Product.findById(req.params.id,function(err,foundProduct){
	if(err)
		{
			console.log("get edit error");
		}
	else
		{
			res.render("product/edit",{product:foundProduct});
		}	
		
		
	})
	
})

app.put("/product/:id",function(req,res){
	
Product.findByIdAndUpdate(req.params.id,req.body.product,function(err,foundProduct){
	
	if(err)
		{
			console.log("post product error");
		}
	else
		{
			res.redirect("/product");
		}
	
});	
	
	
});*/

//show new product 

app.get("/product/:id",function(req,res){
	 //Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)
	Product.findById(req.params.id).populate("comments").exec(function(err,foundProduct){
		
		if(err)
			{
				res.redirect("back");
				console.log(err);
			}
		else
			{
				res.render("product/show",{product:foundProduct});
			}
		
	})
	
	
})







//***********************************************end of product*************************************************************//
//************************************************stat of comment rout****************************************************//
app.get("/product/:id/comment/new",isLoggedIn,function(req,res){
	Product.findById(req.params.id,function(err,foundProduct){
		
		if(err)
			{
				res.redirect("back");
				console.log("comment new error");
			}
		else
			{
				res.render("comment/new",{product:foundProduct});
			}
		
	})
	
	
});
app.post("/product/:id/comment",isLoggedIn,function(req,res){
	Product.findById(req.params.id,function(err,foundProduct){
		
		if(err)
			{
				res.redirect("back");
				console.log("comment new error");
			}
		else
			{
				Comment.create(req.body.comment,function(err,foundComment){
					
					if(err)
						{
							res.redirect("back");
							console.log("comment post ");
						}else
							{
								foundComment.author.id = req.user._id;
								foundComment.author.username=req.user.username;
								foundComment.save();
								foundProduct.comments.push(foundComment);
								foundProduct.save();
								req.flash("success","successfully submitted your review")
								res.redirect("/product/"+req.params.id);
							}
					
				})
			}
		
	})
	
	
});
//edit comment 
app.get("/product/:id/comment/:comment_id/edit",isLoggedIn,function(req,res){
	Product.findById(req.params.id,function(err,foundProduct){
		if(err)
			{
				res.redirect("back");
				console.log(err);
			}
		else
			{
				Comment.findById(req.params.comment_id,function(err,foundComment){
	if(err)
		{
			res.redirect("back");
			console.log("comment edit error");
		}
	else
		{
			res.render("comment/edit",{comment:foundComment,product:foundProduct});
		}	
		
		
	})
				
			}
		
	})
	
	
})

app.put("/product/:id/comment/:comment_id",isLoggedIn,function(req,res){
	
Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){
	
	if(err)
		{
			res.redirect("back");
			console.log("put comment error");
		}
	else
		{
			res.redirect("/product/"+req.params.id);
		}
	
});	
	
	
});

//delete comment
app.delete("/product/:id/comment/:comment_id",function(req,res){
	
	Comment.findByIdAndDelete(req.params.comment_id,function(err){
		
		if(err)
			{
				res.redirect("back");
				console.log("comment delete error");
			}
		else
			{
				res.redirect("/product/"+req.params.id);
			}
	})
})
//*********************************************************end of comment rout ************************************************
//*********************************************************start of cart rout**************************************************

app.post("/product/:id/addtocart",isLoggedIn,function(req,res){
	
	Product.findById(req.params.id,function(err,foundProduct){
		if(err)
			{
				res.redirect("back");
				console.log("err at addto cart");

			}
		else
			{
				Cart.create(req.body.cart,function(err,foundCart){
					if(err)
						{
							res.redirect("back");
							console.log("err at post cart");
						}
					else
						{
							foundCart.products.id=foundProduct._id;
							foundCart.products.name=foundProduct.name;
							foundCart.products.image=foundProduct.image;
							foundCart.products.price = foundProduct.price;
							foundCart.products.bestseller=foundProduct.bestseller;
							
							foundCart.save();
							
							User.findById(req.user._id,function(err,foundUser){
								if(err)
									{
										res.redirect("back");
										console.log("err at found user");
									}
								else
									{
										foundUser.carts.push(foundCart);
										foundUser.save();
										
										res.redirect("/product");
									}
							});
							
							
						}
				})
				
			}
		
		
		
	})
	
});

app.get("/product/cart/viewcart",isLoggedIn,function(req,res){
	User.findById(req.user._id).populate("carts").exec(function(err,found){

	if(err)
		{
			res.redirect("back");
console.log("err at view cart");
		}
		else
			{
				res.render("cart/view",{cart:found});
			}
	
	
	})
	
	
})

app.delete("/product/cart/:id",function(req,res){
	Cart.findByIdAndDelete(req.params.id,function(err){
		
		if(err)
			{
				res.redirect("back");
				console.log("errat cart delete");
			}
		else
			{
				res.redirect("/product/cart/viewcart");
			}
		
	})
});

app.put("/product/:id/cart/:cart_id",isLoggedIn,function(req,res){
	
	Product.findById(req.params.id,function(err,foundProduct){
		
		if(err)
			{res.redirect("back");
				console.log("err");
			}else
				{var quantity= req.body.cart.quantity;
				 
					
					
					Cart.findById(req.params.cart_id,function(err,foundCart){
		
		          if(err)
			   {
				   res.redirect("back");
				console.log("cart edit err");
			   }
		      else
			   {
				   foundCart.quantity=quantity;
				   foundCart.save();
				  
				res.redirect("/product/cart/viewcart");

			   }
		
	  });
					
				}
		
	})
	
});




//*************************************************user rout************************************************************
app.get("/register",function(req,res){
	
	res.render("register");
});
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
         req.flash("error",err.message);

            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
							
req.flash("success","successfully signup")
			
           res.redirect("/product"); 
        });
    });
});
app.get("/login",function(req,res){
	
	res.render("login");
})
app.post("/login",passport.authenticate("local",{
	
	successRedirect: "/product",
        failureRedirect: "/login"
}),function(req,res){
	
	
	
});

app.get("/logout",function(req,res){
	
	req.logout();
	req.flash("success","successfully logout")
	res.redirect("/product");
	
});//***********************************************buy****************************************
app.get("/buy",function(req,res){
	req.flash("success","successfully placed your order")
	res.redirect("/product");
	
});
//*****************************************************************end of user rout******************************
//*****************************************************************middel ware***********************************
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	
    res.redirect("/login");
}
//*********************************************************end of middel ware**************************************

app.listen(process.env.PORT||3000, process.env.IP, function(){
   console.log("The hotels Server Has Started!");
});

