import { extractTextBetween } from "~helpers";

// API CONSTANTS
const API_URL = "https://youtubechat-api.herokuapp.com/"
const API_KEY = "1f7c267c-6761-44d5-bb03-54ba0fe284e2";

async function addVideoToCollection(video_id: string) : Promise<Record<string, any>> {
    console.log("addVideoToCollection called for video_id: " + video_id);
    const apiUrl = new URL(API_URL + "/chat");
    apiUrl.searchParams.append('video_id', video_id);
    const headers = {
        'Authorization': API_KEY
    }
    const postData = {
        method: 'POST',
        headers: headers,
    } 
    try {
        const response = await fetch(apiUrl, postData)
        const data = await response.json();
        if (data['success']) {
            console.log("Successfully added video to collection");
        }
        else {
            console.log("Failed to add video to collection");
            const errorMessage = data['error'].toString()
            const errorReason = extractTextBetween("by:", "If you are", errorMessage)
            data['error'] = errorReason + " Please try again!"
        }
        return data
    } catch (error) {
        console.log(error);
        return {
            'success': false,
            'error': 'Something went wrong on our end. Please try again later!'
        }
    }
}

async function queryVideo(query: string, video_id: string) : Promise<Record<string, any>> {
    console.log("queryVideo called for video_id: " + video_id);
    const apiUrl = new URL(API_URL + "/chat");
    const headers = {
        'Authorization': API_KEY
    }
    const params = {
        'query': query,
        'video_id': video_id
    }   
    for (const key in params) {
        apiUrl.searchParams.append(key, params[key]);
    }
    const getData = {
        method: 'GET',
        headers: headers,
    } 
    try {
        const response = await fetch(apiUrl, getData)
        const data = await response.json();
        return data
    } catch (error) {
        console.log(error);
    }
}

export { addVideoToCollection, queryVideo}