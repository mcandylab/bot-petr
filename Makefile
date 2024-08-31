include .env
export $(shell sed 's/=.*//' .env)

init:
	npm run build
	npm run start

supabase-gen-schema:
	supabase gen types typescript --project-id $(SUPABASE_PROJECT_ID) > src/types/database.types.ts
