export default class PageResult<T> {
  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
    this.limit = limit;
    this.itemsFrom = (page - 1) * limit + 1;
    this.itemsTo = this.itemsFrom + limit - 1;
  }
  items: T[];
  total: number;
  totalPages: number;
  limit: number;
  itemsFrom: number;
  itemsTo: number;
}
