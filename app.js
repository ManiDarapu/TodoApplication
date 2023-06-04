const express = require("express");
const app = express();
app.use(express.json());

const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

//initialization
let db = null;

const initializeDbAndServer= async()=>{
try{
db = await open({
    filename : dbPath,
    driver : sqlite3.Database,
});
app.listen(3000, ()=>{
    console.log("Server is Running");
});
    } catch(e){
        console.log(`DB Error : ${e.message}`);
        process.exit(1);
    }
}
initializeDbAndServer();

const hasStatusAndPriority = (requestQuery)=>{
    return(
        requestQuery.priority !== undefined && 
        requestQuery.status !== undefined
    );
};

const hasCategoryAndStatus=(requestQuery)=>{
    return(
        requestQuery.category!== undefined && requestQuery.status!== undefined
    )
};

const hasCategoryAndPriority = (requestQuery)=>{
    return(
        requestQuery.category !== undefined && requestQuery.priority!== undefined
    )
};

const hasStatus = (requestQuery) =>{
    return requestQuery.status !== undefined
};

const hasPriority = (requestQuery)=>{
    return requestQuery.priority !== undefined
};

const hasCategory = (requestQuery)=>{
    return requestQuery.category !== undefined
};

//Get Todos
app.get("/todos/",async (request, response)=>{
    let getTodoQuery = null;
    const {search_q = "", priority, status, category} = request.query;
    let data = null;

    switch (true) {
        case hasStatusAndPriority(request.query):
            if (status === "TO DO" || status === "IN PROGRESS" || status ==="DONE"){
                if (priority==="HIGH" || priority ==="MEDIUM" || priority==="LOW"){
                    getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%" 
                    AND status = "${status}" AND priority = "${priority}";`;                    
                } else{
                    response.status(400);
                    response.send("Invalid Todo Priority");
                }
            } else{
                response.status(400);
                response.send("Invalid Todo Status");
            }
            break;
        case hasCategoryAndStatus(request.query):
            if (status === "TO DO" || status === "IN PROGRESS" || status ==="DONE"){
                if (category==="WORK" || category ==="HOME"|| category==="LEARNING"){
                    getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%"
            AND category = "${category}" AND status = "${status}";`;                
                }else{
                    response.status(400);
                    response.send("Invalid Todo Category");
                }
            } else{
                response.status(400);
                response.send("Invalid Todo Status");
            } 
            break;
        case hasCategoryAndPriority(request.query):
            if(category==="WORK" || category ==="HOME"|| category==="LEARNING"){
                if(priority==="HIGH" || priority ==="MEDIUM" || priority==="LOW"){
                    getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%" 
                    AND category = "${category}" AND priority = "${priority}";`;                    
                } else{
                    response.status(400);
                    response.send("Invalid Todo Priority");
                }
            } else{
                response.status(400);
                response.send("Invalid Todo Category");
            }
            break;
        case hasStatus(request.query):
            if(status === "TO DO" || status === "IN PROGRESS" || status ==="DONE"){
                getTodoQuery = `SELECt * FROM todo WHERE todo LIKE "%${search_q}%"
            AND status = "${status}";`;
            } else{
                response.status(400);
                response.send("Invalid Todo Status");
            }
            break;
        case hasPriority(request.query):
            if(priority==="HIGH" || priority ==="MEDIUM" || priority==="LOW"){
                getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%"
                AND priority = "${priority}";`;
            } else{
                response.status(400);
                response.send("Invalid Todo Priority");
            }
            break;
        case hasCategory(request.query):
            if(category==="WORK" || category ==="HOME"|| category==="LEARNING"){
                getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%"
                AND category = "${category}";`;
            } else{
                response.status(400);
                response.send("Invalid Todo Category");
            }
            break;
        default:
            getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%";`;
    }
    data = await db.get(getTodoQuery);
    response.send(data);
});

module.exports = app;

