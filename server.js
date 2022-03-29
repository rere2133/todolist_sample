const { log } = require('console')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const errorHandler = require('./errorHandler')

let todos = []

const requestListener = (req, res) => {
    let body = ""
    req.on('data', chunk => {
        body += chunk
    })
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    // console.log(req.url);
    // console.log(req.method);
    if (req.url == '/todos' && req.method == 'GET') {
        // console.log('success');
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            status: true,
            data: todos,
        }))
        res.end()
    } else if (req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try {
                console.log(JSON.parse(body).title);
                let title = JSON.parse(body).title
                if (title !== undefined) {
                    let todo = {
                        id: uuidv4(),
                        title,
                    }
                    todos.push(todo)
                    res.writeHead(200, headers)
                    res.write(JSON.stringify({
                        status: true,
                        data: todos,
                    }))
                    res.end()
                } else {
                    errorHandler(res)
                }
            } catch {
                errorHandler(res)
            }
        })

    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        req.on('end', () => {
            try {
                let id = req.url.split('/').pop()
                let idx = todos.findIndex(el => el.id == id)
                let editTodo = JSON.parse(body).title
                todos[idx].title = editTodo
                res.writeHead(200, headers)
                res.write(JSON.stringify({
                    status: true,
                    data: todos
                }))
                res.end()
            } catch {
                errorHandler(res)
            }
        })
    } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
        console.log(req.url.split('/'));
        let id = req.url.split('/').pop()
        let idx = todos.findIndex(el => el.id == id)
        todos = todos.slice(idx, 1)
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            status: true,
            data: todos
        }))
        res.end()
    } else if (req.url == '/todos' && req.method == 'DELETE') {
        todos.length = 0
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            status: true,
            data: todos
        }))
        res.end()
    } else if (req.url == '/todos' && req.method == 'OPTIONS') {
        // console.log('success');
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            status: true,
            method: 'options'
        }))
        res.end()
    }
    else {
        res.writeHead(404, headers)
        res.write(JSON.stringify({
            status: false,
            message: '404 page not found!'
        }))
        res.end()
    }
}

const server = http.createServer(requestListener)
server.listen(process.env.PORT || 3000)


