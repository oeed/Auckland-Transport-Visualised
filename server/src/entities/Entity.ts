import { Repository, PrimaryGeneratedColumn, getRepository, DeepPartial } from "typeorm"

const cache: { [index: string]: Entity } = {}
export default class Entity {

	id: string

	static repository<T extends Entity>() {
		return getRepository(this) as Repository<T>
	}

	get repository(): Repository<this> {
		return getRepository(this.constructor)
	}

	static async fromID<T extends Entity>(id: string) {
		const cached = cache[id]
		if (cached) {
			return cached as T
		}

		const entity = await this.repository<T>().findOne(id) as T
		if (entity) {
			entity.saveToCache()
		}
		return entity
	}

	static async fromIDOrFail<T extends Entity>(id: string) {
		const cached = cache[id]
		if (cached) {
			return cached as T
		}

		const agency = await this.repository<T>().findOneOrFail(id) as T
		agency.saveToCache()
		return agency
	}

	async save() {
		return await this.repository.save(this as any) as this
	}

	static async saveMany<T extends Entity>(entities: T[]) {
		return await this.repository<T>().save(entities as any) as T[]
	}

	saveToCache() {
		cache[this.id] = this
	}

}