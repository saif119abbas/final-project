export default interface IRepository<T, TInsert> {
  create(entity: TInsert): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(page: number, limit: number): Promise<{ data: T[]; total: number }>;
  update(id: string, entity: Partial<TInsert>): Promise<T>;
  delete(id: string): Promise<void>;
}
