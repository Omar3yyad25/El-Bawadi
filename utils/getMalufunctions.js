import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const getMalufunctions = async () =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    const shifts = await pb.collection('malufunctions').getFullList();

    return shifts;
} 
export default getMalufunctions;