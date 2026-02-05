import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_v8OMS3lAPGDU@ep-lucky-hall-abggbxb0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function main() {
    try {
        const result = await sql`SELECT email, role FROM users`;
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
}
main();
