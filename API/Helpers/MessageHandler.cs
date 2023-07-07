using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Newtonsoft.Json;
using System.Net.WebSockets;
using System.Text;

namespace API.Helpers
{
    public static class MessageHandler
    {
        private static Dictionary<int, WebSocket> connectedClients = new Dictionary<int, WebSocket>();

        public static async Task HandleWebSocketMessages(
            WebSocket webSocket,
            int user1Id,
            int user2Id,
            IUnitOfWork uow,
            IMapper mapper)
        {
            connectedClients[user1Id] = webSocket;

            try
            {
                var buffer = new byte[4096];

                while (webSocket.State == WebSocketState.Open)
                {
                    var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        break;
                    }
                }
            }
            finally
            {
                connectedClients.Remove(user1Id);
                webSocket.Dispose();
            }
        }

        public static async Task SendMessageToUser(int userId, MessageDTO message, IUnitOfWork uow, IMapper mapper)
        {
            if (connectedClients.TryGetValue(userId, out WebSocket webSocket))
            {
                var messageBytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));
                var buffer = new ArraySegment<byte>(messageBytes, 0, messageBytes.Length);

                await webSocket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}
