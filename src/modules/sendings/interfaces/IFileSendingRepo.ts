import { ICreateFileSendingData, IFileSending } from "../types";

export interface IFileSendingRepo {
  create (createSending: ICreateFileSendingData): Promise<IFileSending>
  getByUuid (uuid: string, scopes?: string[]): Promise<IFileSending | null>
  getByToName (toName: string, scopes?: string[]): Promise<IFileSending[]>
  deleteByUuid (uuid: string): Promise<number>
}