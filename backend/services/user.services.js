import { create } from '../model/user.model.js';


export async function createUser({
    firstname ,lastname, email, password
}){
    if (!firstname  || !email || !password) {
        throw new Error('All fields are required');
    }
  
    const user = create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });


    return user;

}