import { UserServices } from '../services/user.mongo.dao.js'



const services = new UserServices();

class UserManager{
    constructor(){}

    async updateRole(userId, newRole) {
        try{
            return await services.updateRoleServices(userId, newRole)
        }catch(err){
            return err.message
        }
    }
}

export { UserManager }