import { getAgencies, getRoutes, getUpdatesAndPositions } from "./Data";
import { Agency } from "./entities/Agency";
import { Route } from "./entities/Route";
// import { Trip } from "./entities/Trip";
import { VehicleSnapshot, APITripUpdate, APIVehiclePosition } from "./entities/VehicleSnapshot";

export const refreshAllEntities = async () => {

	const agencies = (await getAgencies()).response.map(apiAgency => Agency.fromAPI(apiAgency))
	const routes = (await getRoutes()).response.map(apiRoute => Route.fromAPI(apiRoute))
	// const trips = (await getTrips()).response.map(apiTrip => Trip.fromAPI(apiTrip))

	// index = Trip.id
}

export const refreshSnapshots = async () => {
	const tripEntities: { [index: string]: [APITripUpdate | undefined, APIVehiclePosition | undefined]  } = {}
	console.log("download")
	const response = (await getUpdatesAndPositions()).response
	console.log("downloaded")
	for (const entity of response.entity) {
		if (entity.vehicle) {
			const tripId = entity.vehicle.trip.trip_id
			if (!tripEntities[tripId]) {
				tripEntities[tripId] = [undefined, entity as APIVehiclePosition]
			}
			else {
				tripEntities[tripId][1] = entity as APIVehiclePosition

			}
		}
		else if (entity.trip_update) {
			const tripId = entity.trip_update.trip.trip_id
			if (!tripEntities[tripId]) {
				tripEntities[tripId] = [entity as APITripUpdate, undefined]
			}
			else {
				tripEntities[tripId][0] = entity as APITripUpdate

			}
		}
	}


	const snapshotPromises: Promise<[VehicleSnapshot, boolean]>[] = []
	for (const tripId in tripEntities) {
		if (tripEntities.hasOwnProperty(tripId)) {
			const [update, position] = tripEntities[tripId]
			if (update && position) {
				snapshotPromises.push(VehicleSnapshot.fromAPI(update, position, false))
			}
		}
	}
	
	console.log("start promises")
	const snapshots = await Promise.all(snapshotPromises)
	console.log("start save")
	await VehicleSnapshot.saveMany(snapshots.filter(([snapshot, isNew]) => isNew).map(([snapshot]) => snapshot))
	console.log("done")
	return snapshots
}