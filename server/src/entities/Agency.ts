import { Entity as DatabaseEntity, Column, PrimaryGeneratedColumn, PrimaryColumn, getRepository, OneToMany } from "typeorm";
import { Route } from "./Route";
import Entity from "./Entity";

export interface APIAgency {
	agency_id: string // 'NZBGW',
	agency_name: string // 'Go West',
	agency_url: string // 'http://www.aucklandtransport.govt.nz',
	agency_timezone: string // 'Pacific/Auckland',
	agency_lang: string // 'en',
	agency_phone: string // '(09)355-3553',
	agency_fare_url: string // null
}

@DatabaseEntity()
export class Agency extends Entity {

    @PrimaryColumn()
    id: string

    @Column()
    name: string
	
    @OneToMany(type => Route, route => route.agency)
    routes: Route[]

	static async fromAPI(data: APIAgency) {
		const model = await Agency.fromID<Agency>(data.agency_id) || new Agency()
		model.id = data.agency_id
		model.name = data.agency_name
		await model.save()
		model.saveToCache()
		return model
	}

}