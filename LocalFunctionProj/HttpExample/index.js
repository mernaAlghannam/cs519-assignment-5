module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        // Add a message to the Storage queue,
        // which is the name passed to the function.
        context.log(req.query.name)
        context.bindings.msg = req.query.name;
        context.res = {
        // status: 200, /* Defaults to 200 */
        body: req.query.name
    };
    context.res = {
        body: "hello"
    }
}
};