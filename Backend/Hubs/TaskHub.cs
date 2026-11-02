
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BackendTask.Hubs
{
    [Authorize]
    public class Taskhub : Hub
    {
    }
}
