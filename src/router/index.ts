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
export class Routes {
  public router = Router();
  public routes(app): void {
    // RoutesController
    app
      .route(RoutesController.path)
      .get(RoutesController.select)
      .post(RoutesController.insert)
      .put(RoutesController.update)
      .patch(RoutesController.lock)
      .delete(RoutesController.delete);
    app.route(`${RoutesController.path}/find`).get(RoutesController.find);
    app.route(`${RoutesController.path}/get-meta`).get(RoutesController.getMeta);
    // router.route('/routes/template').get(routes.insertTemplate)
    app.route(`${RoutesController.path}/update-order`).put(RoutesController.updateOrder);

    // UsersController
    app
      .route(UsersController.path)
      .get(UsersController.select)
      .post(UsersController.insert)
      .put(UsersController.update)
      .patch(UsersController.lock)
      .delete(UsersController.delete);
    app.route(`${UsersController.path}/find`).get(UsersController.find);
    app.route(`${UsersController.path}/verified`).post(UsersController.verified);
    app.route(`${UsersController.path}/reset-password`).post(UsersController.resetPassword);
    app.route(`${UsersController.path}/change-password`).post(UsersController.changePassword);

    // UserSettingController
    app
      .route(UserSettingController)
      .get(UserSettingController.select)
      .put(UserSettingController.update);

    // RolesController
    app
      .route(RolesController.path)
      .get(RolesController.select)
      .post(RolesController.insert)
      .put(RolesController.update)
      .patch(RolesController.lock)
      .delete(RolesController.delete);
    app.route(`${RolesController.path}/find`).get(RolesController.find);

    // AuthController
    app
      .route(AuthController.path)
      .get(AuthController.get)
      .post(AuthController.post);

    // Types
    app
      .route(TypesController.path)
      .get(TypesController.select)
      .post(TypesController.insert)
      .put(TypesController.update)
      .patch(TypesController.lock)
      .delete(TypesController.delete);
    app.route(`${TypesController.path}/find`).get(TypesController.find);
    app.route(`${TypesController.path}/get-key`).get(TypesController.getKey);
    app.route(`${TypesController.path}/get-meta`).get(TypesController.getMeta);

    // FileManagerController
    app
      .route(FileManagerController.path)
      .get(FileManagerController.get)
      .post(FileManagerController.post);
    app.route(`${FileManagerController.path}/directories`).get(FileManagerController.getDirectories);
    app.route(`${FileManagerController.path}/files`).get(FileManagerController.getFiles);

    // Categories
    app
      .route(CategoryController.path)
      .get(CategoryController.select)
      .post(CategoryController.insert)
      .put(CategoryController.update)
      .patch(CategoryController.lock)
      .delete(CategoryController.delete);
    app.route(`${CategoryController.path}/find`).get(CategoryController.find);
    app.route(`${CategoryController.path}/get-attr`).get(CategoryController.getAttr);
    app.route(`${CategoryController.path}/update-order`).put(CategoryController.updateOrder);

    // NewsController
    app
      .route(NewsController.path)
      .get(NewsController.select)
      .post(NewsController.insert)
      .put(NewsController.update)
      .patch(NewsController.lock)
      .delete(NewsController.delete);
    app.route(`${NewsController.path}/find`).get(NewsController.find);
    app.route(`${NewsController.path}/get-attr`).get(NewsController.getAttr);

    // ProductsController
    app
      .route(ProductsController.path)
      .get(ProductsController.select)
      .post(ProductsController.insert)
      .put(ProductsController.update)
      .patch(ProductsController.lock)
      .delete(ProductsController.delete);
    app.route(`${ProductsController.path}/find`).get(ProductsController.find);
    app.route(`${ProductsController.path}/exist`).get(ProductsController.exist);
    app.route(`${ProductsController.path}/get-attr`).get(ProductsController.getAttr);

    // ProductImportsController
    app
      .route(ProductImportsController.path)
      .get(ProductImportsController.select)
      .post(ProductImportsController.finds)
      .put(ProductImportsController.imports);

    // ProductExportsController
    app
      .route(ProductExportsController.path)
      .get(ProductExportsController.select)
      .post(ProductExportsController.finds)
      .put(ProductExportsController.exports);

    // ProductReportsController
    app.route(ProductReportsController.path).get(ProductReportsController.date);
    app.route(`${ProductReportsController.path}/weekly`).get(ProductReportsController.weekly);
    app.route(`${ProductReportsController.path}/month`).get(ProductReportsController.month);
    app.route(`${ProductReportsController.path}/quarter`).get(ProductReportsController.quarter);
    app.route(`${ProductReportsController.path}/year`).get(ProductReportsController.year);
    app.route(`${ProductReportsController.path}/five-year`).get(ProductReportsController.fiveYear);
  }
}
export default Routes;
