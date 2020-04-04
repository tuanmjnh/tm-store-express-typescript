"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = __importDefault(require("../controllers/routes"));
const users_1 = __importDefault(require("../controllers/users"));
const settings_1 = __importDefault(require("../controllers/users/settings"));
const roles_1 = __importDefault(require("../controllers/roles"));
const auth_1 = __importDefault(require("../controllers/auth"));
const types_1 = __importDefault(require("../controllers/types"));
const file_manager_1 = __importDefault(require("../controllers/file-manager"));
const categories_1 = __importDefault(require("../controllers/categories"));
const news_1 = __importDefault(require("../controllers/news"));
const products_1 = __importDefault(require("../controllers/products"));
const imports_1 = __importDefault(require("../controllers/warehouse/imports"));
const exports_1 = __importDefault(require("../controllers/warehouse/exports"));
const reports_1 = __importDefault(require("../controllers/warehouse/reports"));
const test_1 = __importDefault(require("../controllers/test"));
class Routes {
    // RoutesController
    constructor() {
        this.router = express_1.Router();
        this.router
            .route(routes_1.default.path)
            .get(routes_1.default.select)
            .post(routes_1.default.insert)
            .put(routes_1.default.update)
            .patch(routes_1.default.lock)
            .delete(routes_1.default.delete);
        this.router.route(`${routes_1.default.path}/find`).get(routes_1.default.find);
        this.router.route(`${routes_1.default.path}/get-meta`).get(routes_1.default.getMeta);
        // router.route('/routes/template').get(routes.insertTemplate)
        this.router.route(`${routes_1.default.path}/update-order`).put(routes_1.default.updateOrder);
        // UsersController
        this.router
            .route(users_1.default.path)
            .get(users_1.default.select)
            .post(users_1.default.insert)
            .put(users_1.default.update)
            .patch(users_1.default.lock)
            .delete(users_1.default.delete);
        this.router.route(`${users_1.default.path}/find`).get(users_1.default.find);
        this.router.route(`${users_1.default.path}/verified`).post(users_1.default.verified);
        this.router.route(`${users_1.default.path}/reset-password`).post(users_1.default.resetPassword);
        this.router.route(`${users_1.default.path}/change-password`).post(users_1.default.changePassword);
        // UserSettingController
        this.router
            .route(settings_1.default.path)
            .get(settings_1.default.select)
            .put(settings_1.default.update);
        // RolesController
        this.router
            .route(roles_1.default.path)
            .get(roles_1.default.select)
            .post(roles_1.default.insert)
            .put(roles_1.default.update)
            .patch(roles_1.default.lock)
            .delete(roles_1.default.delete);
        this.router.route(`${roles_1.default.path}/find`).get(roles_1.default.find);
        // AuthController
        this.router
            .route(auth_1.default.path)
            .get(auth_1.default.get)
            .post(auth_1.default.post);
        // Types
        this.router
            .route(types_1.default.path)
            .get(types_1.default.select)
            .post(types_1.default.insert)
            .put(types_1.default.update)
            .patch(types_1.default.lock)
            .delete(types_1.default.delete);
        this.router.route(`${types_1.default.path}/find`).get(types_1.default.find);
        this.router.route(`${types_1.default.path}/get-key`).get(types_1.default.getKey);
        this.router.route(`${types_1.default.path}/get-meta`).get(types_1.default.getMeta);
        // FileManagerController
        this.router
            .route(file_manager_1.default.path)
            .get(file_manager_1.default.get)
            .post(file_manager_1.default.post);
        this.router.route(`${file_manager_1.default.path}/directories`).get(file_manager_1.default.getDirectories);
        this.router.route(`${file_manager_1.default.path}/files`).get(file_manager_1.default.getFiles);
        // Categories
        this.router
            .route(categories_1.default.path)
            .get(categories_1.default.select)
            .post(categories_1.default.insert)
            .put(categories_1.default.update)
            .patch(categories_1.default.lock)
            .delete(categories_1.default.delete);
        this.router.route(`${categories_1.default.path}/find`).get(categories_1.default.find);
        this.router.route(`${categories_1.default.path}/get-attr`).get(categories_1.default.getAttr);
        this.router.route(`${categories_1.default.path}/update-order`).put(categories_1.default.updateOrder);
        // NewsController
        this.router
            .route(news_1.default.path)
            .get(news_1.default.select)
            .post(news_1.default.insert)
            .put(news_1.default.update)
            .patch(news_1.default.lock)
            .delete(news_1.default.delete);
        this.router.route(`${news_1.default.path}/find`).get(news_1.default.find);
        this.router.route(`${news_1.default.path}/get-attr`).get(news_1.default.getAttr);
        // ProductsController
        this.router
            .route(products_1.default.path)
            .get(products_1.default.select)
            .post(products_1.default.insert)
            .put(products_1.default.update)
            .patch(products_1.default.lock)
            .delete(products_1.default.delete);
        this.router.route(`${products_1.default.path}/find`).get(products_1.default.find);
        this.router.route(`${products_1.default.path}/exist`).get(products_1.default.exist);
        this.router.route(`${products_1.default.path}/get-attr`).get(products_1.default.getAttr);
        // ProductImportsController
        this.router
            .route(imports_1.default.path)
            .get(imports_1.default.select)
            .post(imports_1.default.finds)
            .put(imports_1.default.imports);
        // ProductExportsController
        this.router
            .route(exports_1.default.path)
            .get(exports_1.default.select)
            .post(exports_1.default.finds)
            .put(exports_1.default.exports);
        // ProductReportsController
        this.router.route(reports_1.default.path).get(reports_1.default.date);
        this.router.route(`${reports_1.default.path}/weekly`).get(reports_1.default.weekly);
        this.router.route(`${reports_1.default.path}/month`).get(reports_1.default.month);
        this.router.route(`${reports_1.default.path}/quarter`).get(reports_1.default.quarter);
        this.router.route(`${reports_1.default.path}/year`).get(reports_1.default.year);
        this.router.route(`${reports_1.default.path}/five-year`).get(reports_1.default.fiveYear);
        // TestController
        this.router
            .route(test_1.default.path)
            .get(test_1.default.get)
            .post(test_1.default.post)
            .put(test_1.default.put)
            .patch(test_1.default.patch)
            .delete(test_1.default.delete);
    }
}
exports.Routes = Routes;
exports.default = Routes;
//# sourceMappingURL=index.js.map