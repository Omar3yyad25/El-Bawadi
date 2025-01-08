import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_BASE_URL);

const submitMalufinction = async (stationId,activeShift,reportedTime, resolvedTime, reason) =>{
    pb.autoCancellation(false);
    pb.cancelAllRequests()

    const data = {
        "station": stationId,
        "shift": activeShift,
        "reported_time": reportedTime,
        "resolved_time": resolvedTime,
        "solved": true,
        "Reason": reason
    };    
    const record = await pb.collection('malufunctions').create(data);

    return record;
} 
export default submitMalufinction;