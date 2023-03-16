import Model from './Model';

import * as Type from '../modules/types';
import * as Enum from '../modules/enums';

export default class Statistic extends Model {
  constructor() {
    super();
    this.pagination.sorting.sort = Enum.SortingColumns.Time;
  }

  async getList(pagination: Type.TPagination): Promise<Type.TWinner[]> {
    const page = Math.min(pagination.pages.current, this.pagination.pages.total);

    const url = `${this.baseURL}/winners/?_page=${page}&_limit=${pagination.items.limit}&_sort=${pagination.sorting.sort}&_order=${pagination.sorting.order}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    this.pagination.items.limit = pagination.items.limit;
    this.pagination.items.total = Number(response.headers.get('X-Total-Count') || 0);

    this.pagination.sorting = pagination.sorting;
    this.pagination.pages.current = page;
    this.recalculateTotalPages();

    return (await response.json()) as Type.TWinner[];
  }

  async get(id: number): Promise<Type.TWinner> {
    return this.api<Type.TWinner>(`${this.baseURL}/winners/${id}`);
  }

  async create(parameters: Type.TWinner): Promise<Type.TWinner> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    };

    const data = this.api<Type.TWinner>(`${this.baseURL}/winners`, options);

    data.then(() => {
      this.pagination.items.total += 1;
      this.recalculateTotalPages();
    });

    return data;
  }

  async update(id: number, parameters: Type.TWinnerParameters): Promise<Type.TWinner> {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    };
    return this.api<Type.TWinner>(`${this.baseURL}/winners/${id}`, options);
  }

  async remove(id: number): Promise<Type.TWinner> {
    const options: RequestInit = {
      method: 'DELETE',
    };

    const data = this.api<Type.TWinner>(`${this.baseURL}/winners/${id}`, options);

    data.then(() => {
      this.pagination.items.total -= 1;
      this.recalculateTotalPages();
    });

    return data;
  }
}
