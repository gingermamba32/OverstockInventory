var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var csv = require('fast-csv');
var fs = require('fs');
var Busboy = require('busboy');
var path = require('path');
var moment = require('moment');
//           box        : moment(num2).format('YYYY-MM-DD HH:mm:ss')

// try catch the database
try{
	var uristring = require('./mongolabsuri.js').name;
}
catch(err){
	console.log("no connection file so go on to Heroku config var");
	var uristring = process.env.MONGOLAB_URI;   //if Heroku env set the config variable
}
console.log("uristring is "+ uristring);

mongoose.connect( uristring, function (err,res){
	if (err) {
		console.log(err);
	}
	else{
		console.log('success');
	}
})

//var db = mongoose.connect( uristring);

// db schema for the locations collection
var locationsSchema = new mongoose.Schema({ 
	upc: {
		type: String,
		default: ''
	}	,
	description: {
		type: String,
		default: ''
	}	,
    location: {
        type: String,
        default: ''
        },
    quantity: {
        type: Number,
        default: ''
        },
    box: {
    	type: String, 
    	default: ''
    }
});

var Locations = mongoose.model('locations', locationsSchema);

// db schema for the radio collection
// var radiosSchema = new mongoose.Schema({ 
// 	radio: {
// 		type: String,
// 		default: ''
// 	}	,
// 	type: {
// 		type: String,
// 		default: ''
// 	},
//     created: {
//         type: Date,
//         default: Date.now
//     }
// });

// var Radios = mongoose.model('radios', radiosSchema);




// buttons page
router.get('/', function(req, res, next) {
	res.render('home');
})

/* GET home page with All Database Products*/
router.get('/scan', function(req, res, next) {
	// Locations.find( {}, function(err, docs) {
	// 	docs.reverse();
	res.render('index');
	});

//get the search page
router.get('/search', function(req, res, next) {
	res.render('search');

})

//get the second step of the index page
router.get('/index-step-2', function(req, res, next) {
	res.render('index-step-2');

})

router.get('/addUpc', function(req, res, next) {
	fs.readdir(__dirname + '/../public/uploads', function(err, data){
		console.log(data);
		if (err) {
		      res.status(500).send(err);
		      return;
		  }
    	res.render('upc', {"files": data});
	});
})

router.get('/invalidInventory', function(req, res, next) {
	res.render('invalid');
})

router.get('/test', function(req, res, next) {
	res.render('test');
})


//do not need the radio search anymore
// router.post('/radioSearch', function(req,res,next){
// 	globalColor = req.body.color;
// 	globalType = req.body.type;
// 	globalLength = req.body.length;
// 	globalUpc = '';
// 	globalDesc = '';
// 	globalLoc = '';
// 	globalQty = '';
// 	globalPo = '';

// 	console.log(globalColor);
// 	console.log(globalType);
// 	console.log(globalLength);

// 	console.log(req.body.length);
// 	console.log(req.body.type);
// 	console.log(req.body.color);


	
// 	//new RegExp("^"
// 	if (req.body.type == undefined && req.body.color == undefined){
// 		Locations.find({description: new RegExp("^" + req.body.length)}).sort({shipment: 1}).exec(function(err,docs){
// 			console.log( docs + ' good query length');
// 			Radios.find().exec(function(err,files){
// 				console.log(files);
// 				res.render('query', {'nums':docs, 'num':files});
// 			});
// 		})

// 	}
// 	else if (req.body.length == undefined && req.body.color == undefined){
// 		Locations.find({description: new RegExp(req.body.type)}).sort({shipment: 1}).exec(function(err,docs){
// 			console.log( docs + ' good query type');
// 			Radios.find().exec(function(err,files){
// 				console.log(files);
// 				res.render('query', {'nums':docs, 'num':files});
// 			});
// 		})
// 	}

// 	else if (req.body.length == undefined && req.body.type == undefined){
// 		Locations.find({description: new RegExp(req.body.color)}).sort({shipment: 1}).exec(function(err, docs){
// 			console.log( docs + ' good query color');
// 			Radios.find().exec(function(err,files){
// 				console.log(files);
// 				res.render('query', {'nums':docs, 'num':files});
// 			});
// 		})
// 	}
// 	else if (req.body.color == undefined){
// 		Locations.find({description: new RegExp("^" + req.body.length + "." + req.body.type)}).sort({shipment: 1}).exec(function(err,docs){
// 			console.log( docs + ' good query length+type');
// 			Radios.find().exec(function(err,files){
// 				console.log(files);
// 				res.render('query', {'nums':docs, 'num':files});
// 			});
// 		})
// 	}
// 	else if (req.body.length == undefined){
// 		Locations.find({description: new RegExp(req.body.type + "\." + req.body.color + "\.$")}).sort({shipment: 1}).exec(function(err,docs){
// 			console.log( docs + ' good query type + color');
// 			Radios.find().exec(function(err,files){
// 				console.log(files);
// 				res.render('query', {'nums':docs, 'num':files});
// 			});
// 		})
// 	}

// 	else if (req.body.type == undefined){
// 		Locations.find({description: new RegExp("^"+req.body.length + ".*" + req.body.color + "\.$")}).sort({shipment: 1}).exec(function(err, docs){
// 			console.log( docs + ' good query length + color');
// 			Radios.find().exec(function(err,files){
// 				console.log(files);
// 				res.render('query', {'nums':docs, 'num':files});
// 			});
// 		})
// 	}
// 	else {
// 	Locations.find({description: req.body.length + "." + req.body.type + "." + req.body.color + "."}).sort({shipment: 1}).exec(function(err,docs){
// 		console.log( docs + ' good query');
// 		Radios.find().exec(function(err,files){
// 				console.log(files);
// 				res.render('query', {'nums':docs, 'num':files});
// 			});
// 		});
// 	}
// })

// router.post('/addUpc', function(req, res,next){
// 	console.log(req.body.quantity);
// 	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
// 		if (docs != null) {
// 			res.redirect('/invalidInventory');
// 		}
// 		else {
// 			var newUpc = new Locations({
// 			upc        : req.body.upc,
// 			description: (req.body.description).toUpperCase(),
// 			location   : req.body.location,
// 			shipment   : req.body.po,
// 			quantity   : req.body.quantity
// 			});
// 							console.log(newUpc);
// 							newUpc.save(function(err, callback){
// 							res.render('upc', {successmessage: 'You have successfully added '+ req.body.description+ ' to the database.'});
// 							})
// 		}
// 	});
// });


// // Query the database by UPC and return 
// router.post('/query1', function( req, res, next ){
// 	console.log(req.body.barcode);
// 	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('upcsearch', {post:docs});
// 	 });
// })

// Query the database by Location and return all products in that location

// // ********************************************
// router.post('/queryLoc', function( req, res, next ){
// 	console.log(req.body.locations);
// 	Locations.find({location: req.body.locations}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('locsearch', { 'products': docs});
// 	 });
// })

// adding quantity = add success message 
// router.post('/add', function(req, res, next ){
// 	console.log(req.body.barcodeupc);
// 	console.log(req.body.quantity);
// 	var qtyupdate = parseInt(req.body.quantity);
// 		Locations.findOneAndUpdate(
// 			{upc: req.body.barcodeupc},
//             {$inc: {
//                 	quantity     	  : qtyupdate
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document");
//             	res.redirect('/');
//             });          
// })


// router.post('/locate', function( req, res, next ){
// 	console.log(req.body.bin);
// 	console.log(req.body.productupc);
// 	console.log(req.body.qty);
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin, upc: req.body.productupc},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document by searching bin and upc");
//             	res.redirect('/');

// 	});
// })

// router.post('/locateMulti', function( req, res, next ){
// 	console.log(req.body);
// 	console.log(req.body.bin1);
// 	console.log(req.body.productupc1);
// 	console.log(req.body.qty1);
// 	console.log(req.body.productupc2);
// 	console.log(req.body.qty2);
// 	if ( req.body.productupc2 != '' && req.body.qty2 != ''){
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin1, upc: req.body.productupc1},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty1
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document#1 by searching bin1 and upc1");
//             	// res.redirect('/');
// 			});
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin1, upc: req.body.productupc2},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty2
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document#2 by searching bin1 and upc2");
//             	res.redirect('/');
// 			});
// 	}
// 	else {
// 		Locations.findOneAndUpdate(
// 		{location: req.body.bin1, upc: req.body.productupc1},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty1
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document by searching bin and upc");
//             	res.redirect('/');
// 		});

// 	}
// })



//scan in new upcs
router.post('/locateThree', function( req, res, next ){
	console.log(req.body);
	console.log(req.body.upc1);  //productupc11
	console.log(req.body.quantity1); //qty11
	var searchedUPC = req.body.upc1;
					
					var momentDate = Date.now(); 
					var newMoment = moment(momentDate).format('YYYY-MM-DD HH:mm:ss');
					console.log(newMoment);

            		Locations.findOneAndUpdate({upc: req.body.upc1}, 
            			{
            				$inc: {quantity: req.body.quantity1},
            				$set: {box: newMoment}
            			}, 
						{upsert: false}, 
							function(err, docs) {
								console.log(docs + 'HELLLLLLLLPPPPPPPPP!');
		            			if (docs == null){
		            				
									res.render('invalid', {message: req.body.upc1 + ' does not exist in the system. Please add it to the system!'});
									
		            				//res.render('invalid', {message: req.body.upc1 + ' does not exist in the system. Please add it before updating qty!'});
		            			}
							    else { 
								            	console.log( docs + " Updated Document");
								            	Locations.findOne({upc: docs.upc}).exec(function(err, docs){
													console.log( docs + ' good query loc + PROD');
													console.log(docs);
													console.log(docs.quantity)
													res.render('index-step-2', { success: 'NOTE: ' + docs.upc + ' has been updated to ' + docs.quantity, post:docs }); 
												})
								            	//res.render('index-step-2', { success: docs.upc + ' has been updated to ' + docs.quantity, post:docs });    
		            				}
	

					});  
});


router.post('/updateStepTwo', function(req, res){

	var momentDate = Date.now();

	Locations.findOneAndUpdate(
		{_id: req.body.id},
		{$set: {
                	_id     	       : req.body.id,
                    upc      	  	   : req.body.barcode,
                    description 	   : req.body.description,
                    location           : req.body.location,
                    quantity           : req.body.qty,
                    box 	           : moment(momentDate).format('YYYY-MM-DD HH:mm:ss')
            }}, 
            {upsert: false} , function(err, docs) {
				var savesearch = docs.upc
			Locations.findOne({upc: savesearch}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + upc');
				res.render('scan', {success: docs.upc + ' Updated!'});
			})
    });          
})



		//UPDATE DOCUMENT BY CONDITIONS *************full scan
		// Locations.findOneAndUpdate(
		// {location: req.body.bin11, upc: req.body.upc1, shipment: req.body.shipment},  
		// {$inc: {
  //               	quantity     	  : req.body.quantity1
  //           }}, 
  //           {upsert: false} , function(err, docs) {
  //           	//console.log( docs + " Updated Document#1 by searching bin11 and upc11");
  //           	// res.redirect('/');
  //           	if (docs === null) {
  //           		Locations.findOne({upc: req.body.upc1}, function(err, docss) {
  //           				console.log(docss+ 'DOCCSSSSSSS')
		// 					if (docss === null){

  //           				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
  //           				}
		// 			    	else { 
		// 						var newLocation = new Locations({
		// 						location   : req.body.bin11,
		// 						upc        : req.body.upc1,
		// 						description: docss.description,
		// 						shipment   : req.body.shipment,
		// 						quantity   : req.body.quantity1
		// 						});
		// 						console.log(newLocation);
		// 					newLocation.save(function(err, callback){
		// 				//res.redirect('/');
		// 					})
		// 					}
  //           		});
  //           	}
  //           	else {
  //           		console.log( docs + " Updated Document by searching bin and upc");
  //           	//res.redirect('/');
  //           	}

		// 	});
// // Sort by features
// router.post('/type', function( req, res, next ){
// 	console.log(req.body.type);
// 	Locations.find({type: req.body.type}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('type', { 'posts': docs });
// 	 });
// })

// router.post('/length', function( req, res, next ){
// 	console.log(req.body.length1);
// 	Locations.find({length: req.body.length1}, function(err, docs) {
// 			console.log( docs + 'good query');
// 		res.render('length', { 'nums': docs });
// 	 });
// })

// router.post('/color', function( req, res, next ){
// 	console.log(req.body.color);
// 	Locations.find({color: req.body.color}, function(err, docs) {
// 			console.log( docs + 'good query');
// 		res.render('color', { 'nums': docs });
// 	 });
// })

// // router.post('/location', function( req, res, next ){
// // 	console.log(req.body.location);
// // 	Locations.find({location: req.body.location}, function(err, docs) {
// // 			console.log( docs + 'good query');
// // 		res.render('location1', { 'nums': docs });
// // 	 });
// // })

// router.post('/qty', function( req, res, next ){
// 	console.log(req.body.qty);
// 	Locations.find({quantity: req.body.qty}, function(err, docs) {
// 			console.log( docs + 'good query');
// 		res.render('qty1', { 'nums': docs });
// 	 });
// })
// router.post('/upc', function( req, res, next ){
// 	console.log(req.body.barcode);

// 	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('upc1', {post:docs});
// 	 });
// })

// router.post('/po', function( req, res, next ){
// 	console.log(req.body.po);
// 	Locations.find({shipment: req.body.po}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('po', {'nums':docs});
// 	 });
// })


// This is the search page 
// Full search feature....upc is unique and can only have one search function
router.post('/query', function(req,res,next){
	
	console.log(req.body.location);
	console.log(req.body.barcode);

	globalUpc = req.body.barcode;
	globalLoc = req.body.location;

	console.log(globalUpc + 'THIS IS THE GLOBAL UPC'); 
	console.log(globalLoc + ' this is the global location now');

	if (req.body.barcode != '' && req.body.location != ''){
		Locations.find({upc: req.body.barcode, location: req.body.location}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
			res.render('query', {'nums':docs});
		})
	}	

	else if (req.body.barcode != ''){
    Locations.find({upc: req.body.barcode}).sort({shipment: 1}).exec(function(err, docs) {
			console.log( docs + ' good query');
				res.render('query', {'nums':docs});
	 });
	}

	else if (req.body.location != '') {
		Locations.find({location: req.body.location}).sort({shipment: 1}).exec(function(err, docs) {
			console.log( docs + 'good query');
				res.render('query', {'nums':docs});
	 });
	}

	else if (req.body.qty == '' && req.body.location == '' && req.body.description == '' && req.body.barcode == ''){
		res.render('search', {message: 'You have have not searched anything!'})
	}	

});





router.get('/deleteuser/:id', function(req, res){
	console.log(req.params.id);
	console.log(globalUpc); 
	console.log(globalLoc);


// To fix this we need to use find by id, find by upc, 2 conditions, one to update and one to remove

	Locations.remove({ _id: req.params.id }, function(err, docs){

	// 	Locations.find({location: globalLoc, location: globalLoc}).sort({shipment: 1}).exec(function(err,docs){
	// 	console.log( docs + ' good query');
	// 	res.render('query', {'nums':docs});	
	// });
	// });
	// });
	//if array of search is 1 findOneAnd
		if (globalUpc != '' && globalLoc != ''){
			Locations.find({upc: globalUpc, location: globalLoc}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + upc');
				res.render('query', {'nums':docs});
			})
		}	

		else if (globalUpc != ''){
	    Locations.find({upc: globalUpc}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + ' good query upc');
				res.render('query', {'nums':docs});
		 });
		}

		else if (globalLoc != '') {
			Locations.find({location: globalLoc}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + 'good query loc');
				res.render('query', {'nums':docs});
		 });
		}

	});
});

router.get('/updateproduct/:id', function(req, res){
	console.log(globalUpc); 

	Locations.find({_id: req.params.id}, function(err, docs){
		console.log(docs + ' User to edit');
		res.render('editproduct', { post:docs } );
	});
});



///Update a product that you search for
router.post('/update', function(req, res){
	console.log(req.body.id + ' Hello');

	Locations.findOneAndUpdate(
		{_id: req.body.id},
		{$set: {
                	_id     	       : req.body.id,
                    upc      	  	   : req.body.barcode,
                    description 	   : req.body.description,
                    location           : req.body.location,
                    quantity           : req.body.qty,
                    box 	           : Date.now()
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log(err);
				console.log(docs + " Updated Document");
				console.log(docs.upc);
				var savesearch = docs.upc

		
			Locations.find({upc: savesearch}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + upc');
				res.render('query', {'nums':docs});
			})
    });          
})


// router.post('/location', function( req, res, next ){
// 	console.log(req.body.barcode);
// 	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
// 			console.log( docs.upc + ' good upc');
// 			var newLocation = new Locations({
// 				location   : req.body.location,
// 				upc        : req.body.barcode,
// 				description: docs.description,
// 				shipment   : docs.shipment,
// 				quantity   : req.body.quantity
// 			});
// 				console.log(newLocation);
// 				newLocation.save(function(err, callback){
// 				res.redirect('/');
// 				})
// 	 });
// })

// search by multiple fields practice = need to create function to push into object for find
// router.post('/queryTest', function(req,res,next){
// 		console.log(req.body.description);
// 		console.log(req.body.location);
// 		console.log(req.body.qty);
// 		console.log(req.body.barcode.length);
// 		console.log(req.body.po);
// 		var upc;
// 		var description;
// 		var location;
// 		var quantity;
// 		var po;
// 		if (req.body.barcode != ''){
// 			var upc = req.body.barcode;
// 		}
// 		else {
// 			var upc = null;
// 		}

// 		if (req.body.location != ''){
// 			var location = req.body.location;
// 		}
// 		else {
// 			var location = null;
// 		}
// 		console.log(upc);
// 		//assign var declarations
// 		Locations.find({$and: [ {upc: upc, location: location}, {upc: {$where: {upc:{$ne:null}}}}, {location: {$where: {location:{$ne:null}}}}]}, 
// 		 function(err,docs){
// 			console.log(docs+' TESTTTTTTT');

// 			res.render('query', {'nums':docs})
// 		})


// });


// Add the excel upload for products
router.post('/excel', function(req, res, next) {
	console.log(req.body.excel);
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    	// Save File
    	var fstream = fs.createWriteStream('./public/uploads/' + filename);
        file.pipe(fstream);

    	// Read File
	    file.pipe(csv({headers: true}))
	      .on('data', function (data) {
	        console.log('YAY, just the data I wanted!', data);
	        console.log(data[0] + " Only the first column");
	        console.log(data['UPC'] + " Only the first column");

	        var excel_upc = data['UPC'];
	        var excel_description = data['DESCRIPTION'];

	        // Save the data to mongodb
	        if (excel_upc != '') {


	        	// Need to search for if UPC exists
	        	// ************************

				var newLocation = new Locations ({
							location   : 'FIRST ENTRY',
							upc        : excel_upc,
							description: excel_description,
							quantity   : 0,
							box        : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
						});
						console.log(newLocation);
						newLocation.save(function(err, callback){
							console.log("upc saved!!");
						})
			
	        }
	        else { console.log("blank row!!!!")}
						


	      });
	  });
	busboy.on('finish', function() {
	    console.log('Done parsing form!');
	    // Display all files uploa
	    fs.readdir(__dirname + '/../public/uploads', function(err, data){
		console.log(data);
		if (err) {
		      res.status(500).send(err);
		      return;
		  }
    	res.render('upc', {"files": data});
	});
	    
	});

    req.pipe(busboy);

});

// Add Radio Button to the search page
// router.post('/radioAdd', function(req, res,next){
// 	console.log(req.body.radio);
// 	console.log(req.body.searchtype);
// 	var newRadio = new Radios ({
// 		radio   : req.body.radio,
// 		type    : req.body.searchtype
// 	});
// 	console.log(newRadio);

// 	newRadio.save(function(err, callback){
// 		console.log("upc saved!!");
// 		// Display the radios db items on the search page
// 		Radios.find().exec(function(err,docs){
// 						console.log( docs + ' good query length');
// 						res.render('search', {'nums':docs});
// 		});

// 	});
// });

// // Delete Radio Buttons
// router.get('/deletebutton/:id', function(req, res){
// 	Radios.remove({ _id: req.params.id }, function(err, docs){
// 		Radios.find().exec(function(err,docs){
// 			console.log( docs + ' good query length');
// 			res.render('search', {'nums':docs});
// 		});
// 	});
// });

module.exports = router;