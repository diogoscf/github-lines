export class LineData {
  readonly lineLength: number;

  readonly extension: string;

  readonly toDisplay: string;

  constructor(lineLength: number, extension: string, toDisplay: string) {
    this.lineLength = lineLength;
    this.extension = extension;
    this.toDisplay = toDisplay;
  }
}

export interface IMessageData {
  msgList: Array<LineData>;
  totalLines: number;
}
