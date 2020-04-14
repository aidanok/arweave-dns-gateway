let createConnection = require("typeorm").createConnection;
let Site = require("./src/entity/Site")

let Manager = module.exports;
let connectionOptions = {
    "type": "mongodb",
    "host": "localhost",
    "port": 27017,
    "database": "arweave-dns-gateway",
    "synchronize": true,
    "logging": false,
    "entities": [__dirname + "/src/entity/Site.js"],
    "migrations": [
        __dirname +  "/src/migration/*.js"
    ],
    "subscribers": [
        __dirname +  "/src/subscriber/*.js"
    ],
    "cli": {
        "entitiesDir": __dirname +  "/src/entity",
        "migrationsDir": __dirname + "/src/migration",
        "subscribersDir": __dirname + "/src/subscriber"
    }
};

Manager.create = function() {
    let manager = {};

    manager = {
        get: async function({servername}) {
            let connection = await createConnection(connectionOptions);
            const site = await connection.mongoManager.findOne(Site.Site, {subject: servername});
            await connection.close();

            return site;
        },

        set: async function(opts) {
            createConnection(connectionOptions).then(async connection => {
                let site = new Site.Site();
                site.subject = opts.subject;
                site.altnames = opts.altnames;
                site.renewAt = opts.renewAt;
                site.deletedAt = opts.deletedAt;
                
                await connection.mongoManager.updateOne(Site.Site, {subject: opts.subject}, {$set: site}, { upsert: true });
                await connection.close();

                return null;
            });
        },
        
        find: async function(opts) {
            let connection = await createConnection(connectionOptions);
            let sites = null;
            let altname = null
            
            if(opts) {
                if(opts.altnames) {
                    altname = opts.altnames[0]
                }
            }

            sites = await connection.mongoManager.find(Site.Site, {


                where: {
                    $or: [opts,
                         {subject: opts.subject, altnames: opts.altnames, deletedAt: null},
                         {altnames: altname, deletedAt: null}
                        ],
                }

            });
            
            await connection.close();

            return sites;
        }
    };

    return manager;
};
