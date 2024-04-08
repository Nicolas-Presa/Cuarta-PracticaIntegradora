import userModel from '../models/user.model.js'


class UserServices{
    constructor(){}

    getUsersServices = async() => {
        try{
            const user = await userModel.find().lean();
            return user
        }catch(err){
            return err.message
        }
    }

    getUserByIdServices = async(id) => {
        try{
            const user = await userModel.findById(id);
            return user
        }catch(err){
            return err.message
        }
    }

    updateRoleToPremiumServices = async(userId, documents) => {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $set: { documents: documents, role: 'premium' } },
                { new: true }
            );
            return updatedUser;
        } catch(err) {
            return err.message
        }
    }

    updateRoleServices = async(userId, newRole) => {
        try{
            const user = await userModel.findByIdAndUpdate(
                userId,
                {$set: {role: newRole, documents: []}},
                {new: true}
                );
            return user
        }catch(err){
            return err.message
        }
    }
}

export { UserServices }