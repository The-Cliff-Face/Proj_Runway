//const app_name = 'projectrunway.tech/';
const app_name = 'evening-waters-58108-9313b08211b0.herokuapp.com/';
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

