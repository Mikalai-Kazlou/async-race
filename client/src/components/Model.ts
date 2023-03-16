import * as Type from '../modules/types';
import * as Enum from '../modules/enums';

export default class Model {
  protected baseURL = Enum.Constants.BaseURL;

  private iPagination: Type.TPagination = {
    pages: {
      current: 1,
      total: 1,
    },
    items: {
      limit: 10,
      total: 0,
    },
    sorting: {
      sort: '',
      order: Enum.SortingOrder.Asc,
    },
  };

  public get pagination(): Type.TPagination {
    return this.iPagination;
  }

  protected recalculateTotalPages(): void {
    const total = Math.ceil(this.iPagination.items.total / this.iPagination.items.limit);
    this.iPagination.pages.total = total || 1;
  }

  protected async api<T>(url: string, options: RequestInit = {}): Promise<T> {
    return fetch(url, options).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<T>;
    });
  }
}
