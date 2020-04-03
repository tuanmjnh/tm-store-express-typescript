import { Router } from 'express';
import RoutesController from '../controllers/routes';
import UsersController from '../controllers/users';
import UserSettingController from '../controllers/users/settings';
import RolesController from '../controllers/roles';
import AuthController from '../controllers/auth';
import TypesController from '../controllers/types';
import FileManagerController from '../controllers/file-manager';
import CategoryController from '../controllers/categories';
import NewsController from '../controllers/news';
import ProductsController from '../controllers/products';
import ProductImportsController from '../controllers/warehouse/imports';
import ProductExportsController from '../controllers/warehouse/exports';
import ProductReportsController from '../controllers/warehouse/reports';
import TestController from '../controllers/test';
export class Routes {
  public router = Router();
  // RoutesController
  constructor() {
    this.router
      .route(RoutesController.path)
      .get(RoutesController.select)
      .post(RoutesController.insert)
      .put(RoutesController.update)
      .patch(RoutesController.lock)
      .delete(RoutesController.delete);
    this.router.route(`${RoutesController.path}/find`).get(RoutesController.find);
    this.router.route(`${RoutesController.path}/get-meta`).get(RoutesController.getMeta);
    // router.route('/routes/template').get(routes.insertTemplate)
    this.router.route(`${RoutesController.path}/update-order`).put(RoutesController.updateOrder);

    // UsersController
    this.router
      .route(UsersController.path)
      .get(UsersController.select)
      .post(UsersController.insert)
      .put(UsersController.update)
      .patch(UsersController.lock)
      .delete(UsersController.delete);
    this.router.route(`${UsersController.path}/find`).get(UsersController.find);
    this.router.route(`${UsersController.path}/verified`).post(UsersController.verified);
    this.router.route(`${UsersController.path}/reset-password`).post(UsersController.resetPassword);
    this.router.route(`${UsersController.path}/change-password`).post(UsersController.changePassword);

    // UserSettingController
    this.router
      .route(UserSettingController.path)
      .get(UserSettingController.select)
      .put(UserSettingController.update);

    // RolesController
    this.router
      .route(RolesController.path)
      .get(RolesController.select)
      .post(RolesController.insert)
      .put(RolesController.update)
      .patch(RolesController.lock)
      .delete(RolesController.delete);
    this.router.route(`${RolesController.path}/find`).get(RolesController.find);

    // AuthController
    this.router
      .route(AuthController.path)
      .get(AuthController.get)
      .post(AuthController.post);

    // Types
    this.router
      .route(TypesController.path)
      .get(TypesController.select)
      .post(TypesController.insert)
      .put(TypesController.update)
      .patch(TypesController.lock)
      .delete(TypesController.delete);
    this.router.route(`${TypesController.path}/find`).get(TypesController.find);
    this.router.route(`${TypesController.path}/get-key`).get(TypesController.getKey);
    this.router.route(`${TypesController.path}/get-meta`).get(TypesController.getMeta);

    // FileManagerController
    this.router
      .route(FileManagerController.path)
      .get(FileManagerController.get)
      .post(FileManagerController.post);
    this.router.route(`${FileManagerController.path}/directories`).get(FileManagerController.getDirectories);
    this.router.route(`${FileManagerController.path}/files`).get(FileManagerController.getFiles);

    // Categories
    this.router
      .route(CategoryController.path)
      .get(CategoryController.select)
      .post(CategoryController.insert)
      .put(CategoryController.update)
      .patch(CategoryController.lock)
      .delete(CategoryController.delete);
    this.router.route(`${CategoryController.path}/find`).get(CategoryController.find);
    this.router.route(`${CategoryController.path}/get-attr`).get(CategoryController.getAttr);
    this.router.route(`${CategoryController.path}/update-order`).put(CategoryController.updateOrder);

    // NewsController
    this.router
      .route(NewsController.path)
      .get(NewsController.select)
      .post(NewsController.insert)
      .put(NewsController.update)
      .patch(NewsController.lock)
      .delete(NewsController.delete);
    this.router.route(`${NewsController.path}/find`).get(NewsController.find);
    this.router.route(`${NewsController.path}/get-attr`).get(NewsController.getAttr);

    // ProductsController
    this.router
      .route(ProductsController.path)
      .get(ProductsController.select)
      .post(ProductsController.insert)
      .put(ProductsController.update)
      .patch(ProductsController.lock)
      .delete(ProductsController.delete);
    this.router.route(`${ProductsController.path}/find`).get(ProductsController.find);
    this.router.route(`${ProductsController.path}/exist`).get(ProductsController.exist);
    this.router.route(`${ProductsController.path}/get-attr`).get(ProductsController.getAttr);

    // ProductImportsController
    this.router
      .route(ProductImportsController.path)
      .get(ProductImportsController.select)
      .post(ProductImportsController.finds)
      .put(ProductImportsController.imports);

    // ProductExportsController
    this.router
      .route(ProductExportsController.path)
      .get(ProductExportsController.select)
      .post(ProductExportsController.finds)
      .put(ProductExportsController.exports);

    // ProductReportsController
    this.router.route(ProductReportsController.path).get(ProductReportsController.date);
    this.router.route(`${ProductReportsController.path}/weekly`).get(ProductReportsController.weekly);
    this.router.route(`${ProductReportsController.path}/month`).get(ProductReportsController.month);
    this.router.route(`${ProductReportsController.path}/quarter`).get(ProductReportsController.quarter);
    this.router.route(`${ProductReportsController.path}/year`).get(ProductReportsController.year);
    this.router.route(`${ProductReportsController.path}/five-year`).get(ProductReportsController.fiveYear);

    // TestController
    this.router
      .route(TestController.path)
      .get(TestController.get)
      .post(TestController.post)
      .put(TestController.put)
      .patch(TestController.patch)
      .delete(TestController.delete);
  }
}
export default Routes;
