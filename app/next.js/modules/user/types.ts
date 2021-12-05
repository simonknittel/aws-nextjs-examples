export interface User {
  id: string;
  name: string;
  creationDate: number;
  creator?: string;
  lastEditDate?: number;
  archivedDate?: number;
}

export interface CreateItem {
  name: User['name'];
}

export interface PatchItem {
  name?: User['name'];
  archivedDate?: string | null;
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
