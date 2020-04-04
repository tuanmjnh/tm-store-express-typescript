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
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../../models/users/settings");
class UserSettingController {
    constructor() {
        this.path = '/user-setting';
        this.select = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield settings_1.MUserSetting.find({ user_id: req.verify._id });
                if (find && find.length)
                    return res.status(200).json(find[0]);
                const data = new settings_1.MUserSetting({ user_id: req.verify._id });
                const rs = yield data.save();
                if (rs)
                    return res.status(200).json(rs);
                else
                    return res.status(200).json([]);
            }
            catch (e) {
                return res.status(500).send('invalid');
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // if (!req.params.id) return res.status(500).send('Incorrect Id!')
                if (!req.body || Object.keys(req.body).length < 1)
                    return res.status(500).send('invalid');
                settings_1.MUserSetting.updateOne({ user_id: req.verify._id }, {
                    $set: {
                        language: req.body.language,
                        font: req.body.font,
                        dense: req.body.dense,
                        format: req.body.format,
                        darkMode: req.body.darkMode,
                    },
                }, (e, rs) => {
                    // { multi: true, new: true },
                    if (e)
                        return res.status(500).send(e);
                    return res.status(200).json(rs);
                });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send('invalid');
            }
        });
    }
}
exports.default = new UserSettingController();
//# sourceMappingURL=settings.js.map