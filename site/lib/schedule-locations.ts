import {after} from 'next/server';
import {locateImportedReservation} from './reservation-locations';
export function scheduleLocations(tripId:string,reservationId:string){
 after(async()=>{try{await locateImportedReservation(tripId,reservationId);}catch{console.error('Reservation location background task unavailable; pending work will resume in the panel.');}});
}
