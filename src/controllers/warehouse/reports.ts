import moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { MProductImport } from '../../models/warehouse/imports';
import { MProductExports } from '../../models/warehouse/exports';
// import { MProductImportItems } from '../../models/warehouse/import-items';
// import { MProductExportItems } from '../../models/warehouse/export-items';
// import { MProduct } from '../../models/products';
// import { MCategory } from '../../models/categories';

class ProductReportsController {
  public path = '/product-reports';
  public date = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = {
        imports: [] as any,
        exports: [] as any,
      };
      const curent = moment().date();
      const labelsLength = 25;
      const conditions = [
        // Having
        // { $match: { flag: 1 } },
        // Group
        {
          $group: {
            _id: {
              curent: { $dayOfMonth: '$created_at' },
              labels: { $hour: { date: '$created_at', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } },
            },
            total_bill: { $sum: 1 },
            total_product: { $sum: '$total_product' },
            total_price: { $sum: '$total_price' },
            total_quantity: { $sum: '$total_quantity' },
          },
        },
        // Having
        { $match: { '_id.curent': curent } },
        // Sort
        { $sort: { '_id.curent': -1, '_id.labels': 1 } },
      ];
      // imports
      const imports = await MProductImport.aggregate(conditions);
      if (imports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = imports.find(x => x._id.labels === i);
          if (item) {
            result.imports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.imports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      // exports
      const exports = await MProductExports.aggregate(conditions);
      if (exports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = exports.find(x => x._id.labels === i);
          if (item) {
            result.exports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.exports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public weekly = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = {
        imports: [] as any,
        exports: [] as any,
      };
      const curent = moment().week();
      const labelsLength = 8;
      const conditions = [
        {
          $group: {
            _id: {
              curent: { $isoWeek: '$created_at' },
              labels: { $isoDayOfWeek: '$created_at' },
            },
            total_bill: { $sum: 1 },
            total_product: { $sum: '$total_product' },
            total_price: { $sum: '$total_price' },
            total_quantity: { $sum: '$total_quantity' },
          },
        },
        // Having
        { $match: { '_id.curent': curent } },
        // Sort
        { $sort: { '_id.curent': -1, '_id.labels': 1 } },
      ];
      // imports
      const imports = await MProductImport.aggregate(conditions);
      if (imports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = imports.find(x => x._id.labels === i);
          if (item) {
            result.imports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.imports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      // exports
      const exports = await MProductExports.aggregate(conditions);
      if (exports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = exports.find(x => x._id.labels === i);
          if (item) {
            result.exports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.exports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public month = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = {
        imports: [] as any,
        exports: [] as any,
      };
      const curent = moment().month() + 1;
      const labelsLength = moment().daysInMonth() + 1;
      const conditions = [
        // Having
        // { $match: { flag: 1 } },
        // Group
        {
          $group: {
            _id: {
              curent: { $month: '$created_at' },
              labels: { $dayOfMonth: '$created_at' },
            },
            total_bill: { $sum: 1 },
            total_product: { $sum: '$total_product' },
            total_price: { $sum: '$total_price' },
            total_quantity: { $sum: '$total_quantity' },
          },
        },
        // Having
        { $match: { '_id.curent': curent } },
        // Sort
        { $sort: { '_id.curent': -1, '_id.labels': 1 } },
      ];
      // imports
      const imports = await MProductImport.aggregate(conditions);
      if (imports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = imports.find(x => x._id.labels === i);
          if (item) {
            result.imports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.imports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      // exports
      const exports = await MProductExports.aggregate(conditions);
      if (exports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = exports.find(x => x._id.labels === i);
          if (item) {
            result.exports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.exports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public quarter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = {
        imports: [] as any,
        exports: [] as any,
      };
      const curent = moment().year();
      const labelsLength = 5;
      const conditions = [
        {
          $project: {
            total_product: 1,
            total_price: 1,
            total_quantity: 1,
            year: { $year: '$created_at' },
            quarter: {
              $trunc: {
                $add: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          {
                            $month: '$created_at',
                          },
                          1,
                        ],
                      },
                      3,
                    ],
                  },
                  1,
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: {
              curent: '$year',
              labels: '$quarter',
            },
            total_bill: { $sum: 1 },
            total_product: { $sum: '$total_product' },
            total_price: { $sum: '$total_price' },
            total_quantity: { $sum: '$total_quantity' },
          },
        },
        // Having
        { $match: { '_id.curent': curent } },
        // Sort
        { $sort: { '_id.curent': -1, '_id.labels': 1 } },
      ];
      // imports
      const imports = await MProductImport.aggregate(conditions);
      if (imports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = imports.find(x => x._id.labels === i);
          if (item) {
            result.imports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.imports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      // exports
      const exports = await MProductExports.aggregate(conditions);
      if (exports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = exports.find(x => x._id.labels === i);
          if (item) {
            result.exports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.exports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public year = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = {
        imports: [] as any,
        exports: [] as any,
      };
      const curent = moment().year();
      const labelsLength = 13;
      const conditions = [
        {
          $group: {
            _id: {
              curent: { $year: '$created_at' },
              labels: { $month: '$created_at' },
            },
            total_bill: { $sum: 1 },
            total_product: { $sum: '$total_product' },
            total_price: { $sum: '$total_price' },
            total_quantity: { $sum: '$total_quantity' },
          },
        },
        // Having
        { $match: { '_id.curent': curent } },
        // Sort
        { $sort: { '_id.curent': -1, '_id.labels': 1 } },
      ];
      // imports
      const imports = await MProductImport.aggregate(conditions);
      if (imports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = imports.find(x => x._id.labels === i);
          if (item) {
            result.imports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.imports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      // exports
      const exports = await MProductExports.aggregate(conditions);
      if (exports) {
        for (let i = 1; i < labelsLength; i++) {
          const item = exports.find(x => x._id.labels === i);
          if (item) {
            result.exports.push({
              curent: item._id.curent,
              labels: item._id.labels,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.exports.push({
              curent,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };

  public fiveYear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = {
        imports: [] as any,
        exports: [] as any,
      };
      const labelsLength = moment().year() + 1;
      const curent = labelsLength - 5;
      const conditions = [
        {
          $group: {
            _id: { $year: '$created_at' },
            total_bill: { $sum: 1 },
            total_product: { $sum: '$total_product' },
            total_price: { $sum: '$total_price' },
            total_quantity: { $sum: '$total_quantity' },
          },
        },
        // Having
        { $match: { _id: { $gt: curent } } },
        // Sort
        { $sort: { _id: 1 } },
      ];
      // imports
      const imports = await MProductImport.aggregate(conditions);
      if (imports) {
        for (let i = curent; i < labelsLength; i++) {
          const item = imports.find(x => x._id === i);
          if (item) {
            result.imports.push({
              curent: item._id,
              labels: item._id,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.imports.push({
              curent: i,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      // exports
      const exports = await MProductExports.aggregate(conditions);
      if (exports) {
        for (let i = curent; i < labelsLength; i++) {
          const item = exports.find(x => x._id === i);
          if (item) {
            result.exports.push({
              curent: item._id,
              labels: item._id,
              data: {
                total_bill: item.total_bill,
                total_product: item.total_product,
                total_price: item.total_price,
                total_quantity: item.total_quantity,
              },
            });
          } else {
            result.exports.push({
              curent: i,
              labels: i,
              data: {
                total_bill: 0,
                total_product: 0,
                total_price: 0,
                total_quantity: 0,
              },
            });
          }
        }
      }
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).send('invalid');
    }
  };
}
export default new ProductReportsController();
