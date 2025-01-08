import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const submitShift = async (data) =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    
    const record = await pb.collection('shifts').create(data);

    return record;
} 
export default submitShift;