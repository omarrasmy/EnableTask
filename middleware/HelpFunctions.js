const User=require('../model/User')

exports.pagination = (Count, verision, FilterPartion) => {
    let Parts = []
    if ((verision + 1) * Count > FilterPartion.length) {
        for (var i = verision * Count; i < FilterPartion.length; i++) {
            Parts.push(FilterPartion[i])
        }
    }
    else {
        for (var i = verision * Count; i < (verision + 1) * Count; i++) {
            Parts.push(FilterPartion[i])
        }
    }
    return Parts
}
exports.Login = async (req) => {

    try {
        const user = await User.findByCredentials(req.Email, req.Password);
        const token= await user.GenerateTokens();
        return {"message":"Login Successfully",token,user}
    } catch (e) {
        throw ( e)
    }

}