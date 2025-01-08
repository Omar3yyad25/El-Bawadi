import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const submitBreaks = async (data) =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    
    const record = await pb.collection('breaks').create(data);

    return record;
} 
export default submitBreaks;