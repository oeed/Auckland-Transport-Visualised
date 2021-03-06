import { Entity as DatabaseEntity, Column, PrimaryGeneratedColumn, PrimaryColumn, getRepository, ManyToOne, OneToMany } from "typeorm";
import { Agency } from "./Agency";
import { Trip } from "./Trip";
import Entity from "./Entity";

export enum RouteType {
	tram = 0, // Any light rail or street level system within a metropolitan area.
	subway = 1, // Any underground rail system within a metropolitan area.
	rail = 2, // Used for intercity or long-distance travel.
	bus = 3, // Used for short- and long-distance bus routes.
	ferry = 4, // Used for short- and long-distance boat service.
	cableCar = 5, // Used for street-level cable cars where the cable runs beneath the car.
	gondola = 6, // Typically used for aerial cable cars where the car is suspended from the cable.
	funicular = 7 // Any rail system designed for steep inclines.
}

export interface APIRoute {
	route_id: string // "35802-20180524131340_v66.89",
	agency_id: string // "HE",
	route_short_name: string // "358",
	route_long_name: string // "Onehunga To Pakuranga Plaza Via Penrose",
	route_desc: string | null // null,
	route_type: RouteType // 3,
	route_url: string | null // null,
	route_color: string | null // null,
	route_text_color: string | null // null
}

@DatabaseEntity()
export class Route extends Entity {

    @PrimaryColumn()
    id: string

    @Column()
	number: string
	
    @Column()
	name: string

	@Column()
	type: RouteType

    @ManyToOne(type => Agency, agency => agency.routes)
    agency: Agency
	
    @OneToMany(type => Trip, trip => trip.route)
    trips: Trip[]

	static async fromAPI(data: APIRoute, save = true) {
		const model = await this.fromID<Route>(data.route_id) || new Route()
		model.id = data.route_id
		model.number = data.route_short_name
		model.name = data.route_long_name.replace("�","\n")
		model.type = data.route_type
		model.agency = await Agency.fromIDOrFail<Agency>(data.agency_id)
		if (save) {
			await model.save()
		}
		return model
	}

}