import { Router } from 'express';
import AuthController from '../controllers/auth';
import CategoryController from '../controllers/categories';
export class Routes {
  public router = Router();
  // AuthController
  public authController: AuthController = new AuthController();
  public categoryController: CategoryController = new CategoryController();
  public routes(app): void {
    // AuthController
    app
      .route(this.authController.path)
      .get(this.authController.get)
      .post(this.authController.post);

    // Categories
    app
      .route(this.categoryController.path)
      .get(this.categoryController.select)
      .post(this.categoryController.insert)
      .put(this.categoryController.update)
      .patch(this.categoryController.lock)
      .delete(this.categoryController.delete);
    app.route(`${this.categoryController.path}/find`).get(this.categoryController.find);
    app.route(`${this.categoryController.path}/get-attr`).get(this.categoryController.getAttr);
    app.route(`${this.categoryController.path}/update-order`).put(this.categoryController.updateOrder);
  }
}
export default Routes;
