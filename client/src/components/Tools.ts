import { Constants } from '../modules/enums';

export default class Tools {
  static getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }

  static getRandomColor() {
    return `#${this.getRandomNumber(Constants.NumberOfColors).toString(16).padStart(6, '0')}`;
  }

  static colorRGBToHex(color: string) {
    const hex = (x: string) => Number(x).toString(16).padStart(2, '0');
    const rgb: string[] = color.slice(4, -1).split(', ');
    return `#${rgb.reduce((result, x) => result + hex(x), '')}`;
  }
}
