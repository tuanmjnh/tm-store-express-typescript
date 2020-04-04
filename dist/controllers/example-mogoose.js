"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require('mongoose');
var User = require('../models/user');
module.exports.find = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        // you can pass query parameter to get particular record
        User.find({ name: username })
            .then((doc) => {
            console.log(doc);
        })
            .catch((e) => {
            console.log(e);
        });
    });
};
module.exports.findById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose.Types.ObjectId.isValid(id)) {
            User.findById(id)
                .then((doc) => {
                if (doc) {
                    console.log(doc);
                }
                else {
                    console.log('No data exist for this id');
                }
            })
                .catch((e) => {
                console.log(e);
            });
        }
        else {
            console.log('Please provide correct Id');
        }
    });
};
module.exports.findOne = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose.Types.ObjectId.isValid(id)) {
            User.findOne({ _id: id })
                .then((doc) => {
                if (doc) {
                    console.log(doc);
                }
                else {
                    console.log('no data exist for this id');
                }
            })
                .catch((e) => {
                console.log(e);
            });
        }
        else {
            console.log('please provide correct id');
        }
    });
};
module.exports.save = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        let Newuser = new User(user); // this is modal object.
        Newuser.save()
            .then((data) => {
            console.log(data);
        })
            .catch((e) => {
            console.log(e);
        });
    });
};
module.exports.insert = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        let Newuser = new User(user);
        let Newuser1 = new User(user);
        let Newuser2 = new User(user);
        // it srore directly to collection
        User.collection.insert([Newuser, Newuser1, Newuser2])
            .then((data) => {
            console.log(data);
        }).catch((e) => {
            console.log(e);
        });
    });
};
module.exports.create = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        let Newuser = new User(user);
        let Newuser1 = new User(user);
        let Newuser2 = new User(user);
        // it is using schema model for operation `User`
        User.create([Newuser, Newuser1, Newuser2])
            .then((data) => {
            console.log(data);
        }).catch((e) => {
            console.log(e);
        });
    });
};
module.exports.insertOne = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        let Newuser = new User(user);
        User.collection.insertOne(Newuser)
            .then((data) => {
            console.log(data);
        }).catch((e) => {
            console.log(e);
        });
    });
};
module.exports.findOneAndUpdate = function (id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose.Types.ObjectId.isValid(id)) {
            User.findOneAndUpdate({ _id: id }, { $set: { name: user.name } }, { new: true }).then((docs) => {
                if (docs) {
                    // resolve({ success: true, data: docs });
                    console.log(docs);
                }
                else {
                    // reject({ success: false, data: 'no such user exist' });
                    console.log(false);
                }
            }).catch((e) => {
                // reject(e);
                console.log(e);
            });
        }
        else {
            // reject({ success: 'false', data: 'provide correct key' });
            console.log(false);
        }
    });
};
module.exports.findByIdAndUpdate = function (id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose.Types.ObjectId.isValid(id)) {
            User.findByIdAndUpdate(id, { $set: { name: user.name } }, { new: true }).then((docs) => {
                if (docs) {
                    // resolve({ success: true, data: docs });
                    console.log(docs);
                }
                else {
                    // reject({ success: false, data: 'no such user exist' });
                    console.log(false);
                }
            }).catch((e) => {
                // reject(e);
                console.log(e);
            });
        }
        else {
            // reject({ success: 'false', data: 'provide correct key' });
            console.log(false);
        }
    });
};
module.exports.update = function (id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        User.update({ _id: id }, { $set: { name: user.name, state: user.state } }, { multi: true, new: true })
            .then((docs) => {
            if (docs) {
                // resolve({ success: true, data: docs });
                console.log(docs);
            }
            else {
                // reject({ success: false, data: 'no such user exist' });
                console.log(false);
            }
        }).catch((e) => {
            console.log(e);
            // reject(err);
        });
    });
};
module.exports.remove = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose.Types.ObjectId.isValid(id)) {
            User.remove({ _id: id })
                .then((docs) => {
                if (docs) {
                    // resolve({ 'success': true, data: docs });
                    console.log(docs);
                }
                else {
                    // reject({ 'success': false, data: 'no such user exist' });
                    console.log(false);
                }
            }).catch((e) => {
                // reject(err);
                console.log(e);
            });
        }
        else {
            // reject({ 'success': false, data: 'please provide correct Id' });
            console.log(false);
        }
    });
};
module.exports.findOneAndRemove = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose.Types.ObjectId.isValid(id)) {
            User.findOneAndRemove({ _id: id })
                .then((docs) => {
                if (docs) {
                    // resolve({ 'success': true, data: docs });
                    console.log(docs);
                }
                else {
                    // reject({ 'success': false, data: 'no such user exist' });
                    console.log(false);
                }
            }).catch((e) => {
                // reject(err);
                console.log(e);
            });
        }
        else {
            // reject({ 'success': false, data: 'please provide correct Id' });
            console.log(false);
        }
    });
};
//# sourceMappingURL=example-mogoose.js.map