import { Connection, getRepository } from 'typeorm';
import setup from './defaultEntities';

export async function loadDefaults(dbConnection: Connection) : Promise<any> {
    Object.keys(setup).forEach(async entity => {
        try {
            const instances = setup[entity];
            const alreadyInDB = await getRepository(entity).find();
            if (alreadyInDB.length == 0)
            {
                for (let instance of instances)
                    await dbConnection
                        .createQueryBuilder()
                        .insert()
                        .into(entity)
                        .values(instance)
                        .execute();
            }
        } catch (e) { console.log("Error loading entities : " + e); }
    });
}
