var SERVER_NAME = 'image-api'
var PORT = 5000;
var HOST = '127.0.0.1';

var getRequestCounter = 0;  // Request counter for get method
var postRequestCounter = 0; // Request counter for post method

var restify = require('restify')

  // Get a persistence engine for the images
 imageSave = require('save')('images')

  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /images')
  console.log(' /images/:id')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {
  console.log("Images Get : received request")

  getRequestCounter++   // Increase the count by 1.
  console.log("Get Request Counter : " + getRequestCounter)

  // Find every entity within the given collection
  imageSave.find({}, function (error, images) {

    console.log("Images Get : Sending response")

    // Return all of the images data in the system
    res.send(images)
  })
})

// Get a single image by their id
server.get('/images/:id', function (req, res, next) {

  console.log("Images Get : received request")

  getRequestCounter++   // Increase the counter by 1.
  console.log("Get Request Counter : " + getRequestCounter)

  // Find a single image by their id within save
  imageSave.findOne({ _id: req.params.id }, function (error, images) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (images) {
      console.log("Images Get : received request")

      // Send the user if no issues
      res.send(images)
    } else {
      console.log("Images Get : Something went wrong!")

      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})

// Create a new user
server.post('/images', function (req, res, next) {
  console.log("Images Post : received request")

  postRequestCounter++
  console.log("Post Request Counter : " + postRequestCounter)

  // Make sure name is defined
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Image URL must be supplied'))
  }
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Image name must be supplied'))
  }
  if (req.params.imageId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Image ID must be supplied'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Image size must be supplied'))
  }
  
  var newImage = {
		imageId: req.params.imageId, 
		url: req.params.url,
    name: req.params.name,
    size: req.params.size
	}

  // Create the user using the persistence engine
  imageSave.create(newImage, function (error, images) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    console.log("Images Post : store images successfully")

    // Send the user if no issues
    res.send(201, images)
  })
})

// Update a user by their id
server.put('/images/:id', function (req, res, next) {
  console.log("Images Put : received request")
  
  var updateImage = {
		imageId: req.params.imageId, 
		url: req.params.url,
    name: req.params.name,
    size: req.params.size
	}
  
  // Update the user with the persistence engine
  imageSave.update(updateImage, function (error, images) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    console.log("Images Put : Update images successfully")

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete user with the given id
server.del('/images', function (req, res, next) {
  console.log("Images Delete : received request")

  // Delete the user with the persistence engine
  imageSave.deleteMany({}, function (error, images) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    console.log("Images Delete : all images deleted")

    // Send a 200 OK response
    res.send("All Images deleted successfully.")
  })
})


