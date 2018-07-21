import fetch from "node-fetch"
import { APIAgency } from "./entities/Agency"
import { APIRoute } from "./entities/Route";
import { APITripUpdate, APIVehiclePosition, APIServiceAlert } from "./entities/VehicleSnapshot";
// import { APITrip } from "./entities/Trip";

const KEY = process.env["AT_API_KEY"]
if (!KEY) {
	throw new Error("AT_API_KEY not set")
}

export interface Response<R> {
	status: string
	response: R
}

export const getAgencies = async (): Promise<Response<APIAgency[]>> =>
	await fetch("https://api.at.govt.nz/v2/gtfs/agency", { headers: {
		"Ocp-Apim-Subscription-Key": KEY
	}}).then(res => res.json())

export const getRoutes = async (): Promise<Response<APIRoute[]>> =>
	await fetch("https://api.at.govt.nz/v2/gtfs/routes", { headers: {
		"Ocp-Apim-Subscription-Key": KEY
	}}).then(res => res.json())

/* export const getTrips = async (): Promise<Response<APITrip[]>> =>
	await fetch("https://api.at.govt.nz/v2/gtfs/trips", { headers: {
		"Ocp-Apim-Subscription-Key": KEY
	}}).then(res => res.json()) */

export const getUpdatesAndPositions = async (): Promise<Response<{ entity: (APITripUpdate | APIVehiclePosition | APIServiceAlert)[] }>> =>
	await fetch("https://api.at.govt.nz/v2/public/realtime", { headers: {
		"Ocp-Apim-Subscription-Key": KEY
	}}).then(res => res.json())