package main

import (
    "fmt"
    "net/http"
    "github.com/gorilla/websocket"
)

// 1. Define the Upgrader
// This tool converts a standard HTTP request into a WebSocket connection
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool { return true },
}

// 2. Define the Handler
func handleConnections(w http.ResponseWriter, r *http.Request) {
    // Upgrade the connection
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer ws.Close()

    // Listen for messages
    for {
        messageType, msg, err := ws.ReadMessage()
        if err != nil {
            fmt.Println("Client disconnected")
            break
        }
        fmt.Printf("Received: %s\n", msg)

        // Echo the message back to the client
        if err := ws.WriteMessage(messageType, msg); err != nil {
            fmt.Println(err)
            break
        }
    }
}

// 3. Start the Server
func main() {
    http.HandleFunc("/ws", handleConnections)
    
    fmt.Println("Server started on :8080")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        fmt.Println("Error starting server:", err)
    }
}
