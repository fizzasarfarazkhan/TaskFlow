using BackendTask.Model;

namespace BackendTask.Services
{
    public interface ITokenService
    {
        Task<string> GenerateJwtToken(Users user);
    }
}


