let jwt = require('jsonwebtoken');
require('dotenv').config();

/********************************************************************************
 * [新增/修改功能]: Redis 协同鉴权与环境变量密钥管理 (Redis Auth & JWT Secret Management)
 * [修改原因]: 避免硬编码秘密，引入 Redis 缓存与 Token 黑名单拦截（如用户登出后阻断旧 Token），提升认证性能与系统安全性
 ********************************************************************************/
const { getCache, setCache } = require('../connections/redis');
const secretKey = process.env.JWT_SECRET || "secret-key"; 

const generateToken = (user_info, callback) => {
    const { UserID, Name, UserType } = user_info; 

    let token = jwt.sign({
        UserID,
        Name,
        UserType, 
    }, secretKey, { expiresIn: '1h' });
    
    return callback(token);
}

const validateToken = async (req, res, next) => {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ error: "Invalid Authorization header format." });
    }

    try {
        // 1. 检查该 Token 是否已被加入 Redis 黑名单 (例如注销场景)
        const isBlacklisted = await getCache(`token:blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ error: "Token has been revoked/logged out." });
        }

        // 2. 检查 Redis 会话缓存是否存在
        const cachedSession = await getCache(`token:session:${token}`);
        if (cachedSession) {
            req.userID = cachedSession.UserID;
            req.userName = cachedSession.Name;
            req.userType = cachedSession.UserType;
            return next();
        }

        // 3. 若缓存未命中，进行标准的 JWT 签名解密
        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token." });
            }

            req.userID = decoded.UserID;
            req.userName = decoded.Name;
            req.userType = decoded.UserType; 

            // 写入 Redis 内存缓存加速下一次同 Token 请求 (TTL: 3600秒)
            await setCache(`token:session:${token}`, {
                UserID: decoded.UserID,
                Name: decoded.Name,
                UserType: decoded.UserType
            }, 3600);

            next();
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error during auth token validation." });
    }
};

exports.generateToken = generateToken;
exports.validateToken = validateToken;
/********************************************************************************/

