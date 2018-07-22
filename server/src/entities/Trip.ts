import { Entity as DatabaseEntity, Column, PrimaryGeneratedColumn, PrimaryColumn, getRepository, OneToMany, ManyToOne } from "typeorm";
import { Route } from "./Route";
import { VehicleSnapshot } from "./VehicleSnapshot";
import Entity from "./Entity";

/* export enum TripDirection {
	inbound, // i.e. generally toward Britomart
	outbound, // i.e. generally away from Britomart
}

export interface APITrip {
	route_id: string //"02704-20180702170310_v67.28",
	service_id: string //"471136250-20180702170310_v67.28",
	trip_id: string //"471136250-20180702170310_v67.28",
	trip_headsign: string //"Waikowhai",
	direction_id: TripDirection //1,
	block_id: string //null,
	shape_id: string //"15-20180702170310_v67.28",
	trip_short_name: string //null,
	trip_type: string //null
} */

// For now, for data model simplicity, we don't actually use the proper trip model, just a simplified version

@DatabaseEntity()
export class Trip extends Entity {

    @PrimaryColumn()
	id: string
	
    @ManyToOne(type => Route, route => route.trips)
    route: Route
	
    @OneToMany(type => VehicleSnapshot, vehicleSnapshot => vehicleSnapshot.trip)
    vehicleSnapshots: VehicleSnapshot[]
	
	static async fromIDRoute(id: string, route: Route) {
		// TODO: probably cache these
		const existing = await this.fromID(id)
		if (existing) {
			return existing as Trip
		}

		const model = new Trip()
		model.id = id
		model.route = route
		await model.save()
		return model
	}

/* 
    @Column()
    destination: string

    @Column()
    direction: TripDirection
	
    @ManyToOne(type => Route, route => route.trips)
    route: Route

	static async fromAPI(data: APITrip) {
		const model = await Trip.fromID(data.trip_id) || new Trip()
		model.id = data.trip_id
		model.destination = data.trip_headsign
		model.direction = data.direction_id
		model.route = await Route.fromIDOrFail(data.route_id)
		await model.save()
		return model
	}

	static async fromID(id: string) {
		// TODO: probably cache these
		return await getRepository(Trip).findOne(id)
	}

	static async fromIDOrFail(id: string) {
		// TODO: probably cache these
		return await getRepository(Trip).findOneOrFail(id)
	}

	async save() {
		await getRepository(Trip).save(this)
	}
 */
}