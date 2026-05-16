export interface PinAPI {
  findAll: () => Promise<PinSimple[]>;
  find: (id: string) => Promise<PinDetail>;
  search: (query: string) => Promise<PinSimple[]>;
}

export type Author = {
  name: string;
  avatar: string;
  followers: number;
  bio: string;
};

export type PinSimple = {
  id: string;
  title: string;
  image: string;
  aspectRatio: string;
  category: string;
  saves: number;
  author: Author;
};

export type PinDetail = PinSimple & {
  description: string;
  tags: string[];
  domain: string;
};
