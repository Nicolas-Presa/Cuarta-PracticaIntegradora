import userModel from '../models/user.model.js'


class UserServices{
    constructor(){}

    updateRoleServices = async(userId, newRole) => {
        try{
            const user = await userModel.findByIdAndUpdate(
                userId,
                {$set: {role: newRole}},
                {new: true}
                );
            return user
        }catch(err){
            return err.message
        }
    }
}

export { UserServices }