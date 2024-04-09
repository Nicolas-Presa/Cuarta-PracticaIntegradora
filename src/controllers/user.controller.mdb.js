import { UserServices } from '../services/user.mongo.dao.js'



const services = new UserServices();

class UserManager{
    constructor(){}

    async getUsers() {
        try{
            return await services.getUsersServices()
        }catch(err){
            return err.message
        }
    }

    async getUserById(id) {
        try{
            return await services.getUserByIdServices(id)
        }catch(err){
            return err.message
        }
    }

    async updateRoleToPremium(userId, documents){
        try{
            return await services.updateRoleToPremiumServices(userId, documents)
        }catch(err){
            return err.message
        }
    }

    async updateRole(userId, newRole) {
        try{
            return await services.updateRoleServices(userId, newRole)
        }catch(err){
            return err.message
        }
    }

    async deleteUserById(userId) {
        try{
            return await services.deleteUserByIdServices(userId);
        }catch(err){
            return err.message
        }
    }

    async deleteUsersById(users){
        try{
            return await services.deleteUsersByIdServices(users)
        }catch(err){
            return err.message
        }
    }
}

export { UserManager }