import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */
    app.get('/filteredimage', async (req, res) => {
      const { image_url } = req.query;
    
      // Validate the image_url query
      if (!image_url) {
        return res.status(400).send('Missing image_url query parameter');
      }
    
      try {
        // Call filterImageFromURL to filter the image
        const filteredPath = await filterImageFromURL(image_url);
        console.log("image_url",image_url);
        // Send the resulting file in the response
        res.sendFile(filteredPath, async (err) => {
          if (err) {
            console.error(`Error sending filtered image: ${err}`);
            res.status(500).send('Error sending filtered image');
          } else {
            // Delete the filtered image file from the server
            await deleteLocalFiles([filteredPath]);
          }
        });
      } catch (error) {
        console.error(`Error filtering image: ${error}`);
        res.status(500).send('Error filtering image');
      }
    });




  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
