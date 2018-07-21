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
		return model
	}

	static async fromID(id: string) {
		// TODO: probably cache these
		return await getRepository(Agency).findOne(id)
	}

	static async fromIDOrFail(id: string) {
		// TODO: probably cache these
		return await getRepository(Agency).findOneOrFail(id)
	}

	async save() {
		await getRepository(Agency).save(this)
	}

}