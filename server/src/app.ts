import "reflect-metadata"

import { createConnection } from "typeorm";
import { refreshAllEntities, refreshSnapshots } from "./DataManager";

require('dotenv').load()

export const sleep = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// createConnection method will automatically read connection options
// from your ormconfig file or environment variables
createConnection().then(async (connection) => {
	await refreshAllEntities()

	while (true) {
		await Promise.all([await sleep(5000), new Promise(async resolve => {
			console.log("Refreshing")
			const snapshots = await refreshSnapshots()
			let newSnapshots = 0
			let oldSnapshots = 0
			snapshots.map(([snapshot, isNew]) => {
				if (isNew) {
					newSnapshots ++
				}
				else {
					oldSnapshots ++
				}
			})
			console.log(`Refresh complete. New: ${ newSnapshots } Old: ${ oldSnapshots }`)
			resolve()
		})])
	}
})