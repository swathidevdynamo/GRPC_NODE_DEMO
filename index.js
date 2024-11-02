const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

const todos = [
    {
        id: '1',
        title: 'Todo1',
        content: 'Content of todo 1'
    },
    {
        id: '2',
        title: 'Todo2',
        content: 'Content of todo 2'
    },
    {
        id: '3',
        title: 'Todo3',
        content: 'Content of todo 3'
    }
];

function main() {
    const server = new grpc.Server();
    server.addService(todoProto.TodoService.service, {
        listTodos: (call, callback) => {
            callback(null, todos);
        },
        createTodo: (call, callback) => {
            let incomingNewTodo = call.request;
            todos.push(incomingNewTodo);
            callback(null, incomingNewTodo);
        },
        getTodo: (call, callback) => {
            let incomingTodoRequest = call.request;
            let todoId = incomingTodoRequest.id;
            const response = todos.filter((todo) => todo.id = todoId);
            if (response.length > 0) {
                callback(null, response);
            } else {
                callback({
                    message: 'Todo not found'
                }, null);
            }
        }
    });
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('GRPC server started');
    });
}
main();
