import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const shiftSubmission = async () =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    
    const record = await pb.collection('shift_submission').getFullList();

    return record;
} 
export default shiftSubmission;