import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, getRepository, OneToMany } from "typeorm";
import { Route } from "./Route";

export interface APIAgency {
	agency_id: string // 'NZBGW',
	agency_name: string // 'Go West',
	agency_url: string // 'http://www.aucklandtransport.govt.nz',
	agency_timezone: string // 'Pacific/Auckland',
	agency_lang: string // 'en',
	agency_phone: string // '(09)355-3553',
	agency_fare_url: string // null
}

const cache: { [index: string]: Agency } = {}

@Entity()
export class Agency {

    @PrimaryColumn()
    id: string

    @Column()
    name: string
	
    @OneToMany(type => Route, route => route.agency)
    routes: Route[]

	static async fromAPI(data: APIAgency) {
		const model = await Agency.fromID(data.agency_id) || new Agency()
		model.id = data.agency_id
		model.name = data.agency_name
		await model.save()
		model.saveToCache()
		return model
	}

	static async fromID(id: string) {
		const cached = cache[id]
		if (cached) {
			return cached
		}

		const agency = await getRepository(Agency).findOne(id)
		if (agency) {
			agency.saveToCache()
		}
		return agency
	}

	static async fromIDOrFail(id: string) {
		const cached = cache[id]
		if (cached) {
			return cached
		}

		const agency = await getRepository(Agency).findOneOrFail(id)
		agency.saveToCache()
		return agency
	}

	async save() {
		await getRepository(Agency).save(this)
	}

	saveToCache() {
		cache[this.id] = this
	}

}