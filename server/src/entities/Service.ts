/* import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, getRepository, OneToMany, ManyToOne } from "typeorm";
import { Route } from "./Route";

export enum TripDirection {
	inbound, // i.e. generally toward Britomart
	outbound, // i.e. generally away from Britomart
}

export interface APITrip {
	"service_id": "18033099921-20180524131340_v66.89",
	"monday": 0,
	"tuesday": 0,
	"wednesday": 0,
	"thursday": 0,
	"friday": 0,
	"saturday": 0,
	"sunday": 0,
	"start_date": "2018-05-17T00:00:00.000Z",
	"end_date": "2018-07-07T00:00:00.000Z"
}

@Entity()
export class Service {

    @PrimaryColumn()
    id: string

    @Column()
    destination: string

    @Column()
    direction: TripDirection
	
    @ManyToOne(type => Route, route => route.trips)
    route: Route

	static async fromAPI(data: APITrip) {
		const model = await Service.fromID(data.trip_id) || new Service()
		model.id = data.trip_id
		model.destination = data.trip_headsign
		model.direction = data.direction_id
		model.route = await Route.fromIDOrFail(data.route_id)
		await model.save()
		return model
	}

	static async fromID(id: string) {
		// TODO: probably cache these
		return await getRepository(Service).findOne(id)
	}

	static async fromIDOrFail(id: string) {
		// TODO: probably cache these
		return await getRepository(Service).findOneOrFail(id)
	}

	async save() {
		await getRepository(Service).save(this)
	}

} */