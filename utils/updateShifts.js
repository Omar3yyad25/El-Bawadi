import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);
 
const updateShift = async(id, data) =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    const record = await pb.collection('shifts').update(id, data);

    return record;
}
export default updateShift;