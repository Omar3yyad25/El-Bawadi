import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const login = async (data) =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    const authData = await pb.collection('users').authWithPassword(
        data.username,
        data.password,
    );

    return pb;
} 
export default login;