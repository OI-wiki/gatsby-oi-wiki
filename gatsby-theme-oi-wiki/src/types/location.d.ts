export interface HLocation<S = unknown> {
  pathname: string;
  search: string;
  state: S;
  hash: string;
  key?: string | undefined;
}

export type WindowLocation<S = unknown> = Window['location'] & HLocation<S>;

export type HistoryLocation = WindowLocation & { state?: any };
