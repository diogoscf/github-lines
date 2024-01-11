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

// Trying to make typescript happy
// eslint-disable-next-line no-use-before-define
export type JSONObject = { [Key in string]?: JSONValue }; // JSON Object
// eslint-disable-next-line no-use-before-define
export type JSONArray = JSONValue[]; // JSON Array
export type JSONPrimitive = string | number | boolean | null; // Any valid JSON primitive value
export type JSONValue = JSONPrimitive | JSONObject | JSONArray; // Any valid JSON value
