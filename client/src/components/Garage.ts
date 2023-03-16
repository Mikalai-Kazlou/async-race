import Model from './Model';
import Tools from './Tools';

import cars from '../modules/cars';
import * as Type from '../modules/types';

export default class Garage extends Model {
  private visibleCars: Type.TCar[] = [];

  constructor() {
    super();
    this.pagination.items.limit = 7;
  }

  async getAll(): Promise<Type.TCar[]> {
    return this.api<Type.TCar[]>(`${this.baseURL}/garage`);
  }

  async getList(pagination: Type.TPagination): Promise<Type.TCar[]> {
    const page = Math.min(pagination.pages.current, this.pagination.pages.total);
    const response = await fetch(`${this.baseURL}/garage/?_page=${page}&_limit=${pagination.items.limit}`);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    this.pagination.items.limit = pagination.items.limit;
    this.pagination.items.total = Number(response.headers.get('X-Total-Count') || 0);

    this.pagination.pages.current = page;
    this.recalculateTotalPages();

    this.visibleCars = (await response.json()) as Type.TCar[];
    return this.visibleCars;
  }

  async create(parameters: Type.TCarParameters): Promise<Type.TCar> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    };

    const data = this.api<Type.TCar>(`${this.baseURL}/garage`, options);

    data.then(() => {
      this.pagination.items.total += 1;
      this.recalculateTotalPages();
    });

    return data;
  }

  async update(id: number, parameters: Type.TCarParameters): Promise<Type.TCar> {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    };
    return this.api<Type.TCar>(`${this.baseURL}/garage/${id}`, options);
  }

  async remove(id: number): Promise<Type.TCar> {
    const options: RequestInit = {
      method: 'DELETE',
    };

    const data = this.api<Type.TCar>(`${this.baseURL}/garage/${id}`, options);

    data.then(() => {
      this.pagination.items.total -= 1;
      this.recalculateTotalPages();
    });

    return data;
  }

  async start(id: number): Promise<Type.TCarDriveParameters> {
    const options: RequestInit = {
      method: 'PATCH',
    };
    return this.api<Type.TCarDriveParameters>(`${this.baseURL}/engine/?id=${id}&status=started`, options);
  }

  async stop(id: number): Promise<Type.TCarDriveParameters> {
    const options: RequestInit = {
      method: 'PATCH',
    };
    return this.api<Type.TCarDriveParameters>(`${this.baseURL}/engine/?id=${id}&status=stopped`, options);
  }

  async drive(id: number): Promise<Type.TCarResult> {
    const options: RequestInit = {
      method: 'PATCH',
    };
    return this.api<Type.TCarResult>(`${this.baseURL}/engine/?id=${id}&status=drive`, options);
  }

  getRandomCarParameters(): Type.TCarParameters {
    const carDataObject = cars[Tools.getRandomNumber(cars.length)];

    const { brand } = carDataObject;
    const model = carDataObject.models[Tools.getRandomNumber(carDataObject.models.length)];

    return {
      name: `${brand} ${model}`,
      color: Tools.getRandomColor(),
    };
  }

  getTrackTime(driveParameters: Type.TCarDriveParameters): number {
    return +(driveParameters.distance / driveParameters.velocity / 1000).toFixed(2);
  }

  getVisibleCars(): Type.TCar[] {
    return this.visibleCars;
  }
}
