import { sqliteTable, text, integer, real, primaryKey, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
export const tripUploads=sqliteTable('trip_uploads',{
 id:text('id').primaryKey(),tripId:text('trip_id').notNull(),objectKeys:text('object_keys').notNull(),
 status:text('status').notNull().default('active'),createdAt:text('created_at').notNull(),
},t=>[index('trip_uploads_trip').on(t.tripId)]);
export const tripDeletions=sqliteTable('trip_deletions',{
 id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),confirmName:text('confirm_name').notNull(),
 objectKeys:text('object_keys').notNull(),createdAt:text('created_at').notNull(),
});
export const centralInstallation=sqliteTable('central_installation',{
 singleton:integer('singleton').primaryKey(),id:text('id').notNull(),token:text('token').notNull(),
 nextAttemptAt:integer('next_attempt_at').notNull().default(0),lastSentAt:integer('last_sent_at'),
 releaseJson:text('release_json'),releaseCheckedAt:integer('release_checked_at').notNull().default(0),
 termsVersion:text('terms_version'),termsAcceptedAt:text('terms_accepted_at'),confirmedTermsVersion:text('confirmed_terms_version'),
});
export const trips = sqliteTable('trips', {
 id:text('id').primaryKey(), ownerId:text('owner_id').notNull(), name:text('name').notNull(),
 startDate:text('start_date').notNull(), endDate:text('end_date').notNull(), destinations:text('destinations').notNull(), createdAt:text('created_at').notNull(),
 destinationLocations:text('destination_locations').notNull().default('[]'),
 coverKey:text('cover_key'),coverVersion:integer('cover_version').notNull().default(0),
});
export const members=sqliteTable('members',{
 tripId:text('trip_id').notNull().references(()=>trips.id), email:text('email').notNull(), userId:text('user_id'),
 role:text('role',{enum:['reader','editor']}).notNull(),
},t=>[primaryKey({columns:[t.tripId,t.email]})]);
export const reservations=sqliteTable('reservations',{
 id:text('id').primaryKey(),tripId:text('trip_id').notNull().references(()=>trips.id),sourceKey:text('source_key').notNull(),
 kind:text('kind').notNull(),title:text('title').notNull(),startDate:text('start_date').notNull(),endDate:text('end_date').notNull(),
 data:text('data').notNull(),fingerprint:text('fingerprint').notNull(),importedAt:text('imported_at').notNull(),
 status:text('status').notNull().default('active'),updatedAt:text('updated_at'),manualOverride:integer('manual_override').notNull().default(0),
},t=>[uniqueIndex('reservations_trip_source').on(t.tripId,t.sourceKey)]);
export const documents=sqliteTable('documents',{
 id:text('id').primaryKey(),reservationId:text('reservation_id').notNull().references(()=>reservations.id),
 objectKey:text('object_key').notNull(),filename:text('filename').notNull(),mime:text('mime').notNull(),label:text('label').notNull(),
 bytes:integer('bytes').notNull(),sha256:text('sha256').notNull(),
},t=>[uniqueIndex('documents_reservation_hash').on(t.reservationId,t.sha256)]);
export const places=sqliteTable('places',{
 id:text('id').primaryKey(),tripId:text('trip_id').notNull().references(()=>trips.id),data:text('data').notNull(),
 photoKey:text('photo_key'),photoData:text('photo_data'),
 date:text('date'),position:real('position').notNull().default(0),revision:integer('revision').notNull().default(1),
},t=>[index('places_trip_date').on(t.tripId,t.date)]);
export const reviews=sqliteTable('reviews',{
 id:text('id').primaryKey(),tripId:text('trip_id').notNull().references(()=>trips.id),reservationId:text('reservation_id').notNull(),
 objectKey:text('object_key').notNull(),reason:text('reason').notNull(),status:text('status').notNull().default('pending'),
 baseFingerprint:text('base_fingerprint'),createdAt:text('created_at').notNull(),
},t=>[index('reviews_trip_status').on(t.tripId,t.status)]);
export const reservationChanges=sqliteTable('reservation_changes',{
 id:text('id').primaryKey(),reservationId:text('reservation_id').notNull().references(()=>reservations.id),
 data:text('data').notNull(),changedAt:text('changed_at').notNull(),action:text('action').notNull(),
});
export const placeLists=sqliteTable('place_lists',{
 id:text('id').primaryKey(),tripId:text('trip_id').notNull().references(()=>trips.id),name:text('name').notNull(),revision:integer('revision').notNull().default(1),
},t=>[index('place_lists_trip').on(t.tripId)]);
export const integrationSettings=sqliteTable('integration_settings',{
 name:text('name').primaryKey(),instanceId:text('instance_id').notNull(),nextRequestAt:integer('next_request_at').notNull().default(0),
});
export const placeSearchCache=sqliteTable('place_search_cache',{
 queryHash:text('query_hash').primaryKey(),data:text('data').notNull(),expiresAt:integer('expires_at').notNull(),
});
export const dayOrders=sqliteTable('day_orders',{
 tripId:text('trip_id').notNull().references(()=>trips.id),day:text('day').notNull(),
 eventIds:text('event_ids').notNull(),revision:integer('revision').notNull().default(1),
},t=>[primaryKey({columns:[t.tripId,t.day]})]);

export const userPreferences=sqliteTable('user_preferences',{
 userId:text('user_id').primaryKey(),coverKey:text('cover_key'),coverVersion:integer('cover_version').notNull().default(0),
});
export const reservationLocations=sqliteTable('reservation_locations',{
 key:text('key').primaryKey(),tripId:text('trip_id').notNull().references(()=>trips.id),
 reservationId:text('reservation_id').notNull().references(()=>reservations.id),inputHash:text('input_hash').notNull(),
 status:text('status').notNull().default('pending'),point:text('point'),note:text('note').notNull().default(''),
 lease:text('lease'),leaseUntil:integer('lease_until').notNull().default(0),retryAt:integer('retry_at').notNull().default(0),
},t=>[index('reservation_locations_trip').on(t.tripId)]);
