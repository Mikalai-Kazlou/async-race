import Tools from './Tools';

import * as Type from '../modules/types';
import * as Enum from '../modules/enums';

export default class View {
  public get uiButtonGarage(): HTMLButtonElement {
    return document.querySelector('.button.to-garage') as HTMLButtonElement;
  }

  public get uiButtonWinners(): HTMLButtonElement {
    return document.querySelector('.button.to-winners') as HTMLButtonElement;
  }

  public get uiButtonCreateCar(): HTMLButtonElement {
    return document.querySelector('.button.create') as HTMLButtonElement;
  }

  public get uiButtonUpdateCar(): HTMLButtonElement {
    return document.querySelector('.button.update') as HTMLButtonElement;
  }

  public get uiButtonRace(): HTMLButtonElement {
    return document.querySelector('.button.race') as HTMLButtonElement;
  }

  public get uiButtonReset(): HTMLButtonElement {
    return document.querySelector('.button.reset') as HTMLButtonElement;
  }

  public get uiButtonGenerateCars(): HTMLButtonElement {
    return document.querySelector('.button.generate') as HTMLButtonElement;
  }

  public get uiButtonPrevPage(): HTMLButtonElement {
    return document.querySelector('.button.page-prev') as HTMLButtonElement;
  }

  public get uiButtonNextPage(): HTMLButtonElement {
    return document.querySelector('.button.page-next') as HTMLButtonElement;
  }

  public get uiCarsContainer(): HTMLElement {
    return document.querySelector('.cars') as HTMLElement;
  }

  public get uiWinnersTableHeader(): HTMLElement {
    return document.querySelector('.winners-header') as HTMLElement;
  }

  public get uiWinnersContainer(): HTMLElement {
    return document.querySelector('.winners-body') as HTMLElement;
  }

  private drawHeader(): HTMLElement {
    const uiHeader = document.createElement('header');
    uiHeader.classList.add('header');
    uiHeader.innerHTML = `
      <h1 class="title">Async-race</h1>
      <div class="page-buttons">
        <button class="button to-garage">Garage</button>
        <button class="button to-winners">Winners</button>
      </div>`;
    return uiHeader;
  }

  private drawCarsControls(): HTMLElement {
    const uiCarsControls = document.createElement('div');
    uiCarsControls.classList.add('car-controls');
    uiCarsControls.innerHTML = `
      <div class="controls-line create-car">
        <input class="input car-name create" type="text">
        <input class="input car-color create" type="color">
        <button class="button create">Create</button>
      </div>
      <div class="controls-line update-car">
        <input class="input car-name update" type="text">
        <input class="input car-color update" type="color">
        <button class="button update" disabled>Update</button>
      </div>
      <div class="controls-line mass-actions">
        <button class="button race">Race</button>
        <button class="button reset" disabled>Reset</button>
        <button class="button generate">Generate cars</button>
      </div>`;
    return uiCarsControls;
  }

  private drawPageHeader(): HTMLElement {
    const uiPageHeader = document.createElement('div');
    uiPageHeader.classList.add('page-header');
    uiPageHeader.innerHTML = `
      <div class="page-title"></div>
      <div class="page">
        <span class="page-description">Page</span>
        <button class="button page-prev">&lt</button>
        <span class="page-number"></span>
        <button class="button page-next">&gt</button>
      </div>`;
    return uiPageHeader;
  }

  private drawGarageSection(): HTMLElement {
    const uiGarageSection = document.createElement('section');
    uiGarageSection.classList.add('section', 'garage');

    const uiPageHeader = this.drawPageHeader();
    uiGarageSection.append(uiPageHeader);

    const uiCars = document.createElement('div');
    uiGarageSection.append(uiCars);
    uiCars.outerHTML = '<div class="cars"></div>';

    return uiGarageSection;
  }

  generateGaragePage(): void {
    const uiHeader = this.drawHeader();
    const uiMain = document.createElement('main');

    const uiCarsControls = this.drawCarsControls();
    uiMain.append(uiCarsControls);

    const uiGarageSection = this.drawGarageSection();
    uiMain.append(uiGarageSection);

    document.body.innerHTML = '';
    document.body.append(uiHeader);
    document.body.append(uiMain);
  }

  private drawWinnersSection(): HTMLElement {
    const uiSection = document.createElement('section');
    uiSection.classList.add('section', 'winners');

    const uiPageHeader = this.drawPageHeader();
    uiSection.append(uiPageHeader);

    const uiWinnersTable = this.drawWinnersTable();
    uiSection.append(uiWinnersTable);

    return uiSection;
  }

  private drawWinnersTable(): HTMLElement {
    const uiWinnersTable = document.createElement('table');
    uiWinnersTable.classList.add('winners-table');

    uiWinnersTable.innerHTML = `
      <thead class="winners-header">
        <tr>
          <th class="sortable" data-id="${Enum.SortingColumns.Id}">
            Number <span class="sorting-sign"></span>
          </th>
          <th>Car</th>
          <th>Name</th>
          <th class="sortable" data-id="${Enum.SortingColumns.Wins}">
            Wins <span class="sorting-sign"></span>
          </th>
          <th class="sortable" data-id="${Enum.SortingColumns.Time}">
            Best time (seconds) <span class="sorting-sign"></span>
          </th>
        </tr>
      </thead>
      <tbody class="winners-body">
      </tbody>`;
    return uiWinnersTable;
  }

  generateWinnersPage(): void {
    const uiHeader = this.drawHeader();
    const uiMain = document.createElement('main');

    const uiWinnersSection = this.drawWinnersSection();
    uiMain.append(uiWinnersSection);

    document.body.innerHTML = '';
    document.body.append(uiHeader);
    document.body.append(uiMain);
  }

  getCarParameters(action: Enum.CarActions): Type.TCarParameters {
    const uiCarName = document.querySelector(`.${action}.car-name`) as HTMLInputElement;
    const uiCarColor = document.querySelector(`.${action}.car-color`) as HTMLInputElement;

    const parameters: Type.TCarParameters = {
      name: uiCarName.value,
      color: uiCarColor.value,
    };

    return parameters;
  }

  drawCars(cars: Type.TCar[]): void {
    this.uiCarsContainer.innerHTML = '';
    cars.forEach((car) => this.drawCar(car));
  }

  drawCar(car: Type.TCar): void {
    const uiCars = document.querySelector('.cars') as HTMLElement;
    const uiCar = document.createElement('div');
    uiCars.append(uiCar);

    uiCar.outerHTML = `
      <div class="car-area" data-id="${car.id}">
        <div class="car-actions">
          <button class="button start">Start</button>
          <button class="button stop" disabled>Stop</button>
          <button class="button select">Select</button>
          <button class="button remove">Remove</button>
          <span class="car-description">${car.name}</span>
        </div>
        <div class="car-track">
          <div class="car" style="background-color: ${car.color};">
            <span class="car-id">${car.id}</span>
            <img class="car-icon" src="./images/car.png" alt="Car">
          </div>
          <img class="finish" src="./images/finish.png" alt="Finish">
        </div>
      </div>`;
  }

  private getCarAreaById(id: number): HTMLElement {
    return document.querySelector(`.car-area[data-id="${id}"]`) as HTMLElement;
  }

  selectCar(id: number): void {
    const uiCarAreas = document.querySelectorAll('.car-area');
    uiCarAreas.forEach((uiArea) => uiArea.classList.remove('selected'));

    const uiCarArea = this.getCarAreaById(id);
    uiCarArea.classList.add('selected');

    const uiDescription = uiCarArea.querySelector('.car-description') as HTMLElement;
    if (uiDescription.textContent) {
      const uiCarName = document.querySelector('.update.car-name') as HTMLInputElement;
      uiCarName.value = uiDescription.textContent;
    }

    const uiCar = uiCarArea.querySelector('.car') as HTMLElement;
    const uiCarColor = document.querySelector('.update.car-color') as HTMLInputElement;
    uiCarColor.value = Tools.colorRGBToHex(uiCar.style.backgroundColor);

    this.uiButtonUpdateCar.removeAttribute('disabled');
  }

  refreshCar(car: Type.TCar): void {
    const uiCarArea = this.getCarAreaById(car.id);
    const uiDescription = uiCarArea.querySelector('.car-description') as HTMLElement;
    uiDescription.textContent = car.name;

    const uiCar = uiCarArea.querySelector('.car') as HTMLElement;
    uiCar.style.backgroundColor = car.color;
    uiCar.classList.remove('selected');

    this.uiButtonUpdateCar.setAttribute('disabled', '');
    const uiInputUpdate = document.querySelector('.input.update') as HTMLInputElement;
    uiInputUpdate.value = '';
  }

  removeCar(id: number): void {
    const uiCarArea = this.getCarAreaById(id);
    uiCarArea.remove();
  }

  private setCarTranslateStyles(uiCar: HTMLElement, time: number, distance: number): void {
    uiCar.style.transition = `transform ${time}ms linear`;
    uiCar.style.transform = `translateX(${distance}px)`;
  }

  driveCar(id: number, parameters: Type.TCarDriveParameters): void {
    const uiCarArea = this.getCarAreaById(id);
    const uiCar = uiCarArea.querySelector('.car') as HTMLElement;

    const time = Math.round(parameters.distance / parameters.velocity);
    const distance = uiCarArea.clientWidth - uiCar.offsetWidth;

    this.setCarTranslateStyles(uiCar, time, distance);
    this.changeStateCarActionsAfterStart(id);
  }

  stopCar(id: number): void {
    const uiCarArea = this.getCarAreaById(id);
    const uiCar = uiCarArea.querySelector('.car') as HTMLElement;

    this.setCarTranslateStyles(uiCar, 0, 0);
    this.changeStateCarActionsAfterStop(id);
  }

  brokeCar(id: number): void {
    const uiCarArea = this.getCarAreaById(id);
    const uiCar = uiCarArea.querySelector('.car') as HTMLElement;

    const distance = uiCar.getBoundingClientRect().left - uiCar.offsetLeft;
    this.setCarTranslateStyles(uiCar, 0, distance);
  }

  private getCarOwnControls(uiCarArea: HTMLElement): Type.TCarOwnControls {
    return {
      uiButtonStart: uiCarArea.querySelector('.start') as HTMLButtonElement,
      uiButtonStop: uiCarArea.querySelector('.stop') as HTMLButtonElement,
      uiButtonSelect: uiCarArea.querySelector('.select') as HTMLButtonElement,
      uiButtonRemove: uiCarArea.querySelector('.remove') as HTMLButtonElement,
    };
  }

  changeStateCarActionsAfterStart(id: number): void {
    const uiCarArea = this.getCarAreaById(id);

    const controls = this.getCarOwnControls(uiCarArea);
    controls.uiButtonStop.removeAttribute('disabled');

    [controls.uiButtonStart, controls.uiButtonSelect, controls.uiButtonRemove].forEach((uiButton) => uiButton.setAttribute('disabled', ''));
  }

  changeStateCarActionsAfterStop(id: number): void {
    const uiCarArea = this.getCarAreaById(id);

    const controls = this.getCarOwnControls(uiCarArea);
    controls.uiButtonStop.setAttribute('disabled', '');

    [controls.uiButtonStart, controls.uiButtonSelect, controls.uiButtonRemove].forEach((uiButton) => uiButton.removeAttribute('disabled'));
  }

  changeStateCarActionsAfterStartRace(): void {
    [
      this.uiButtonGarage,
      this.uiButtonWinners,
      this.uiButtonCreateCar,
      this.uiButtonRace,
      this.uiButtonGenerateCars,
      this.uiButtonPrevPage,
      this.uiButtonNextPage,
    ].forEach((uiButton) => uiButton.setAttribute('disabled', ''));
  }

  changeStateCarActionsAfterWin(): void {
    this.uiButtonReset.removeAttribute('disabled');
  }

  changeStateCarActionsAfterReset(): void {
    this.uiButtonReset.setAttribute('disabled', '');
    [
      this.uiButtonGarage,
      this.uiButtonWinners,
      this.uiButtonCreateCar,
      this.uiButtonRace,
      this.uiButtonGenerateCars,
      this.uiButtonPrevPage,
      this.uiButtonNextPage,
    ].forEach((uiButton) => uiButton.removeAttribute('disabled'));
  }

  isTargetCarButton(uiElement: HTMLElement, action: Enum.CarActions): boolean {
    return uiElement.classList.contains(action);
  }

  isSortableColumn(uiElement: HTMLElement): boolean {
    return uiElement.classList.contains('sortable');
  }

  getCarIdByTarget(uiTarget: HTMLElement): number {
    const uiCarArea = uiTarget.closest('.car-area') as HTMLElement;
    return Number(uiCarArea.dataset.id || 0);
  }

  getSelectedCarId(): number {
    const uiCarArea = document.querySelector('.car-area.selected') as HTMLElement;
    return Number(uiCarArea?.dataset.id || 0);
  }

  drawWinners(winners: Type.TWinner[], cars: Type.TCar[]): void {
    this.uiWinnersContainer.innerHTML = '';
    winners.forEach((winner) => this.drawWinner(winner, cars));
  }

  drawWinner(winner: Type.TWinner, cars: Type.TCar[]): void {
    const uiWinners = document.querySelector('.winners-body') as HTMLElement;
    const winningCar = cars.find((car) => car.id === winner.id);

    const uiWinner = document.createElement('tr');
    uiWinner.innerHTML = `
      <td>${winner.id}</td>
      <td>
        <div class="car" style="background-color: ${winningCar?.color};">
          <img class="car-icon" src="./images/car.png" alt="Car">
        </div>
      </td>
      <td>${winningCar?.name}</td>
      <td>${winner.wins}</td>
      <td>${winner.time.toFixed(2)}</td>`;

    uiWinners.append(uiWinner);
  }

  setSortingSign(sorting: Type.TSorting): void {
    const uiSigns = document.querySelectorAll('.sorting-sign');

    uiSigns.forEach((uiElement) => {
      uiElement.textContent = '';
    });

    const uiColumn = document.querySelector(`.sortable[data-id="${sorting.sort}"]`) as HTMLElement;
    const uiSign = uiColumn.querySelector('.sorting-sign') as HTMLElement;

    switch (sorting.order) {
      case Enum.SortingOrder.Asc:
        uiSign.textContent = '▲';
        break;
      case Enum.SortingOrder.Desc:
        uiSign.textContent = '▼';
        break;
      default:
        break;
    }
  }

  showWinnerMessage(car: Type.TCar, time: number): void {
    const uiMessage = document.createElement('div');

    uiMessage.classList.add('win-message');
    uiMessage.innerHTML = `<span class="win-text">Car #${car.id} - ${car.name} win (${time.toFixed(2)}s)!</span>`;

    document.body.append(uiMessage);
    setTimeout(() => uiMessage.remove(), 3000);
  }

  getWinnersTableColumnByTarget(uiTarget: HTMLElement): string {
    return uiTarget.dataset.id || '';
  }

  refreshPagination(title: Enum.Pages, pagination: Type.TPagination): void {
    const uiPageTitle = document.querySelector('.page-title') as HTMLElement;
    uiPageTitle.textContent = `${title} (${pagination.items.total})`;

    const uiPageNumber = document.querySelector('.page-number') as HTMLElement;
    uiPageNumber.textContent = `${pagination.pages.current}/${pagination.pages.total}`;

    if (pagination.sorting.sort) {
      this.setSortingSign(pagination.sorting);
    }
  }
}
