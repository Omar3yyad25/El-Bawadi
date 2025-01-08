import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const getBreaks = async (activeShiftId) =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    const breaks = await pb.collection('breaks').getFullList();

    return breaks;
} 
export default getBreaks;