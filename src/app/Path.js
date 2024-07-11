const app_name = 'projectrunway.tech/';
exports.buildPath = 
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + app_name + route;
    }
    else
    {        
        return 'http://localhost:3001/' + route;
    }
}

