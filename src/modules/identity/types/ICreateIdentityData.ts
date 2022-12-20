import { ICreateDatabaseModel } from '../../../common/interfaces'

export interface ICreateIdentityData extends ICreateDatabaseModel {
	name?: string
	ip: string
}
