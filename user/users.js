var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/";

class users_class {

    dbase = null;

    constructor() {
        this.init();
    }

    async init() {
        this.dbase = await this.get_db();
        await this.create_collection();
    }

    create_collection() {
        this.dbase.createCollection("users", function (err, collection) {
            // if (err) throw err;
            // console.log("Collection users created!");
        });
        this.dbase.createCollection("au_user", function (err, collection) {
            // if (err) throw err;
            // console.log("Collection au_user created!");
        });
    }

    async get_db() {
        let db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => { console.log(err); });
        if (!db) { return; }
        else { return db.db("UsersDB");; }
    }

    async insert_user(person, collection) {
        let self = this;
        return new Promise(async function (resolve, reject) {
            let stat = await self.dbase.collection(collection).insertOne(person)
                .catch(err => { reject(err); });
            if (stat) {
                console.log("1 document inserted");
                resolve({ status: 0, txt: 'ok inserted' });
            } else {
                resolve({ status: 1, txt: err });
            }
        })
    }
    async update_user(id, person, collection) {
        var o_id = new ObjectId(id);
        let docs = await this.dbase.collection(collection).updateOne({ _id: o_id }, { $set: person }, { upsert: true })
            .catch(err => { return { status: 0, txt: err }; });
        if (docs) {
            console.log("1 document(s) updated");
            return { status: 0, txt: 'ok updated' };
        } else {
            return { status: 1, txt: '' };
        }
    }
    async delete_user(id, collection) {
        var o_id = new ObjectId(id);
        let docs = await this.dbase.collection(collection).deleteOne({ _id: o_id })
            .catch(err => { return { status: 0, txt: err }; });
        if (docs) {
            console.log("1 document(s) deleted");
            return { status: 0, txt: 'ok deleted' };
        } else {
            return { status: 1, txt: '' };
        }
    }

    async get_user(person, collection) {
        let data = await this.dbase.collection(collection).findOne(person)
            .catch(err => { console.log(err); });
        if (!data) { return ''; }
        else { return data; }
    }

    async get_user_by_id(id, collection) {
        let self = this;
        return new Promise(async function (resolve, reject) {
            var o_id = new ObjectId(id);
            let data = await self.dbase.collection(collection).findOne({ _id: o_id })
                .catch(err => { return reject(err) });
            if (!data) { resolve(''); }
            else { resolve(data); }
        })
    }

    async get_user_all(person, collection) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.dbase.collection(collection).find(person).toArray(function (err, data) {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }


}
var users = new users_class();
module.exports = users;