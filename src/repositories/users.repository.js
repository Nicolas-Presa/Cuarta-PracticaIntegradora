class UserDTO {
    constructor(user) {
        this.user = user;
        this.user.full_name = this.user.first_name + " " + this.user.last_name;
    }
    
    getUser() {
        return this.user
    }
}


export { UserDTO }