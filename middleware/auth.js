import jwt from 'jsonwebtoken'

const auth = async ( req, res, next) => {
    try {
        const { authorization } = req.headers
        if(!authorization) {
            return res.status(401).json({ error: "Authorization token required"})
        }
        const token = authorization.split(" ")[1];
        const isCustomAuth =  token.length < 500;

        let decodedData; 

        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test')

            req.userId = decodedData?.id;
        }else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth; 