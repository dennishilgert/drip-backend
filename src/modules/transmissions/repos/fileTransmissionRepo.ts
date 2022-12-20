import { IFileTransmissionRepo } from '../interfaces'
import { ICreateFileTransmissionData, IFileTransmission } from '../types'
import database from '../../databaseModels'
import { injectable } from 'inversify'

@injectable()
class FileTransmissionRepo implements IFileTransmissionRepo {
	async create(
		createTransmission: ICreateFileTransmissionData
	): Promise<IFileTransmission> {
		return database.FileTransmission.create(createTransmission)
	}

	async getOneByCriteria(
		criteria: object,
		scopes?: string[] | false
	): Promise<IFileTransmission | null> {
		const definedScopes =
			scopes || (scopes === false ? false : ['defaultScope'])
		const parameters: object = {
			where: criteria
		}
		if (definedScopes) {
			return database.FileTransmission.scope(definedScopes).findOne(parameters)
		}
		return database.FileTransmission.unscoped().findOne(parameters)
	}

	async getByUuid(
		uuid: string,
		scopes?: string[]
	): Promise<IFileTransmission | null> {
		return this.getOneByCriteria({ uuid }, scopes)
	}

	async getByRequestUuid(
		requestUuid: string,
		scopes?: string[]
	): Promise<IFileTransmission | null> {
		return this.getOneByCriteria({ requestUuid }, scopes)
	}

	async getManyByCriteria(
		criteria: object,
		scopes?: string[] | false
	): Promise<IFileTransmission[]> {
		const definedScopes =
			scopes || (scopes === false ? false : ['defaultScope'])
		const parameters: object = {
			where: criteria
		}
		if (definedScopes) {
			return database.FileTransmission.scope(definedScopes).findAll(parameters)
		}
		return database.FileTransmission.unscoped().findAll(parameters)
	}

	async getByToUuid(
		toUuid: string,
		scopes?: string[]
	): Promise<IFileTransmission[]> {
		return this.getManyByCriteria({ toUuid }, scopes)
	}

	async delete(criteria: object): Promise<number> {
		return database.FileTransmission.destroy({
			where: criteria
		})
	}

	async deleteByUuid(uuid: string): Promise<number> {
		return this.delete({ uuid })
	}

	async deleteByRequestUuid(requestUuid: string): Promise<number> {
		return this.delete({ requestUuid })
	}
}

export default FileTransmissionRepo
