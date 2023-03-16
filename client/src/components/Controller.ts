import Garage from './Garage';
import Statistic from './Statistic';
import View from './View';

import * as Type from '../modules/types';
import * as Enum from '../modules/enums';

export default class Controller {
  private gr = new Garage();
  private st = new Statistic();
  private vw = new View();

  start() {
    this.generateGaragePage();
  }

  private generateGaragePage(): void {
    this.vw.generateGaragePage();

    this.vw.uiButtonGarage.addEventListener('click', () => this.generateGaragePage());
    this.vw.uiButtonWinners.addEventListener('click', () => this.generateWinnersPage());

    this.vw.uiButtonCreateCar.addEventListener('click', () => this.createCar());
    this.vw.uiButtonUpdateCar.addEventListener('click', () => this.updateCar());

    this.vw.uiButtonRace.addEventListener('click', () => this.race());
    this.vw.uiButtonReset.addEventListener('click', () => this.reset());
    this.vw.uiButtonGenerateCars.addEventListener('click', () => this.generateCars());

    this.vw.uiCarsContainer.addEventListener('click', (event) => this.selectCar(event));
    this.vw.uiCarsContainer.addEventListener('click', (event) => this.removeCar(event));
    this.vw.uiCarsContainer.addEventListener('click', (event) => this.startCar(event));
    this.vw.uiCarsContainer.addEventListener('click', (event) => this.stopCar(event));

    this.vw.uiButtonPrevPage.addEventListener('click', () => this.goToPrevPage(Enum.Pages.Garage));
    this.vw.uiButtonNextPage.addEventListener('click', () => this.goToNextPage(Enum.Pages.Garage));

    this.getCars(this.gr.pagination);
  }

  private generateWinnersPage(): void {
    this.vw.generateWinnersPage();

    this.vw.uiButtonGarage.addEventListener('click', () => this.generateGaragePage());
    this.vw.uiButtonWinners.addEventListener('click', () => this.generateWinnersPage());

    this.vw.uiWinnersTableHeader.addEventListener('click', (event) => this.sortWinners(event));

    this.vw.uiButtonPrevPage.addEventListener('click', () => this.goToPrevPage(Enum.Pages.Winners));
    this.vw.uiButtonNextPage.addEventListener('click', () => this.goToNextPage(Enum.Pages.Winners));

    this.getWinners(this.st.pagination);
  }

  private generateCars() {
    const result: Promise<Type.TCar>[] = [];

    for (let i = 0; i < 100; i += 1) {
      const parameters = this.gr.getRandomCarParameters();
      result.push(this.gr.create(parameters));
    }

    Promise.all(result)
      .then(() => this.getCars(this.gr.pagination))
      .catch(() => true);
  }

  private getCars(pagination: Type.TPagination): void {
    const result = this.gr.getList(pagination);
    result
      .then((data) => {
        this.vw.drawCars(data);
        this.vw.refreshPagination(Enum.Pages.Garage, this.gr.pagination);
      })
      .catch(() => true);
  }

  private createCar(): void {
    const parameters = this.vw.getCarParameters(Enum.CarActions.Create);

    const result = this.gr.create(parameters);
    result.then(() => this.getCars(this.gr.pagination)).catch(() => true);
  }

  private selectCar(event: Event): void {
    const uiTarget = event.target as HTMLElement;
    if (!this.vw.isTargetCarButton(uiTarget, Enum.CarActions.Select)) return;

    const id = this.vw.getCarIdByTarget(uiTarget);
    if (id) {
      this.vw.selectCar(id);
    }
  }

  private updateCar(): void {
    const parameters = this.vw.getCarParameters(Enum.CarActions.Update);
    const id = this.vw.getSelectedCarId();

    if (id) {
      const result = this.gr.update(id, parameters);
      result.then((data) => this.vw.refreshCar(data)).catch(() => true);
    }
  }

  private removeCar(event: Event): void {
    const uiTarget = event.target as HTMLElement;
    if (!this.vw.isTargetCarButton(uiTarget, Enum.CarActions.Remove)) return;

    const id = this.vw.getCarIdByTarget(uiTarget);
    if (id) {
      const result = this.gr.remove(id);
      result
        .then(() => {
          this.getCars(this.gr.pagination);
          this.removeWinner(id);
        })
        .catch(() => true);
    }
  }

  private startCar(event: Event): void {
    const uiTarget = event.target as HTMLElement;
    if (!this.vw.isTargetCarButton(uiTarget, Enum.CarActions.Start)) return;

    const id = this.vw.getCarIdByTarget(uiTarget);
    if (id) {
      const resultOfStart = this.gr.start(id);
      resultOfStart
        .then((data) => {
          this.vw.driveCar(id, data);

          const resultOfDrive = this.gr.drive(id);
          resultOfDrive.catch(() => {
            this.vw.brokeCar(id);
          });
        })
        .catch(() => true);
    }
  }

  private stopCar(event: Event): void {
    const uiTarget = event.target as HTMLElement;
    if (!this.vw.isTargetCarButton(uiTarget, Enum.CarActions.Stop)) return;

    const id = this.vw.getCarIdByTarget(uiTarget);
    if (id) {
      const result = this.gr.stop(id);
      result.then(() => this.vw.stopCar(id)).catch(() => true);
    }
  }

  private race(): void {
    let winner = false;
    this.vw.changeStateCarActionsAfterStartRace();

    const cars = this.gr.getVisibleCars();
    let startedCarsNumber = 0;

    cars.forEach((car) => {
      const resultOfStart = this.gr.start(car.id);
      resultOfStart
        .then((data) => {
          this.vw.driveCar(car.id, data);

          const resultOfDrive = this.gr.drive(car.id);
          resultOfDrive
            .then(() => {
              if (!winner) {
                winner = true;
                const time = this.gr.getTrackTime(data);

                this.updateWinner(car, data);
                this.vw.showWinnerMessage(car, time);
                this.vw.changeStateCarActionsAfterWin();
              }
            })
            .catch(() => {
              this.vw.brokeCar(car.id);
            })
            .finally(() => {
              startedCarsNumber += 1;
              if (cars.length === startedCarsNumber) {
                this.vw.changeStateCarActionsAfterWin();
              }
            });
        })
        .catch(() => true);
    });
  }

  private reset(): void {
    const cars = this.gr.getVisibleCars();
    let stoppedCarsNumber = 0;

    cars.forEach((car) => {
      const result = this.gr.stop(car.id);
      result
        .then(() => this.vw.stopCar(car.id))
        .catch(() => true)
        .finally(() => {
          stoppedCarsNumber += 1;
          if (cars.length === stoppedCarsNumber) {
            this.vw.changeStateCarActionsAfterReset();
          }
        });
    });
  }

  private getWinners(pagination: Type.TPagination): void {
    const resultOfGetWinners = this.st.getList(pagination);
    resultOfGetWinners
      .then((winners) => {
        const resultOfGetCars = this.gr.getAll();
        resultOfGetCars
          .then((cars) => {
            this.vw.drawWinners(winners, cars);
            this.vw.refreshPagination(Enum.Pages.Winners, this.st.pagination);
          })
          .catch(() => true);
      })
      .catch(() => true);
  }

  private updateWinner(car: Type.TCar, driveParameters: Type.TCarDriveParameters): void {
    const time = this.gr.getTrackTime(driveParameters);

    const result = this.st.get(car.id);
    result
      .then((data) => {
        const parameters: Type.TWinnerParameters = {
          wins: data.wins + 1,
          time: Math.min(data.time, time),
        };
        this.st.update(car.id, parameters);
      })
      .catch(() => {
        const parameters: Type.TWinner = {
          id: car.id,
          wins: 1,
          time,
        };
        this.st.create(parameters);
      });
  }

  private removeWinner(id: number): void {
    const result = this.st.get(id);
    result.then(() => this.st.remove(id)).catch(() => true);
  }

  private sortWinners(event: Event): void {
    const uiTarget = event.target as HTMLElement;
    if (!this.vw.isSortableColumn(uiTarget)) return;

    const column = this.vw.getWinnersTableColumnByTarget(uiTarget);
    if (column) {
      const { pagination } = this.st;

      if (column === pagination.sorting.sort) {
        const reverse = new Map();
        reverse.set(Enum.SortingOrder.Asc, Enum.SortingOrder.Desc);
        reverse.set(Enum.SortingOrder.Desc, Enum.SortingOrder.Asc);

        pagination.sorting.order = reverse.get(pagination.sorting.order);
      } else {
        pagination.sorting.sort = column;
        pagination.sorting.order = Enum.SortingOrder.Asc;
      }

      this.vw.setSortingSign(pagination.sorting);
      this.getWinners(pagination);
    }
  }

  private goToPrevPage(page: Enum.Pages): void {
    let pagination: Type.TPagination;

    switch (page) {
      case Enum.Pages.Garage:
        pagination = this.gr.pagination;
        if (pagination.pages.current > 1) {
          pagination.pages.current -= 1;
          this.getCars(pagination);
        }
        break;
      case Enum.Pages.Winners:
        pagination = this.st.pagination;
        if (pagination.pages.current > 1) {
          pagination.pages.current -= 1;
          this.getWinners(pagination);
        }
        break;
      default:
        break;
    }
  }

  private goToNextPage(page: Enum.Pages): void {
    let pagination: Type.TPagination;

    switch (page) {
      case Enum.Pages.Garage:
        pagination = this.gr.pagination;
        if (pagination.pages.current < pagination.pages.total) {
          pagination.pages.current += 1;
          this.getCars(pagination);
        }
        break;
      case Enum.Pages.Winners:
        pagination = this.st.pagination;
        if (pagination.pages.current < pagination.pages.total) {
          pagination.pages.current += 1;
          this.getWinners(pagination);
        }
        break;
      default:
        break;
    }
  }
}
