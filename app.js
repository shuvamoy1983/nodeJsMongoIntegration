'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const Painting = require('./mongo');

const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0'
});


mongoose.connect(
    "mongodb://34.134.243.112:27017/mydb", 
    // {
     //  useNewUrlParser: true,
      // useUnifiedTopology: true,
      // auth: {
      //   user: "user1",
      //   password: "pass1"
      // }
    // }
  );

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we're connected!");
});

server.route([
    {
        method: 'GET',
        path: '/api/v1/paintings',
        config: {
            description: 'Get all the paintings',
            tags: ['api', 'v1', 'painting']
        },
        handler: (req, reply) => {
            return Painting.find();
        }
    },
    {
        method: 'POST',
        path: '/api/v1/paintings',
        config: {
            description: 'Get a specific painting by ID.',
            tags: ['api', 'v1', 'painting']
        },
        handler: (req, reply) => {
            const { name, url, technique } = req.payload;
            const painting = new Painting({
                name,
                url,
                technique
            });

            return painting.save();
        }
    }
]);

const init = async () => {

     await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response', 'onPostStart']
        }
    });


    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

