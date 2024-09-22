const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: process.env.CACHE_DURATION || 3600 });

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    if(cachedResponse) {
        return res.json(cachedResponse);
    }else{
        res.sendResponse = res.json;
        res.json = (body) => {
            cache.set(key, body);
            res.sendResponse(body);
        };
        next();
    }
};

module.exports = cacheMiddleware;