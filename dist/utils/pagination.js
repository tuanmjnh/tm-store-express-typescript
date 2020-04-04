"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pagination {
    constructor() {
        this.get = (data, offset = 0, limit = 10) => {
            if (!data || data.length < 1)
                return data;
            return data.slice(offset * limit, (offset + 1) * limit);
        };
    }
}
exports.default = new Pagination();
//# sourceMappingURL=pagination.js.map