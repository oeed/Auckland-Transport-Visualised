import { Entity as DatabaseEntity, Column, PrimaryGeneratedColumn, PrimaryColumn, getRepository, OneToMany, ManyToOne, Index, Unique } from "typeorm";
import { Route } from "./Route";
import { Trip } from "./Trip";
import Entity from "./Entity";

export enum OccupancyStatus {
	// The vehicle is considered empty by most measures, and has few or no
    // passengers onboard, but is still accepting passengers.
    empty = 0,

    // The vehicle has a relatively large percentage of seats available.
    // What percentage of free seats out of the total seats available is to be
    // considered large enough to fall into this category is determined at the
    // discretion of the producer.
    manySeatsAvailable = 1,

    // The vehicle has a relatively small percentage of seats available.
    // What percentage of free seats out of the total seats available is to be
    // considered small enough to fall into this category is determined at the
    // discretion of the feed producer.
    fewSeatsAvailable = 2,

    // The vehicle can currently accommodate only standing passengers.
    standingRoomOnly = 3,

    // The vehicle can currently accommodate only standing passengers
    // and has limited space for them.
    crushStandingRoomOnly = 4,

    // The vehicle is considered full by most measures, but may still be
    // allowing passengers to board.
    full = 5,

    // The vehicle is not accepting additional passengers.
    notAcceptingPassengers = 6
}

export interface APITripUpdate {
	id: string//"9ad38a4e-37cf-a327-fcd0-240367696564",
	is_deleted: false//false,
	alert: undefined
	vehicle: undefined
	trip_update: {
		trip: {
			trip_id: string//"471138193-20180702170310_v67.28",
			route_id: string//"02704-20180702170310_v67.28",
			start_time: string //"20:30:00",
			schedule_relationship: number//0
		},
		vehicle: {
			id: string //"2CB2"
		},
		stop_time_update: {
			stop_sequence: number //6,
			stop_id: string //"7168-20180702170310_v67.28",
			schedule_relationship: string //0,
			departure: {
				delay: number //144,
				time: number //1532076089.956
			}
		} | {
			stop_sequence: number //6,
			stop_id: string //"7168-20180702170310_v67.28",
			schedule_relationship: string //0,
			arrival: {
				delay: number //144,
				time: number //1532076089.956
			}
		},
		timestamp: number //1532076089.956
	}
}

export interface APIVehiclePosition {
	id: string //"29b588d0-9587-89c5-dfbf-1b1f3629f246",
	is_deleted: boolean//false,
	alert: undefined
	trip_update: undefined
	vehicle: {
	  trip: {
		trip_id: string //"440138189-20180702170310_v67.28",
		route_id: string //"06602-20180702170310_v67.28",
		start_time: string //"20:30:00",
		schedule_relationship: number//0
	  },
	  vehicle: {
		id: string //"5A57"
	  },
	  position: {
		latitude: number //-36.91505,
		longitude: number //174.798433,
		bearing: string //"263"
	  },
	  timestamp: number//1532076113.73,
	  occupancy_status: OccupancyStatus //0
	}
}

export interface APIServiceAlert {
	id: number
	alert: {}
	vehicle: undefined
	trip_update: undefined
	timestamp: string
}

@DatabaseEntity()
@Unique(["positionId", "updateId"])
export class VehicleSnapshot extends Entity {

    @PrimaryGeneratedColumn()
    id: string
	
    @ManyToOne(type => Trip, trip => trip.vehicleSnapshots)
	trip: Trip

	@Column()
    positionId: string

	@Column()
    updateId: string

	@Column()
    vehicleId: string

    @Column()
	startTime: string
	
    @Column()
	updateTime: Date

    @Column()
	positionTime: Date

    @Column()
	time: Date

    @Column("decimal", { precision: 9, scale: 6 })
	latitude: number

    @Column("decimal", { precision: 9, scale: 6 })
	longitude: number

    @Column("int", { nullable: true })
	bearing?: number

    @Column({ nullable: true })
	occupancyStatus: OccupancyStatus

	// returns [VehicleSnapshot, isNew]
	// isNew is false if the position already exists
	static async fromAPI(update: APITripUpdate, position: APIVehiclePosition, save: boolean = true): Promise<[VehicleSnapshot, boolean]> {
		const existing = await VehicleSnapshot.fromUpdatePositionIDs(update.id, position.id)
		if (existing) {
			return [existing, false]
		}

		const model = new VehicleSnapshot()
		model.updateId = update.id
		model.updateTime = new Date(update.trip_update.timestamp * 1000)
		model.positionId = position.id
		model.positionTime = new Date(position.vehicle.timestamp * 1000)
		model.vehicleId = update.trip_update.vehicle.id
		model.startTime = update.trip_update.trip.start_time
		model.time = new Date(Math.max(update.trip_update.timestamp, position.vehicle.timestamp ) * 1000)
		model.trip =  await Trip.fromIDRoute(update.trip_update.trip.trip_id, await Route.fromIDOrFail<Route>(update.trip_update.trip.route_id))
		model.latitude = position.vehicle.position.latitude
		model.longitude = position.vehicle.position.longitude

		const bearing = position.vehicle.position.bearing
		model.bearing = bearing ? parseInt(bearing) : undefined
		model.occupancyStatus = position.vehicle.occupancy_status

		if (save) {
			await model.save()
		}

		return [model, true]
	}

	static async fromUpdatePositionIDs(updateId: string, positionId: string) {
		// TODO: probably cache these
		return await getRepository(VehicleSnapshot).findOne({ where: { updateId, positionId } })
	}

}