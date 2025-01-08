import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const shiftSubmission = async (shift,fillingMachine, wastedUnits) =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    const data = {
        "shift": shift,
        "production_count": fillingMachine,
        "production_waste": wastedUnits
    };   
    const record = await pb.collection('shift_submission').create(data);

    return record;
} 
export default shiftSubmission;