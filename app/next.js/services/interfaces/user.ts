export interface User {
  id: string;
  name: string;
  creationDate: number;
  lastEditDate?: number;
}

export interface CreateItem {
  name: User['name'];
}

export interface PatchItem {
  name?: User['name'];
}

export interface DeleteItem {
  id: User['id'];
}

export interface UserServiceInterface {
  create(items: CreateItem[]): Promise<void>;
  findAll(): Promise<User[]>;
  findById(ids: User['id'][]): Promise<User[]>;
  update(id: User['id'], patch: PatchItem): Promise<void>;
  delete(items: DeleteItem[]): Promise<void>;
}
