using BackendTask.DTO;
using BackendTask.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace TaskManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<Users> _userManager;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(UserManager<Users> userManager, ILogger<ProfileController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        // 👤 GET: api/Profile
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                // Step 1: Get userId from token claims
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("User ID not found in claims.");
                    return Unauthorized("User is not authenticated.");
                }

                // Step 2: Find user by ID
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found while fetching profile", userId);
                    return NotFound("User not found.");
                }

                // Step 3: Return profile data
                var profile = new
                {
                    user.UserName,
                    user.Email,
                    // Add other properties here if needed
                };

                _logger.LogInformation("Successfully fetched profile for user {UserId}", userId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching profile for user.");
                return StatusCode(500, "Internal server error.");
            }
        }



        // 🔐 PUT: api/Profile/change-password
                [HttpPut("change-password")]
                public async Task<IActionResult> ChangePassword(
                  [FromBody] ChangePasswordDto model)
                {
                  if (!ModelState.IsValid || model == null)
                   {
                      return BadRequest("Invalid data.");
                   }

                 try
                 {
                     // Use the same user ID claim as GetProfile()
                     var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                    if (string.IsNullOrEmpty(userId))
                    {
                    _logger.LogWarning(
                        "User ID not found in claims while changing password.");

                    return Unauthorized("User is not authenticated.");
                }

                // Find the currently logged-in user by ID
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    _logger.LogWarning(
                        "User with ID {UserId} not found while changing password",
                        userId);

                    return NotFound("User not found.");
                }

                // Change the password using ASP.NET Core Identity
                var result = await _userManager.ChangePasswordAsync(
                    user,
                    model.CurrentPassword,
                    model.NewPassword);

                if (!result.Succeeded)
                {
                    _logger.LogWarning(
                        "Failed to change password for user {UserId}",
                        user.Id);

                    return BadRequest(
                        result.Errors.Select(e => e.Description));
                }

                _logger.LogInformation(
                    "Successfully changed password for user {UserId}",
                    user.Id);

                return Ok("Password changed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An error occurred while changing password.");

                return StatusCode(500, "Internal server error.");
            }
        }
    }
}