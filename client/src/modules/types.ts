export type TCar = {
  id: number;
  name: string;
  color: string;
};

export type TCarParameters = Omit<TCar, 'id'>;

export type TCarDriveParameters = {
  velocity: number;
  distance: number;
};

export type TCarResult = {
  success: boolean;
};

export type TWinner = {
  id: number;
  wins: number;
  time: number;
};

export type TWinnerParameters = Omit<TWinner, 'id'>;

export type TPages = {
  current: number;
  total: number;
};

export type TItems = {
  limit: number;
  total: number;
};

export type TSorting = {
  sort: string;
  order: string;
};

export type TPagination = {
  pages: TPages;
  items: TItems;
  sorting: TSorting;
};

export type TCarOwnControls = {
  uiButtonStart: HTMLButtonElement;
  uiButtonStop: HTMLButtonElement;
  uiButtonSelect: HTMLButtonElement;
  uiButtonRemove: HTMLButtonElement;
};
