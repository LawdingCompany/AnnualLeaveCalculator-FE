type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
  timestamp: string;
};

type Category = {
  id: number;
  name: string;
};

type DictionaryItem = {
  id: number;
  category: Category;
  question: string;
  content: string;
  deleted: boolean;
  deletedAt: string | null;
};
