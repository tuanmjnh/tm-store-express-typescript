"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils/prototypes");
require("./config");
// Appliction
const app_1 = __importDefault(require("./services/app"));
app_1.default
    .listen(process.env.PORT) // , '192.168.1.10' // '127.0.0.1'
    .on('listening', () => {
    // process.env.HOST = `http://${server.address().address}:${port}`
    console.log(`Web server listening on: ${process.env.PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
    console.log(`Base URL: ${process.env.BASE_URL}`);
})
    .on('error', (err) => {
    console.log(err);
});
//# sourceMappingURL=server.js.map