using API.Modles;

namespace API.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser appUser);
    }
}