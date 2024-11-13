export type GenericWithId<T extends object> = T & { id: string };
export type PaginatedData<Y> = {
  data: Y[];
  count: number;
};
