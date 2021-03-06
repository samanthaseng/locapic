export default function(POIList = [], action) {
    if(action.type === 'savePOI') {
        var POIListCopy = [...POIList];
        POIListCopy.push(action.POI)
        return POIListCopy;
    } else if (action.type === 'deletePOI') {
        var POIListCopy = [...POIList];
        POIListCopy = POIListCopy.filter(POI => POI.id !== action.POIId);
        return POIListCopy;
    } else if (action.type === 'getPOI') {
        return action.POIList;
    } else {
        return POIList;
    }
}