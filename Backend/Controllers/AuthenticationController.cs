using BackendTask.Model;
using BackendTask.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<Users> _userManager;
        private readonly SignInManager<Users> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthenticationController(
            UserManager<Users> userManager,
            SignInManager<Users> signInManager,
            ITokenService tokenService,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _roleManager = roleManager;
        }

       
// Inside AuthenticationController

public class RegisterModel
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;
    }

public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
}


        // Register User
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new Users { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Ensure "User" role exists
                var roleExists = await _roleManager.RoleExistsAsync("User");
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole("User"));
                }

                // Add the user to the "User" role by default
                await _userManager.AddToRoleAsync(user, "User");

                return Ok(new { Message = "User registered successfully", User = new { model.Username, model.Email } });
            }

            return BadRequest(new { Errors = result.Errors.Select(e => e.Description).ToList() });
        }

        // Login User
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)


        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
                return Unauthorized(new { Message = "Invalid credentials" });

            var result = await _signInManager.CheckPasswordSignInAsync(
               user,
               model.Password,
               lockoutOnFailure: true
            );

            if (result.Succeeded)
            {
                // Fetch roles for the user using Identity
                var roles = await _userManager.GetRolesAsync(user);

                // Generate JWT token (await the asynchronous method)
                var token = await _tokenService.GenerateJwtToken(user);

                // Return the token and role(s)
                return Ok(new
                {
                    Token = token,
                    ExpiresIn = 3600, // Token expires in 1 hour
                    Role = roles.FirstOrDefault() // Assuming one role per user (Admin or User)
                });
            }

            return Unauthorized(new { Message = "Invalid credentials" });
        }
    }
}