export interface PhotoApi {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface InventoryItem extends PhotoApi {
  stock: number;
}
