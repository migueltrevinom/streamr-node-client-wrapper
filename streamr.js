const config = require('./config');

const StreamrClient = require("streamr-client");

let client = null;

const sampleStreamID = 'gomat.eth/ambassadors-locations';

/**
 * add members to the data union
 * @param {object} dataUnion
 * @param {Array<string>} listOfAddresses
 * @author Miguel Trevino
 */
const addMembers = async (dataUnion, listOfAddresses) => {
    let response = {
        permissions: [],
        members: {},
        status: 200,
    };

    try {
        const sampleStreamObject = await _getStreamObject(sampleStreamID);

        for (let index = 0; index < listOfAddresses.length; index++) {
            response.permissions.push(await sampleStreamObject.grantPermission('stream_publish', listOfAddresses[index]));
        }

        response.members = await dataUnion.addMembers(listOfAddresses);
    } catch (exception) {
        response = {
            exception: exception.stack,
            error: 'cannot_add_member(s)',
            status: 403,
        };
    }

    return response;
};

/**
 * get ambassador DataUnion
 * @returns dataUnion
 * @author Miguel Trevino
 */
const getAmbassadorDataUnion = () => {
    const address = config.streamr.mode === 'production' ? config.streamr.production.ambassadors_data_union : config.streamr.staging.ambassadors_data_union;

    initClient();

    return client.getDataUnion(address);
};

/**
 * return the memebr stats from a DU
 * @param {object} dataUnion
 * @param {string} address
 * @author Miguel Trevino
 */
const getMemberStats = async (dataUnion, address) => {
    let response = {
        status: 200,
        stats: {},
    };

    try {
        response.stats = await dataUnion.getMemberStats(address);
    } catch (exception) {
        response = {
            status: 404,
            exception: exception.stack,
        };
    }

    return response;
};

/**
 * get user DataUnion
 * @returns dataUnion
 * @author Miguel Trevino
 */
const getUserDataUnion = () => {
    const address = config.streamr.mode === 'production' ? config.streamr.production.users_data_union : config.streamr.staging.users_data_union;

    initClient();

    return client.getDataUnion(address);
};

/**
 * get Stream Object
 * @param {*} streamId 
 * @author Miguel Trevino
 */
const _getStreamObject = async (streamId) => {
    initClient();

    try {
        const stream = await client.getStream(streamId);

        return stream;
    } catch (exception) {
        return null;
    }
};

/**
 * init Streamr Client
 * @author Miguel Trevino
 */
const initClient = () => {
    if (client) {
        return client;
    }

    client = new StreamrClient({
        auth: {
            privateKey: config.streamr.privateKey,
        },
    });

    return client;
};

/**
 * checks if the DU is deployed
 * @param {object} dataUnion
 * @author Miguel Trevino
 */
const isDeployed = async (dataUnion) => {
    return await dataUnion.isDeployed();
};

/**
 * is Member of a Data Union?
 * @param {object} dataUnion
 * @param {string} address
 * @author Miguel Trevino
 */
const isMember = async (dataUnion, address) => {
    let response = {
        status: 200,
        isMember: false,
    };

    try {
        response.isMember = await dataUnion.isMember(address);
    } catch (exception) {
        response = {
            status: 404,
            exception: exception.stack,
            isMember: false,
        };
    }

    return response;
}

/**
 * remove members from the DU
 * @param {object} dataUnion
 * @param {Array<string>} listOfAddresses
 * @author Miguel Trevino
 */
const partMembers = async (dataUnion, listOfAddresses) => {
    let response = null;

    try {
        response = await dataUnion.removeMembers(listOfAddresses);

        response.status = 200;
    } catch (exception) {
        response = {
            exception: exception.stack,
            error: 'cannot_remove_member(s)',
            status: 403,
        };
    }

    return response;
}

module.exports = {
    addMembers,
    getAmbassadorDataUnion,
    getMemberStats,
    getUserDataUnion,
    initClient,
    isDeployed,
    isMember,
    partMembers,
};